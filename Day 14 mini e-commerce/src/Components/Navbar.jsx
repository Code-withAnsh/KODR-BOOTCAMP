import { NavLink } from "react-router"
import { ShoppingCart } from "lucide-react"
import { useContext } from "react";
import { myData } from "../Context/MyContext";


const Navbar = () => {

  

  const {productData} = useContext(myData);

  const CartItemDisplay = () =>{
    return productData.length
  }

  

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
        <NavLink
          to="/home"
          className="text-xl font-bold tracking-tight text-slate-950 transition-opacity hover:opacity-80 sm:text-2xl"
        >
          Shop<span className="text-blue-600">Ease</span>
        </NavLink>

        <div className="flex items-center gap-2 sm:gap-6">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `rounded-lg px-2 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:text-base ${
                isActive
                  ? "text-blue-600"
                  : "text-slate-600 hover:text-blue-600"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-lg px-2 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:text-base ${
                isActive
                  ? "text-blue-600"
                  : "text-slate-600 hover:text-blue-600"
              }`
            }
          >
            Login
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:px-4 sm:py-2.5 sm:text-base ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-white hover:bg-blue-600"
              }`
            }
          >
            <ShoppingCart size={20} strokeWidth={2} aria-hidden="true" />
            <span>Cart-{CartItemDisplay()}</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar
