use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use mongodb::{bson::doc, Client, Collection};
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, env, sync::Arc};
use tokio::sync::RwLock;

#[derive(Clone, Serialize, Deserialize)]
struct Product {
    #[serde(rename = "_id")]
    id: String,
    name: String,
    category: String,
    price: i64,
    stock: i64,
}

#[derive(Clone, Serialize, Deserialize)]
struct Order {
    #[serde(rename = "_id")]
    order_id: String,
    user_id: String,
    product_id: String,
}

#[derive(Clone)]
struct AppState {
    products: Arc<RwLock<HashMap<String, Product>>>,
    orders: Arc<RwLock<HashMap<String, Vec<Order>>>>,
    purchased: Arc<RwLock<std::collections::HashSet<String>>>,
    product_db: Collection<Product>,
    order_db: Collection<Order>,
}

#[derive(Deserialize)]
struct ListQuery {
    category: String,
    page: Option<usize>,
    limit: Option<usize>,
}

#[derive(Deserialize)]
struct CreateOrder {
    #[serde(rename = "userId")]
    user_id: String,
    #[serde(rename = "productId")]
    product_id: String,
}

#[derive(Serialize)]
struct OrderResponse {
    #[serde(rename = "orderId")]
    order_id: String,
    #[serde(rename = "userId")]
    user_id: String,
    #[serde(rename = "productId")]
    product_id: String,
}

#[derive(Serialize)]
struct ListResponse {
    items: Vec<Product>,
    page: usize,
    limit: usize,
    total: usize,
}

fn error(status: StatusCode, value: &'static str) -> impl IntoResponse {
    (status, Json(serde_json::json!({ "error": value })))
}

async fn health() -> impl IntoResponse {
    Json(serde_json::json!({ "status": "ok" }))
}

async fn get_product(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    match state.products.read().await.get(&id).cloned() {
        Some(product) => (StatusCode::OK, Json(serde_json::json!(product))).into_response(),
        None => error(StatusCode::NOT_FOUND, "PRODUCT_NOT_FOUND").into_response(),
    }
}

async fn list_products(
    State(state): State<AppState>,
    Query(query): Query<ListQuery>,
) -> impl IntoResponse {
    let page = query.page.unwrap_or(1).max(1);
    let limit = query.limit.unwrap_or(20).clamp(1, 50);
    let mut items: Vec<_> = state.products.read().await.values()
        .filter(|p| p.category == query.category)
        .cloned()
        .collect();
    items.sort_by(|a, b| a.price.cmp(&b.price).then(a.id.cmp(&b.id)));
    let total = items.len();
    let from = (page - 1) * limit;
    let items = items.into_iter().skip(from).take(limit).collect();
    Json(ListResponse { items, page, limit, total }).into_response()
}

async fn create_product(
    State(state): State<AppState>,
    Json(product): Json<Product>,
) -> impl IntoResponse {
    let mut products = state.products.write().await;
    if products.contains_key(&product.id) {
        return error(StatusCode::CONFLICT, "PRODUCT_EXISTS").into_response();
    }
    if state.product_db.insert_one(product.clone()).await.is_err() {
        return error(StatusCode::CONFLICT, "PRODUCT_EXISTS").into_response();
    }
    products.insert(product.id.clone(), product.clone());
    (StatusCode::CREATED, Json(product)).into_response()
}

async fn create_order(
    State(state): State<AppState>,
    Json(input): Json<CreateOrder>,
) -> impl IntoResponse {
    let key = format!("{}:{}", input.user_id, input.product_id);
    let mut products = state.products.write().await;
    let Some(product) = products.get_mut(&input.product_id) else {
        return error(StatusCode::NOT_FOUND, "PRODUCT_NOT_FOUND").into_response();
    };
    let mut purchased = state.purchased.write().await;
    if purchased.contains(&key) {
        return error(StatusCode::CONFLICT, "ALREADY_PURCHASED").into_response();
    }
    if product.stock <= 0 {
        return error(StatusCode::CONFLICT, "SOLD_OUT").into_response();
    }
    product.stock -= 1;
    purchased.insert(key);
    let order = Order {
        order_id: format!("o_{}", uuid()),
        user_id: input.user_id.clone(),
        product_id: input.product_id.clone(),
    };
    if state.order_db.insert_one(order.clone()).await.is_err() {
        product.stock += 1;
        purchased.remove(&format!("{}:{}", input.user_id, input.product_id));
        return error(StatusCode::INTERNAL_SERVER_ERROR, "INTERNAL_ERROR").into_response();
    }
    state.orders.write().await.entry(input.user_id.clone()).or_default().push(order.clone());
    (StatusCode::CREATED, Json(OrderResponse {
        order_id: order.order_id,
        user_id: order.user_id,
        product_id: order.product_id,
    })).into_response()
}

async fn user_orders(
    State(state): State<AppState>,
    Path(user_id): Path<String>,
) -> impl IntoResponse {
    let orders = state.orders.read().await.get(&user_id).cloned().unwrap_or_default();
    Json(serde_json::json!({ "userId": user_id, "orders": orders })).into_response()
}

fn uuid() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos().to_string()
}

#[tokio::main]
async fn main() {
    let mongo_url = env::var("MONGO_URL").expect("MONGO_URL is required");
    let db_name = env::var("MONGO_DB").unwrap_or_else(|_| "shopv2".into());
    let client = Client::with_uri_str(mongo_url).await.expect("Mongo connection failed");
    let db = client.database(&db_name);
    let state = AppState {
        products: Arc::new(RwLock::new(HashMap::new())),
        orders: Arc::new(RwLock::new(HashMap::new())),
        purchased: Arc::new(RwLock::new(std::collections::HashSet::new())),
        product_db: db.collection("products"),
        order_db: db.collection("orders"),
    };
    for product in state.product_db.find(doc! {}).await.expect("product query failed") {
        let product = product.expect("product decode failed");
        state.products.write().await.insert(product.id.clone(), product);
    }
    let app = Router::new()
        .route("/health", get(health))
        .route("/products", get(list_products).post(create_product))
        .route("/products/{id}", get(get_product))
        .route("/orders", post(create_order))
        .route("/users/{user_id}/orders", get(user_orders))
        .with_state(state);
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8081").await.unwrap();
    println!("Rust server listening on 0.0.0.0:8081");
    axum::serve(listener, app).await.unwrap();
}
