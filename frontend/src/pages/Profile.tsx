import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import type { User } from "../lib/types";

export default function Profile() {
  const nav = useNavigate();
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isAuthed = Boolean(localStorage.getItem("accessToken"));
    if (!isAuthed) return nav("/login");
    (async () => {
      setLoading(true);
      try {
        const r = await api.get<User>("/auth/me/");
        setMe(r.data);
      } catch (e: any) {
        setError(e?.response?.data?.detail ?? "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="text-sm text-slate-600">Loading…</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!me) return null;

  return (
    <div className="mx-auto max-w-xl rounded-2xl border bg-white p-6">
      <h1 className="text-xl font-semibold">Profile</h1>
      <div className="mt-4 grid gap-2 text-sm">
        <div>
          <span className="text-slate-600">Username:</span> <span className="font-medium">{me.username}</span>
        </div>
        <div>
          <span className="text-slate-600">Email:</span> <span className="font-medium">{me.email}</span>
        </div>
        <div>
          <span className="text-slate-600">Name:</span>{" "}
          <span className="font-medium">
            {me.first_name} {me.last_name}
          </span>
        </div>
      </div>
    </div>
  );
}

