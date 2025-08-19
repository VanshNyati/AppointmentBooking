import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";

export default function Register() {
  const nav = useNavigate();
  const { signup, signin, loading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await signup(form);
      await signin(form.email, form.password);
      nav("/patient", { replace: true });
    } catch (e) {
      setError(e?.response?.data?.error?.message || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="w-full max-w-md space-y-6 p-6 rounded-2xl border bg-white shadow-sm">
        <h1 className="text-xl font-semibold text-center">Create account</h1>
        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={onSubmit} className="space-y-4">
          {["name", "email", "password"].map((k) => (
            <div key={k}>
              <label className="block text-sm mb-1 capitalize">{k}</label>
              <input
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                type={
                  k === "password"
                    ? "password"
                    : k === "email"
                    ? "email"
                    : "text"
                }
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
          <button
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 text-white px-3 py-2 font-medium hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="text-xs text-center">
          Already have an account?{" "}
          <Link className="underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
