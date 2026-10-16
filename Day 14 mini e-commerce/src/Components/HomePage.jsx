import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import ProductCard from "./Home";

const HomePage = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const res = await axios.get("https://fakestoreapi.com/products");
      setUserData(res.data);
    };

    getProducts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <section className="mb-8 flex flex-col gap-3 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Curated essentials
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Shop our collection
            </h1>
          </div>

          <p className="text-sm text-slate-500">
            Everyday pieces, thoughtfully selected
          </p>
        </section>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {userData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default HomePage;
