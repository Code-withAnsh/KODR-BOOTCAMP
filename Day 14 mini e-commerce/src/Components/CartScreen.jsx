import { useContext } from "react";
import Navbar from "./Navbar";
import { myData } from "../Context/MyContext";

const CartScreen = () => {
  const { productData, setProductData } = useContext(myData);
console.log(productData);
let quantitySum = 0;
const productItem = () =>{
    for(let i=0;i<productData.length;i++){
   let r1 = productData[i]
   let actualQuantity = r1.quantity
   quantitySum = actualQuantity
    }
    return quantitySum
}

const totalPrice = () => {
  return productData.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
};
const taxAmount = () => {
  return totalPrice() * 0.18;
};
const totalWithTax = () => {
  return totalPrice() + taxAmount();
};

const removeHandler = (id) => {
  const filteredProducts = productData.filter((item) => item.id !== id);
  setProductData(filteredProducts);
};

const reduceQuantity = (id) => {
 setProductData((previous) =>
   previous
     .map((item) =>
       item.id === id
         ? { ...item, quantity: item.quantity - 1 }
         : item
     )
     .filter((item) => item.quantity > 0)
 );
};





  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="mb-8 border-b border-slate-200 pb-7">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            Your selection
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Your cart
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-4">
            {productData.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:gap-6 sm:p-5"
              >
                <div className="flex h-44 w-full shrink-0 items-center justify-center rounded-xl bg-slate-100 p-5 sm:h-36 sm:w-36 sm:p-3">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="h-full w-full object-contain mix-blend-multiply"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                        {item.product.category}
                      </p>
                      <h2 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-slate-800 sm:text-base">
                        {item.product.title}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeHandler(item.id)}
                      className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-all duration-200 hover:border-red-600 hover:bg-red-600 hover:text-white active:scale-95 sm:px-4 sm:text-sm"
                    >
                      <span className="sm:hidden">Remove</span>
                      <span className="hidden sm:inline">Remove item</span>
                    </button>
                  </div>
                  <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <p className="text-lg font-bold text-slate-950">
                      ${item.product.price.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
                        Qty: {item.quantity}
                      </div>
                      <button
                        type="button"
                        onClick={() => reduceQuantity(item.id)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-100 active:scale-95 sm:px-4 sm:text-sm"
                      >
                        − <span className="hidden sm:inline">Reduce</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-950">
              Order summary
            </h2>

            <div className="mt-5 space-y-4 border-b border-slate-100 pb-5 text-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span>items</span>
                <span className="font-medium text-slate-900">
                  {productItem()}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Amount</span>
                <span className="font-medium text-slate-900">
                  ${totalPrice().toFixed()}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Tax</span>
                <span className="font-medium text-slate-900">
                  ${taxAmount().toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-5">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="text-xl font-bold text-slate-950">
                ${totalWithTax().toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              className="mt-6 w-full rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
            >
              Checkout
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CartScreen;