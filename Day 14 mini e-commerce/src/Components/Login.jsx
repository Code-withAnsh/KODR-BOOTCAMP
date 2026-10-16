import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { myData } from "../Context/MyContext";
import { useContext } from "react";
import { toast } from "react-toastify";


const Login = () => {
  const { registeredUser, setregisteredUser, loggedInUser, setloggedInUser } =
    useContext(myData);
 let {register,reset,handleSubmit} = useForm({
    mode:"onchange"
  })

    let navigate = useNavigate();

    let SubmitHandler = (data) =>{
    let user = registeredUser.find((val) => val.email === data.email && val.password === data.password);
     if(!user){
      toast.error("invalid credential")
      return;

     }
     setloggedInUser(user)
     localStorage.setItem("loggedinUser",JSON.stringify(user))
     toast.success('user logged in')
    }


  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

      <section className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl shadow-black/30 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-10 text-white lg:flex">
          <div>
            <p className="text-2xl font-bold tracking-tight">
              Shop<span className="text-blue-200">Ease</span>
            </p>
            <div className="mt-24 max-w-sm">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-blue-200">
                Welcome back
              </p>
              <h2 className="text-4xl font-semibold leading-tight">
                Everything you love, one click away.
              </h2>
              <p className="mt-5 text-sm leading-6 text-blue-100">
                Sign in to pick up where you left off and keep your favorite
                essentials close.
              </p>
            </div>
          </div>
          <p className="text-xs text-blue-200">
            Simple shopping. Thoughtfully selected.
          </p>
        </div>

        <div className="bg-white px-6 py-8 sm:px-12 sm:py-12">
          <div className="mx-auto max-w-md">
            <div className="mb-8 lg:hidden">
              <p className="text-2xl font-bold tracking-tight text-slate-950">
                Shop<span className="text-blue-600">Ease</span>
              </p>
            </div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Your account
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Welcome back
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter your details to sign in to your account.
            </p>

            <form
              onSubmit={handleSubmit(SubmitHandler)}
              className="mt-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Name
                </label>
                <input
                  {...register("name", {
                    required: "this is required",
                  })}
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>
                <input
                  {...register("email", {
                    required: "this is required",
                  })}
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-semibold text-blue-600 transition hover:text-blue-800"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  {...register("password", {
                    required: "this is required",
                  })}
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="button"
                className="w-full rounded-xl bg-slate-950 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 active:scale-[0.99]"
              >
                Sign in
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              New to ShopEase?{" "}
              <button
                onClick={() => navigate("/Register")}
                type="button"
                className="font-semibold text-blue-600 transition hover:text-blue-800"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;