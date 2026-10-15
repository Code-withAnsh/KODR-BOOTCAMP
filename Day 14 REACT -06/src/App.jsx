import React, { useEffect, useState } from "react";
import axios from "axios";
const App = () => {
  const [products, setproducts] = useState([])
  let getProducts = async () =>  {
   try {
    
     let res = await axios.get("https://fakestoreapi.com/products");
     console.log(res.data);
     setproducts(res.data); 
   } catch (error) {
    console.log("error is ",err);
    
   }
  }

  useEffect(()=>{
    getProducts()
  },[])
  return (

    <div className="h-screen w-screen bg-gray-800 p-4 text-white text-2xl">
      <h1>items are</h1>
{products.map((val)=>(
  <h1>{val.title}</h1>
))}
    </div>
  );
};

export default App;
