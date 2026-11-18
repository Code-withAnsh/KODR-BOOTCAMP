const LoginForm = () => {
  return (
    <form className="auth-form">
      <label htmlFor="login-email">Email address</label>
      <input
        id="login-email"
        name="email"
        type="email"
        placeholder="you@example.com"
      />

      <div className="label-row">
        <label htmlFor="login-password">Password</label>
        <button className="text-button" type="button">
          Forgot password?
        </button>
      </div>
      <input
        id="login-password"
        name="password"
        type="password"
        placeholder="Enter your password"
      />

      <button className="primary-button" type="submit">
        Sign in <span aria-hidden="true">→</span>
      </button>
    </form>
  );
};

export default LoginForm;