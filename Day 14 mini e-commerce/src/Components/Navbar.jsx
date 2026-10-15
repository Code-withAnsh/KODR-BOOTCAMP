import  { useContext } from "react";
import { myData } from "../Context/MyContext";


const Navbar = () => {
  const {toggle,setToggle,productData} = useContext(myData)

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <a href="/" className="text-xl font-bold tracking-tight text-slate-950">
          north<span className="text-blue-600">star</span>
        </a>

        <ul className="hidden items-center gap-8 text-sm font-medium text-slate-600 sm:flex">
          <li className="cursor-pointer transition-colors hover:text-blue-600">Home</li>
          <li className="cursor-pointer transition-colors hover:text-blue-600">About</li>
          <li className="cursor-pointer transition-colors hover:text-blue-600">Contacts</li>
        </ul>

        <button
        onClick={() => setToggle((prev) => !prev)}
        className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors ${
          productData.length > 0
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-slate-900 hover:bg-blue-600"
        }`}
        aria-label={toggle ? "Close cart" : "Open cart"}
        >
          <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center">
            {toggle ? (
              <span className="text-xl font-light leading-none">×</span>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20h.01M18 20h.01" />
              </svg>
            )}
          </span>
          <span>{toggle ? "Close" : "Cart"}</span>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-blue-700">
            {productData.length}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
