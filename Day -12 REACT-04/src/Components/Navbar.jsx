import React, { useContext } from "react";
import { MyData } from "../Context/MyContext";

const Navbar = () => {
  let {toggle,settoggle}= useContext(MyData)
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-gray-600 text-white shadow-md">
      <h3 className="text-2xl font-bold">Logo</h3>

      <ul className="flex gap-8 text-white font-medium">
        <li className="cursor-pointer hover:text-blue-600">Home</li>
        <li className="cursor-pointer hover:text-blue-600">About</li>
        <li className="cursor-pointer hover:text-blue-600">Contacts</li>
      </ul>

      <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
      onClick={()=>settoggle((prev)=>!prev)}
      >
        {toggle?"close":"create"}
      </button>
    </nav>
  );
};

export default Navbar;
