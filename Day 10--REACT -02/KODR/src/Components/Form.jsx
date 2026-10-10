import { useState } from "react";
import {nanoid} from "nanoid";

const Form = ({setUserData,settoggle,isEditedUser,setisEditedUser}) => {
const [formData, setformData] = useState(
  isEditedUser||
  
  {
    name:"",
    email:"",
    imageURL:""
})

let hadnleChange = (e) =>{
let {name,value} = e.target;
setformData((prevData)=>({
    ...prevData,[name]:value
    
}))
 

}
let handleSubmit = (e)=>{
e.preventDefault()


    setUserData((prev) => {
      let arr;
      if(isEditedUser){
   arr = prev.map((user)=>user.id===isEditedUser.id?{...user,...formData}:user) 
   
      }else{
        arr = [...prev,{...formData,id:nanoid()}]
      }
      localStorage.setItem("usersArr", JSON.stringify(arr));
      return arr;
  
});
     setformData({
       name: "",
       email: "",
       imageURL: "",
     });
   settoggle(false);
   setisEditedUser(null);

}
  




  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-2xl bg-gray-50 p-6 text-base text-gray-800 shadow-xl"
    >
      <input
        value={formData.name}
        onChange={hadnleChange}
        name="name"
        type="text"
        placeholder="Name"
        aria-label="Name"
        required
        className="rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />

      <input
        value={formData.email}
        onChange={hadnleChange}
        name="email"
        type="email"
        placeholder="Email"
        aria-label="Email"
        required
        className="rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
      <input
        value={formData.imageURL}
        onChange={hadnleChange}
        name="imageURL"
        type="url"
        placeholder="Image URL"
        aria-label="Image URL"
        required
        className="rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
      <button
        type="submit"
        className="rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
      >
        Create
      </button>
    </form>
  );
}

export default Form