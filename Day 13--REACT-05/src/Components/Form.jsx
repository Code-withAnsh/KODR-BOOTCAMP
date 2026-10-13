import React, { useState } from "react";

const Form = () => {
    const [formData, setformData] = useState({})
    console.log("form rendering..");
    
    console.log(formData);
    
  return (
    <form className="w-full max-w-md mx-auto mt-12 p-8 bg-white rounded-2xl shadow-2xl shadow-black/30 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Create Product</h2>
      <p className="text-sm text-gray-500 -mt-4">
        Add your product details below.
      </p>

      <input
      onChange={(e)=>setformData({...formData,productName:e.target.value })}
        type="text"
        placeholder="Product Name"
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
      />

      <input
        type="number"
        placeholder="Price (₹)"
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
      />

      <select
        defaultValue=""
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
      >
        <option value="" disabled>
          Select a category
        </option>
        <option value="mens">Mens</option>
        <option value="womens">Womens</option>
        <option value="kids">Kids</option>
      </select>

      <input
        type="text"
        placeholder="Image URL"
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
      />

      <button
        type="button"
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition duration-200"
      >
        Create Product
      </button>
    </form>
  );
};

export default Form;
