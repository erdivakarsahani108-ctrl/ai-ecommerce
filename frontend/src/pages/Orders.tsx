import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import type { Order } from "../lib/types";
import { formatMoney } from "../lib/money";

type ApiList<T> = { results: T[] };

export default function Orders() {
  const nav = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isAuthed = Boolean(localStorage.getItem("accessToken"));
    if (!isAuthed) return nav("/login");
    (async () => {
      setLoading(true);
      try {
        const r = await api.get<ApiList<Order>>("/orders/");
        setOrders(r.data.results ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="text-sm text-slate-600">Loading…</div>;

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Orders</h1>
      <div className="grid gap-3">
        {orders.length === 0 ? (
          <div className="rounded-2xl border bg-white p-6 text-sm text-slate-600">No orders yet.</div>
        ) : (
          orders.map((o) => (
            <div key={o.id} className="rounded-2xl border bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-slate-500">Order #{o.id}</div>
                  <div className="font-semibold">{formatMoney(o.total_cents)}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {new Date(o.created_at).toLocaleString()} • {o.status}
                  </div>
                </div>
                <div className="text-right text-sm text-slate-600">{o.items?.length ?? 0} items</div>
              </div>
              <div className="mt-4 grid gap-2">
                {(o.items ?? []).slice(0, 3).map((it) => (
                  <div key={it.id} className="flex items-center justify-between text-sm">
                    <div className="truncate">{it.product.name}</div>
                    <div className="text-slate-600">x{it.quantity}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

