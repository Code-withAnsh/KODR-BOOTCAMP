import axios from "axios"
import { useEffect, useState } from "react";

const App = () => {
  const [productsdata, setproductsdata] = useState([])
const [searchvalue, setsearchvalue] = useState(null)
const [filteredValue, setfilteredValue] = useState(null)
  

  let getProducts = async () => {

    let data = await axios.get("https://fakestoreapi.com/products")
    setproductsdata(data.data)

    console.log(data.data);
    
    
  }

  let filteredProducts = () =>{
    let products = productsdata.filter((val)=>
    val.title.toLowerCase().includes(searchvalue.toLowerCase()))
    setfilteredValue(products)
    console.log(products);
    
  }
  
  useEffect(() => {
  getProducts()
  }, [])
  useEffect(() => { 
 filteredProducts()
  }, [searchvalue])
  

  return (
    <div className="h-screen w-screen bg-gray-800 text-white p-4">
      <input className="border-2  p-1" type="text" placeholder="search" 
      onChange={(e)=>setsearchvalue(e.target.value)}
      />

      {filteredValue
        ? filteredValue.map((val) => <h1 key={val.id}>{val.title}</h1>)
        : productsdata.map((val) => <h1 key={val.id}>{val.title}</h1>)}
    </div>
  );
}

export default App