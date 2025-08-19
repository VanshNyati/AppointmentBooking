import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Card from "../components/Card";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const role = await login({ email, password });
    navigate(role === "admin" ? "/admin" : "/patient");
  }

  return (
    <>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-70 blur-3xl" />
      </div>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-10 text-center">
          <h1 className="h1">Welcome back</h1>
          <p className="text-slate-600">Sign in to manage appointments</p>
        </div>

        <div className="mx-auto max-w-md">
          <Card>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border-slate-300 focus:border-brand-500 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full rounded-xl border-slate-300 focus:border-brand-500 focus:ring-brand-500"
                />
              </div>
              <Button disabled={loading} className="w-full">
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              No account?{" "}
              <Link to="/register" className="text-brand-600 hover:underline">
                Register
              </Link>
            </p>
          </Card>
        </div>
      </main>
    </>
  );
}
