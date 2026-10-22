import { NavLink } from "react-router";

const Navbar = () => {
  return (
    <div className="h-screen shrink-0 bg-gray-700">
    <aside className="flex h-full w-64 flex-col justify-between border-r border-gray-200 bg-[#f7f7f2] p-5 ">
      {/* Logo */}
      <div>
        <div className="mb-12 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c8f169]">
            <svg
              className="h-6 w-6 text-gray-900"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight text-gray-900">
              your<span className="text-lime-600">store.</span>
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
              Admin panel
            </p>
          </div>
        </div>

        {/* Navigation Heading */}
        <p className="mb-4 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
          Main menu
        </p>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {/* Home */}
          <NavLink
            to="/main"
            end
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                isActive
                  ? "bg-[#c8f169] font-bold text-gray-900 shadow-sm"
                  : "font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1z"
              />
            </svg>

            <span>Home</span>

            <span className="ml-auto text-lg opacity-60">›</span>
          </NavLink>

          {/* Products */}
          <NavLink
            to="/main/products"
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                isActive
                  ? "bg-[#c8f169] font-bold text-gray-900 shadow-sm"
                  : "font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 8-9-5-9 5m18 0-9 5m9-5v9l-9 5m0-9L3 8m9 5v9m-9-14v9l9 5"
              />
            </svg>

            <span>Products</span>

            <span className="ml-auto text-lg opacity-60">›</span>
          </NavLink>

          {/* Users */}
          <NavLink
            to="/main/users"
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                isActive
                  ? "bg-[#c8f169] font-bold text-gray-900 shadow-sm"
                  : "font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm10 10v-2a4 4 0 0 0-3-3.87m-1-11.13a4 4 0 0 1 0 7.75"
              />
            </svg>

            <span>Users</span>

            <span className="ml-auto text-lg opacity-60">›</span>
          </NavLink>
        </nav>
      </div>

      {/* Bottom Profile & Logout */}
      <div>
        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9f7cf] text-sm font-bold text-gray-800">
              AD
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-900">
                Admin User
              </p>
              <p className="text-xs text-gray-400">Store manager</p>
            </div>

            <span className="ml-auto h-2 w-2 rounded-full bg-lime-500" />
          </div>
        </div>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9"
            />
          </svg>

          <span>Logout</span>

          <span className="ml-auto text-lg">↗</span>
        </button>

        <p className="mt-5 text-center text-[10px] text-gray-400">
          © 2026 yourstore. All rights reserved.
        </p>
      </div>
    </aside>
    </div>
  );
};

export default Navbar;
