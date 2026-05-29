import { FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const { register, message } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formMessage, setFormMessage] = useState(message);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFormMessage("Creating account...");

    try {
      await register({ name, email, password });
      setPassword("");
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface px-6 py-10 text-ink">
      <section className="mx-auto max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-center">
          <p className="text-3xl font-bold">CalcScope</p>
          <p className="mt-2 text-slate-600">Create an account to use the workspace.</p>
        </div>

        <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-slate-700">
            Name
            <input
              autoComplete="name"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-accent"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input
              autoComplete="email"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-accent"
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Password
            <input
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-accent"
              minLength={8}
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <button
            className="w-full rounded-md bg-accent px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Please wait..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">{formMessage}</p>
        <p className="mt-3 text-center text-sm text-slate-600">
          Already have an account? <a className="font-semibold text-accent" href="/login">Login</a>
        </p>
      </section>
    </main>
  );
}
