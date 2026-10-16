import { Route, Routes } from "react-router"
import CartScreen from "../Components/CartScreen"
import HomePage from "../Components/HomePage"
import Login from "../Components/Login";
import Register from "../Components/Register";

const MainRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="cart" element={<CartScreen />} />
        <Route path="home" element={<HomePage />} />
        <Route path="/" element={<Login />} />
        <Route path="Register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default MainRoutes