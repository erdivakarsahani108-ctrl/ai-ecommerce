import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="grid gap-6">
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 p-8 text-white">
        <h1 className="text-3xl font-semibold tracking-tight">AI-powered E-Commerce</h1>
        <p className="mt-2 max-w-2xl text-slate-200">
          Browse products, add to cart, checkout, and search semantically using embeddings + pgvector.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            to="/products"
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100"
          >
            Shop products
          </Link>
          <Link
            to="/cart"
            className="rounded-md border border-white/30 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            View cart
          </Link>
        </div>
      </div>
      <div className="grid gap-3 rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-semibold">What’s included</h2>
        <ul className="list-disc pl-5 text-sm text-slate-700">
          <li>Django REST APIs for products, cart, checkout, and orders</li>
          <li>JWT auth (register/login/refresh)</li>
          <li>Semantic search endpoint backed by pgvector</li>
          <li>Responsive React + Tailwind UI</li>
        </ul>
      </div>
    </div>
  );
}

