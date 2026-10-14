import { createContext, useEffect, useState } from 'react'

export const myData = createContext();

export const ContextProvider = ({ children }) => {
let storedCart = localStorage.getItem('cart')
let savedCart = JSON.parse(storedCart);
let storedToggle = localStorage.getItem('cartOpen');
let savedToggle = JSON.parse(storedToggle);
const [toggle, setToggle] = useState(savedToggle || false);
const [productData, setProductData] = useState(savedCart || []);

useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(productData));
}, [productData]);

useEffect(() => {
    localStorage.setItem("cartOpen", JSON.stringify(toggle));
}, [toggle]);

return (
    <myData.Provider value={{ productData, setProductData, toggle, setToggle }}>
        {children}
    </myData.Provider>
);

};