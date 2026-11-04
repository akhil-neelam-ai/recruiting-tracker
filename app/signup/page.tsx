import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <main className="auth">
      <div>
        <p className="brand">Recruiting tracker</p>
        <section className="card">
          <h1>Create an account</h1>
          <p className="lede">Sign up with email and password. You will only see your own rows.</p>
          <AuthForm mode="signup" />
        </section>
      </div>
    </main>
  );
}
