import { useForm } from "react-hook-form"
import { useContextData } from "../Context/AuthContext"
import { useNavigate } from "react-router"


 export const UseAuth = () => {
    let navigate = useNavigate();

    let {
      registeredUsers,
      setregisteredUsers,
      setloggedInUser,
      toggle,
      settoggle,
    } = useContextData();
    let {register,handleSubmit,reset} = useForm({
        mode:"onChange" ,

    })

  
  const submitHandler = (data) => {
    console.log("submit handler called");
    let arr = [...registeredUsers, data];
    setregisteredUsers(arr);
    localStorage.setItem("registeredUsers", JSON.stringify(arr));
    reset();
   navigate("/")
    console.log(data);
  };
console.log("registeredUsers:", registeredUsers);
  const loginHandler = (data) =>{
  let user =   registeredUsers.find((val)=>val.email===data.email && val.password === data.password)

  if(!user){
    alert("invalid credential")
    return;
  }
  setloggedInUser(user);
  localStorage.setItem("loggedInUser",JSON.stringify(user))
  alert('logged in successfully')
  navigate("/main")
  reset()
    console.log(user);
  }
  return {
    submitHandler,
    register,
    handleSubmit,
    reset,
    loginHandler,
    toggle,
    settoggle,
  };
}

export default UseAuth