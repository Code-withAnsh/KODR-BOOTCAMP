import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { myData } from "../Context/MyContext";
import { useContext } from "react";
import { toast } from "react-toastify";

const Register = () => {

    let navigate = useNavigate();
const {registeredUser,setregisteredUser} = useContext(myData)
    let {register,handleSubmit,reset,formState: { errors },} = useForm({
        mode:"onChange"
    })


    let submitHandler = (data) =>{
      let arr = [...registeredUser,data]
      setregisteredUser(arr)
      localStorage.setItem('registeredUser',JSON.stringify(arr))
      toast.success("user registered..")
reset()


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
                Join ShopEase
              </p>
              <h2 className="text-4xl font-semibold leading-tight">
                Your next favorite finds start here.
              </h2>
              <p className="mt-5 text-sm leading-6 text-blue-100">
                Create your account to save your cart and make every shopping
                trip feel effortless.
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
              Get started
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Create your account
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Join ShopEase and keep your everyday essentials in one place.
            </p>

            <form
              onSubmit={handleSubmit(submitHandler)}
              className="mt-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="register-name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Full name
                </label>
                <input
                  {...register("name", {
                    required: "this is required",
                  })}
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="register-email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>
                <input
                  {...register("email", {
                    required: "this is required",
                  })}
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="register-password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <input
                  {...register("password", {
                    required: "this is required",
                  })}
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Confirm password
                </label>
                <input
                  {...register("confirm-password", {
                    required: "this is required",
                  })}
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <label className="flex items-start gap-3 text-sm leading-5 text-slate-600">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-600"
                />
                <span>
                  I agree to the{" "}
                  <button
                    type="button"
                    className="font-semibold text-blue-600 transition hover:text-blue-800"
                  >
                    terms and conditions
                  </button>
                  .
                </span>
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-950 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 active:scale-[0.99]"
              >
                Create account
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/")}
                type="button"
                className="font-semibold text-blue-600 transition hover:text-blue-800"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;