import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addUser } from "../features/AuthSlice";

export const useAuth = () => {
  const navigate = useNavigate();
const [registeredUsers, setregisteredUsers] = useState(
  JSON.parse(localStorage.getItem("registeredUsers")) || [],
);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
  });
let dispatch = useDispatch()

const registerHandler = (data) =>{
    let arr = [...registeredUsers,data]
    setregisteredUsers(arr)
    localStorage.setItem("registeredUsers",JSON.stringify(arr))
    toast.success("user registered succefully")
navigate("/")
    console.log(data);
}
const loginhandler = (data) =>{
let user = registeredUsers.find((val) => {
  return val.email === data.email && val.password === data.password;
});
if(!user){
toast.error("invalid credential")
return

}
dispatch(addUser(user))
localStorage.setItem("loggedInUser",JSON.stringify(user))
toast.success("user logged in")
console.log(user);

reset()


}

  return {
    register,
    handleSubmit,
    errors,
    reset,
    navigate,
    registeredUsers,
    setregisteredUsers,
    registerHandler,
    loginhandler,
  };
};
