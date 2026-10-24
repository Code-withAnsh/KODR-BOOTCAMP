// import { Link } from "react-router";

const Register = () => {
  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-[#f7f7f2] shadow-2xl lg:grid lg:grid-cols-2">
        {/* Left Panel — Store Branding */}
        <div className="relative hidden min-h-[650px] flex-col justify-between overflow-hidden bg-[#c8f169] p-10 lg:flex">
          <div className="relative z-10">
            <p className="text-2xl font-black tracking-tight text-gray-900">
              your<span className="text-white">store.</span>
            </p>

            <div className="mt-16">
              <span className="rounded-full border border-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-800">
                The everyday edit
              </span>

              <h2 className="mt-6 max-w-sm text-5xl font-black leading-[1.1] tracking-tight text-gray-900 xl:text-6xl">
                Good things.
                <br />
                Great finds.
                <br />
                <span className="text-white">Your style.</span>
              </h2>

              <p className="mt-5 max-w-xs text-sm leading-6 text-gray-700">
                Discover products you'll love, find your next favourite, and
                make every purchase feel special.
              </p>
            </div>
          </div>

          {/* Decorative Shopping Graphic */}
          <div className="relative flex flex-1 items-center justify-center">
            <div className="absolute h-64 w-64 rounded-full bg-white/40 xl:h-80 xl:w-80" />

            <div className="relative flex h-56 w-48 -rotate-6 flex-col items-center justify-center rounded-[2rem] bg-gray-900 shadow-2xl transition duration-500 hover:rotate-0 xl:h-64 xl:w-56">
              <div className="absolute -top-8 h-16 w-20 rounded-t-full border-[8px] border-b-0 border-gray-900" />

              <svg
                viewBox="0 0 100 100"
                className="h-24 w-24 text-[#c8f169] xl:h-28 xl:w-28"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M50 12 L85 32 L50 52 L15 32 Z" />
                <path d="M15 32 L15 70 L50 90 L50 52" />
                <path d="M85 32 L85 70 L50 90" />
                <path d="M32 22 L67 42" />
                <path d="M50 52 L50 90" />
              </svg>

              <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-white">
                Find your thing
              </p>
            </div>

            <div className="absolute bottom-8 right-2 rotate-6 rounded-2xl bg-white p-4 shadow-lg xl:right-8">
              <p className="text-xs font-medium text-gray-500">
                Your next favourite
              </p>
              <p className="mt-1 text-lg font-black text-gray-900">
                Starts here.
              </p>
            </div>
          </div>

          <p className="relative z-10 text-xs text-gray-700">
            Shop what you love. Love what you find.
          </p>
        </div>

        {/* Right Panel — Registration Form */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-10 xl:px-14">
          <div className="w-full max-w-sm">
            {/* Mobile Branding */}
            <div className="mb-10 lg:hidden">
              <p className="text-xl font-black tracking-tight text-gray-900">
                your<span className="text-lime-600">store.</span>
              </p>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-lime-700">
                GET STARTED
              </p>

              <h1 className="text-4xl font-black tracking-tight text-gray-900">
                Create account<span className="text-lime-600">.</span>
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Join us and discover a better way to shop.
              </p>
            </div>

            <form className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-lime-500 focus:ring-4 focus:ring-lime-500/10"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-lime-500 focus:ring-4 focus:ring-lime-500/10"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-lime-500 focus:ring-4 focus:ring-lime-500/10"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-lime-500 focus:ring-4 focus:ring-lime-500/10"
                />
              </div>

              {/* Submit Button */}
              <button
                type="button"
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gray-900 px-5 py-4 text-sm font-bold text-white transition hover:bg-lime-500 hover:text-gray-900 active:scale-[0.98]"
              >
                Create account
                <span className="text-lg transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-7 text-center text-sm text-gray-500">
              Already have an account?{" "}
              {/* <Link
                to="/login"
                className="font-bold text-gray-900 underline decoration-lime-500 decoration-2 underline-offset-4 transition hover:text-lime-700"
              >
                Log in
              </Link> */}
            </p>

            <div className="mt-8 border-t border-gray-200 pt-5 text-center">
              <p className="text-xs text-gray-400">
                By continuing, you agree to our Terms & Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
