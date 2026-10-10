import { useState } from "react";
import Navbar from "./Components/Navbar";
import UserCard from "./Components/UserCard";
import Form from "./Components/Form";
const App = () => {
  const [userData, setUserData] = useState(()=>{
   return JSON.parse(localStorage.getItem("usersArr")) || []
  })
  const [toggle, settoggle] = useState(false)
  const [isEditedUser, setisEditedUser] = useState(null)
  
let handleDelete = (id) =>{
  let arr = userData.filter((val)=>val.id!==id)
  setUserData(arr)
    localStorage.setItem("usersArr", JSON.stringify(arr));

}

let handleUpdate = (user)=>{
  setisEditedUser(user)
  settoggle(true)
  console.log(user);
  
}
  return (
    <div className="h-[100%] w-screen bg-gray-800">
    <div className="h-screen w-screen bg-gray-800 p-2 text-white text-2xl flex  flex-col gap-4">
      <Navbar settoggle={settoggle} toggle={toggle} />

      {toggle?(  <Form setUserData={setUserData}
       settoggle = {settoggle}
       isEditedUser={isEditedUser}
       setisEditedUser = {setisEditedUser}

       />):(
    <div className="flex flex-wrap gap-4">
      {userData.map((val)=>(
      <UserCard userData={userData}
      settoggle = {settoggle}
      toggle = {toggle}
      user = {val}
      handleDelete = {handleDelete}
      handleUpdate = {handleUpdate}
      />

      ))}
</div>
       )}
     
    </div>
    </div>
  );
};

export default App;
