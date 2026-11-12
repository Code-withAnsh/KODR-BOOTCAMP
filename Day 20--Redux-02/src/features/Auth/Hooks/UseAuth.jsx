import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { addUser } from "../State/authSlice";
import { useState } from "react";

const useAuth = () => {

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  let {register
    ,handleSubmit,
    formState:{errors},
    reset,


} = useForm({
    mode:"onChange"
})
let dispatch = useDispatch()
const [registeredUsers, setRegisteredUsers] = useState(() => {
  const storedUsers = localStorage.getItem("registeredUsers");
  return storedUsers ? JSON.parse(storedUsers) : [];
})

let registerHandler = (data) =>{



    let alreadyRegistered = registeredUsers.find((val)=>(val.email===data.email))
    if (alreadyRegistered) {
      toast.error("user already regsitered");
      return;
    }
   

    let arr = [...registeredUsers,data]
    setRegisteredUsers(arr);
    localStorage.setItem("registeredUsers",JSON.stringify(arr))
    toast.success("register successfully")
    navigate("/")
    console.log(data);

}

let loginHandler = (data) =>{
   let user =  registeredUsers.find((val)=>{
       return val.email === data.email && val.password === data.password
    })
if(!user){
    toast.error("invalid credentials")
    return
}
dispatch(addUser(user))
localStorage.setItem("loggedInUser",JSON.stringify(user))
toast.success("logged in successfully")
navigate("/main")
console.log('logged in users ==>',user);

reset()


}

  return {
    navigate,
    handleSubmit,
    register,
    errors,
    reset,
    registerHandler,
    loginHandler,
    showPassword,
    setShowPassword,

  };
};

export default useAuth;
