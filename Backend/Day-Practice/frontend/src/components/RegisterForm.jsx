import { useForm } from "react-hook-form";

const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "all",
  });

  const submitHandler = (data) => {
    console.log(data);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(submitHandler)}>
      <label htmlFor="register-name">Full name</label>
      <input
        {...register("name", {
          required: "Name is required",
        })}
        id="register-name"
        type="text"
        placeholder="Your name"
      />
      {errors.name && <p className="field-error">{errors.name.message}</p>}

      <label htmlFor="register-email">Email address</label>
      <input
        {...register("email", { required: "Email is required" })}
        id="register-email"
        type="email"
        placeholder="you@example.com"
      />
      {errors.email && <p className="field-error">{errors.email.message}</p>}

      <label htmlFor="register-password">Create password</label>
      <input
        {...register("password", { required: "Password is required" })}
        id="register-password"
        type="password"
        placeholder="At least 8 characters"
      />
      {errors.password && (
        <p className="field-error">{errors.password.message}</p>
      )}

      <button className="primary-button" type="submit">
        Create account <span aria-hidden="true">→</span>
      </button>
    </form>
  );
};

export default RegisterForm;
