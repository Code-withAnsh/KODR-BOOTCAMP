import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

const AuthIntro = () => (
  <section className="auth-intro">
    <div className="brand-mark">K</div>
    <p className="eyebrow">A quieter way to connect</p>
    <h1>Make space for what matters.</h1>
    <p className="intro-copy">
      Keep your ideas, conversations, and next steps in one thoughtful place.
    </p>
    <div className="intro-note">
      <span className="note-dot" />
      <span>Simple tools. Clear progress.</span>
    </div>
  </section>
);

export const LoginPage = () => {
  return (
    <main className="auth-page single-auth-page">
      <AuthIntro />
      <section className="single-form-panel">
        <div className="form-column">
          <p className="form-kicker">Welcome back</p>
          <h2>Sign in</h2>
          <p className="form-description">Pick up right where you left off.</p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
};

export const RegisterPage = () => {
  return (
    <main className="auth-page single-auth-page">
      <AuthIntro />
      <section className="single-form-panel">
        <div className="form-column">
          <p className="form-kicker">New here?</p>
          <h2>Create your account</h2>
          <p className="form-description">
            Start building a space that feels like yours.
          </p>
          <RegisterForm />
        </div>
      </section>
    </main>
  );
};

const App = () => <LoginPage />;

export default App;
