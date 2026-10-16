import { NavLink } from "react-router"

const Navbar = () => {
  return (
    <div className="flex justify-between p-3">
      <NavLink to= "/main">Home</NavLink>
      <NavLink to="/main/about">About</NavLink>
      <NavLink>Login</NavLink>
      <NavLink>Register</NavLink>
    </div>
  );
}

export default Navbar