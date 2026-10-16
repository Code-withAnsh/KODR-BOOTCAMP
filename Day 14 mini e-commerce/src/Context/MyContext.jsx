import { createContext, useEffect, useState } from 'react'

// The context is intentionally kept in this module for backwards compatibility.
// eslint-disable-next-line react-refresh/only-export-components
export const myData = createContext();

export const ContextProvider = ({ children }) => {
let storedCart = localStorage.getItem('cart')
let savedCart = JSON.parse(storedCart);
const [productData, setProductData] = useState(savedCart || []);
const [registeredUser, setregisteredUser] = useState(
    JSON.parse(localStorage.getItem('registeredUser')),
    []);
    const [loggedInUser, setloggedInUser] = useState([
      JSON.parse(localStorage.getItem("loggedinUser")),
    ]);
useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(productData));
}, [productData]);

return (
  <myData.Provider
    value={{
      productData,
      setProductData,
      registeredUser,
      setregisteredUser,
      loggedInUser,
      setloggedInUser,
    }}
  >
    {children}
  </myData.Provider>
);

};