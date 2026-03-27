import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function Login() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError(null);
    setLoading(true);
    try {
      const r = await api.post("/auth/login/", { username, password });
      localStorage.setItem("accessToken", r.data.access);
      localStorage.setItem("refreshToken", r.data.refresh);
      nav("/products");
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border bg-white p-6">
      <h1 className="text-xl font-semibold">Login</h1>
      <div className="mt-4 grid gap-3">
        <label className="grid gap-1 text-sm">
          <span className="text-slate-600">Username</span>
          <input className="rounded-md border px-3 py-2" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-slate-600">Password</span>
          <input
            type="password"
            className="rounded-md border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error ? <div className="text-sm text-red-600">{error}</div> : null}
        <button
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          onClick={submit}
          disabled={!username || !password || loading}
        >
          Login
        </button>
        <div className="text-sm text-slate-600">
          No account?{" "}
          <Link to="/register" className="text-slate-900 underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

