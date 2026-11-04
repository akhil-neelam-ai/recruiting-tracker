import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="auth">
      <div>
        <p className="brand">Recruiting tracker</p>
        <section className="card">
          <h1>Log in</h1>
          <p className="lede">Use the email and password for your recruiting account.</p>
          <AuthForm mode="login" />
        </section>
      </div>
    </main>
  );
}
