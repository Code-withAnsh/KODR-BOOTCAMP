import { useState } from "react";

const App = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  console.log(formData);
  
  let handlChange = (e) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log("hello");
  };
  return (
    <div className="h-screen  bg-gray-800 p-2 text-white text-2xl flex justify-center items-center flex-col gap-4">
      <h1>Form Handling...</h1>
      <form
        // onSubmit={(e) => e.preventDefault()}
        className=" bg-black flex flex-col gap-2 p-10 w-100 rounded-3xl "
        action=""
      >
        <input
          name="name"
          onChange={handlChange}
          className="p-2 rounded-2xl border-2"
          type="text"
          placeholder="Enter your name"
        />
        <input
          onChange={handlChange}
          name="email"
          className="bg-gray-700 p-2 rounded-md"
          type="email"
          placeholder="Enter your email"
        />
        <input
          onChange={handlChange}
          name="password"
          className="bg-gray-700 p-2 rounded-md"
          type="password"
          placeholder="Enter your password"
        />
      </form>
      <button className="p-3 rounded-2xl border-2">Submit</button>
    </div>
  );
};

export default App;
