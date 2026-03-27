import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError(null);
    setLoading(true);
    try {
      const r = await api.post("/auth/register/", form);
      localStorage.setItem("accessToken", r.data.access);
      localStorage.setItem("refreshToken", r.data.refresh);
      nav("/products");
    } catch (e: any) {
      const msg =
        e?.response?.data?.email?.[0] ??
        e?.response?.data?.username?.[0] ??
        e?.response?.data?.password?.[0] ??
        "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border bg-white p-6">
      <h1 className="text-xl font-semibold">Register</h1>
      <div className="mt-4 grid gap-3">
        {[
          ["username", "Username"],
          ["email", "Email"],
          ["first_name", "First name"],
          ["last_name", "Last name"],
        ].map(([k, label]) => (
          <label key={k} className="grid gap-1 text-sm">
            <span className="text-slate-600">{label}</span>
            <input
              className="rounded-md border px-3 py-2"
              value={(form as any)[k]}
              onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))}
            />
          </label>
        ))}
        <label className="grid gap-1 text-sm">
          <span className="text-slate-600">Password</span>
          <input
            type="password"
            className="rounded-md border px-3 py-2"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          />
        </label>
        {error ? <div className="text-sm text-red-600">{error}</div> : null}
        <button
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          onClick={submit}
          disabled={!form.username || !form.email || !form.password || loading}
        >
          Create account
        </button>
        <div className="text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-slate-900 underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

