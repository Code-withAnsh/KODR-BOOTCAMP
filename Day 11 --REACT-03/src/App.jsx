import './App.css'
import { useForm } from "react-hook-form";

const App = () => {

  let {
    register,
    handleSubmit,
    reset,
    formState:{errors}
  }=useForm({
    mode:"onChange"
  })
  return (
    <main className="page">
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);
          reset();
        })}
        className="form-card"
      >
        <h1>Create account</h1>

        <label htmlFor="name">Name</label>
        <input
          {...register("name", {
            required: "name is required",
          })}
          id="name"
          name="name"
          type="text"
          placeholder="Enter your name"
        />
        {errors.name && <p className="text-red-600">{errors.name.message}</p>}

        <label htmlFor="email">Email</label>
        <input
          {...register("email", {
            required: "email is required",
          })}
          id="email"
          name="email"
          type="text"
          placeholder="Enter your email"
        />
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}

        <label htmlFor="password">Password</label>
        <input
          {...register("password", {
            required: "password is required",
            minLength: {
              value: 8,
              message: "minimum 8 digit is required",
            },
          })}
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-red-600">{errors.password.message}</p>
        )}

        <label htmlFor="mobile">Mobile</label>
        <input
          {...register("mobile", {
            required: "number is required",
            minLength: {
              value: 10,
              message: "minimum 10 digit is required",
            },
            maxLength: {
              value: 10,
              message: "maximum 10 digit is allowed",
            },
          })}
          id="mobile"
          name="mobile"
          type="text"
          placeholder="Enter your mobile number"
        />
        {errors.mobile && <p className="text-red-600">{errors.mobile.message}</p>}

        <button type="submit">Submit</button>
      </form>
    </main>
  );
}

export default App