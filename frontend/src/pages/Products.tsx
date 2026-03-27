import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import type { Product } from "../lib/types";
import { formatMoney } from "../lib/money";

type ApiList<T> = { results: T[] };

export default function Products() {
  const [items, setItems] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"keyword" | "semantic">("semantic");
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => items, [items]);

  async function loadDefault() {
    setLoading(true);
    try {
      const r = await api.get<ApiList<Product>>("/catalog/products/");
      setItems(r.data.results ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function search() {
    const term = q.trim();
    if (!term) return loadDefault();
    setLoading(true);
    try {
      if (mode === "semantic") {
        const r = await api.get<{ results: Product[] }>("/search/semantic/", { params: { q: term } });
        setItems(r.data.results ?? []);
      } else {
        const r = await api.get<ApiList<Product>>("/catalog/products/", { params: { search: term } });
        setItems(r.data.results ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDefault();
  }, []);

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Products</h1>
          <p className="text-sm text-slate-600">Use semantic search for “meaning”, or keyword search.</p>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
          <select
            className="rounded-md border px-3 py-2 text-sm"
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
          >
            <option value="semantic">Semantic</option>
            <option value="keyword">Keyword</option>
          </select>
          <input
            className="w-full rounded-md border px-3 py-2 text-sm md:w-80"
            placeholder="Search products..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") search();
            }}
          />
          <button
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            onClick={search}
          >
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-slate-600">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Link key={p.id} to={`/products/${p.id}`} className="group rounded-2xl border bg-white p-4 hover:shadow-sm">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">No image</div>
                )}
              </div>
              <div className="mt-3 flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-500">{p.category?.name}</div>
                  <div className="font-medium">{p.name}</div>
                </div>
                <div className="text-sm font-semibold">{formatMoney(p.price_cents)}</div>
              </div>
              {p.description ? <p className="mt-2 line-clamp-2 text-sm text-slate-600">{p.description}</p> : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

