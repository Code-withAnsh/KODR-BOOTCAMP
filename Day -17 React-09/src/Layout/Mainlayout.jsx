import { Outlet } from "react-router"
import Navbar from "../Components/Navbar"

const Mainlayout = () => {
  return (
    <div>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default Mainlayout