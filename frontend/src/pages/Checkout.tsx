import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import type { Cart, Order } from "../lib/types";
import { formatMoney } from "../lib/money";

export default function Checkout() {
  const nav = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    shipping_name: "",
    shipping_address1: "",
    shipping_address2: "",
    shipping_city: "",
    shipping_state: "",
    shipping_postal_code: "",
    shipping_country: "US",
  });

  const subtotal = useMemo(() => {
    if (!cart) return 0;
    return cart.items.reduce((acc, it) => acc + it.product.price_cents * it.quantity, 0);
  }, [cart]);

  useEffect(() => {
    const isAuthed = Boolean(localStorage.getItem("accessToken"));
    if (!isAuthed) return nav("/login");
    (async () => {
      setLoading(true);
      try {
        const r = await api.get<Cart>("/cart/");
        setCart(r.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function submit() {
    setLoading(true);
    try {
      const r = await api.post<Order>("/orders/checkout/", form);
      nav(`/orders`, { state: { createdOrderId: r.data.id } });
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="text-sm text-slate-600">Loading…</div>;
  if (!cart) return <div className="text-sm text-slate-600">No cart.</div>;
  if (cart.items.length === 0) return <div className="text-sm text-slate-600">Cart is empty.</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-xl font-semibold">Checkout</h1>
        <div className="mt-4 grid gap-3">
          {[
            ["shipping_name", "Full name"],
            ["shipping_address1", "Address line 1"],
            ["shipping_address2", "Address line 2 (optional)"],
            ["shipping_city", "City"],
            ["shipping_state", "State (optional)"],
            ["shipping_postal_code", "Postal code"],
            ["shipping_country", "Country code (e.g. US)"],
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
          <button
            className="mt-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            onClick={submit}
            disabled={!form.shipping_name || !form.shipping_address1 || !form.shipping_city || !form.shipping_postal_code}
          >
            Place order
          </button>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <div className="mt-4 grid gap-3">
          {cart.items.map((it) => (
            <div key={it.id} className="flex items-center justify-between text-sm">
              <div className="min-w-0">
                <div className="truncate font-medium">{it.product.name}</div>
                <div className="text-slate-600">Qty {it.quantity}</div>
              </div>
              <div className="font-semibold">{formatMoney(it.product.price_cents * it.quantity)}</div>
            </div>
          ))}
          <div className="mt-2 flex items-center justify-between border-t pt-3 text-sm">
            <div className="text-slate-600">Subtotal</div>
            <div className="font-semibold">{formatMoney(subtotal)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

