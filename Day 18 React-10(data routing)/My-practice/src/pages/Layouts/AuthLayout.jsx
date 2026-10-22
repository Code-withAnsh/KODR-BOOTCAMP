import { Activity } from "react"
import LoginPage from "../AuthPages/LoginPage"
import Registerpage from "../AuthPages/Registerpage"
import { Auth, useContextData } from "../../Context/AuthContext"


const AuthLayout = () => {
    let {toggle} = useContextData(Auth)
  return (
    <div>
      <Activity mode={toggle ? "visible" : "hidden"}>
        <Registerpage />
      </Activity>
      <Activity mode={!toggle ? "visible" : "hidden"}>
        <LoginPage />
      </Activity>
    </div>
  );
}

export default AuthLayout