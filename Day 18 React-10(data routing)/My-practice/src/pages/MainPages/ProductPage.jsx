import { useEffect, useState } from "react";
import { getAllproductsApi } from "../../api/ProductApi";
import ProductCard from "../../Components/ProductCard";

const ProductPage = () => {
  const [productData, setproductData] = useState([]);

  let getproducts = async () => {
    let data = await getAllproductsApi();
    console.log(data);
    setproductData(data.products);
  };

  useEffect(() => {
    getproducts();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {productData.map((val) => (
        <ProductCard key={val.id} product={val} />
      ))}
    </div>
  );
};

export default ProductPage;
