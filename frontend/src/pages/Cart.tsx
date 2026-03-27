import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import type { Cart as CartType } from "../lib/types";
import { formatMoney } from "../lib/money";

export default function Cart() {
  const nav = useNavigate();
  const [cart, setCart] = useState<CartType | null>(null);
  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(() => {
    if (!cart) return 0;
    return cart.items.reduce((acc, it) => acc + it.product.price_cents * it.quantity, 0);
  }, [cart]);

  async function load() {
    setLoading(true);
    try {
      const r = await api.get<CartType>("/cart/");
      setCart(r.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const isAuthed = Boolean(localStorage.getItem("accessToken"));
    if (!isAuthed) {
      nav("/login");
      return;
    }
    load();
  }, []);

  async function setQty(itemId: number, quantity: number) {
    const r = await api.patch<CartType>(`/cart/items/${itemId}/`, { quantity });
    setCart(r.data);
  }

  async function remove(itemId: number) {
    const r = await api.delete<CartType>(`/cart/items/${itemId}/remove/`);
    setCart(r.data);
  }

  if (loading) return <div className="text-sm text-slate-600">Loading…</div>;
  if (!cart) return <div className="text-sm text-slate-600">No cart.</div>;

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Cart</h1>
        <Link to="/products" className="text-sm text-slate-600 hover:text-slate-900">
          Continue shopping
        </Link>
      </div>

      <div className="grid gap-3 rounded-2xl border bg-white p-4">
        {cart.items.length === 0 ? (
          <div className="text-sm text-slate-600">Your cart is empty.</div>
        ) : (
          <>
            <div className="grid gap-3">
              {cart.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between gap-4 rounded-xl border p-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{it.product.name}</div>
                    <div className="text-sm text-slate-600">{formatMoney(it.product.price_cents)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-md border px-2 py-1 text-sm" onClick={() => setQty(it.id, it.quantity - 1)}>
                      -
                    </button>
                    <div className="w-10 text-center text-sm">{it.quantity}</div>
                    <button className="rounded-md border px-2 py-1 text-sm" onClick={() => setQty(it.id, it.quantity + 1)}>
                      +
                    </button>
                    <button className="ml-2 rounded-md border px-3 py-1 text-sm hover:bg-slate-50" onClick={() => remove(it.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-sm text-slate-600">Subtotal</div>
              <div className="font-semibold">{formatMoney(subtotal)}</div>
            </div>
            <div className="flex justify-end">
              <Link
                to="/checkout"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

