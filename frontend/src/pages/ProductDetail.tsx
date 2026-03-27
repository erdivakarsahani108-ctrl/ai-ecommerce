import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import type { Product } from "../lib/types";
import { formatMoney } from "../lib/money";

export default function ProductDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [p, setP] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const r = await api.get<Product>(`/catalog/products/${id}/`);
        setP(r.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function addToCart() {
    const isAuthed = Boolean(localStorage.getItem("accessToken"));
    if (!isAuthed) return nav("/login");
    await api.post("/cart/items/add/", { product_id: p?.id, quantity: qty });
    nav("/cart");
  }

  if (loading) return <div className="text-sm text-slate-600">Loading…</div>;
  if (!p) return <div className="text-sm text-slate-600">Not found.</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border bg-white p-4">
        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
          {p.image_url ? (
            <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">No image</div>
          )}
        </div>
      </div>
      <div className="grid gap-3 rounded-2xl border bg-white p-6">
        <div className="text-sm text-slate-500">{p.category?.name}</div>
        <h1 className="text-2xl font-semibold tracking-tight">{p.name}</h1>
        <div className="text-lg font-semibold">{formatMoney(p.price_cents)}</div>
        {p.description ? <p className="text-sm text-slate-700">{p.description}</p> : null}
        <div className="mt-2 flex items-center gap-3">
          <label className="text-sm text-slate-600">Qty</label>
          <input
            type="number"
            min={1}
            className="w-20 rounded-md border px-3 py-2 text-sm"
            value={qty}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || "1", 10)))}
          />
        </div>
        <div className="mt-2 flex gap-3">
          <button
            className="flex-1 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            onClick={addToCart}
          >
            Add to cart
          </button>
          <Link className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-50" to="/products">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}

