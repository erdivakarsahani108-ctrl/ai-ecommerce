import { Link, NavLink, useNavigate } from "react-router-dom";
import { ReactNode } from "react";

function cx({ isActive }: { isActive: boolean }) {
  return isActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900";
}

export default function Layout({ children }: { children: ReactNode }) {
  const nav = useNavigate();
  const isAuthed = Boolean(localStorage.getItem("accessToken"));

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-semibold tracking-tight">
            AI E-Commerce
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/products" className={cx}>
              Products
            </NavLink>
            <NavLink to="/cart" className={cx}>
              Cart
            </NavLink>
            {isAuthed ? (
              <>
                <NavLink to="/orders" className={cx}>
                  Orders
                </NavLink>
                <NavLink to="/profile" className={cx}>
                  Profile
                </NavLink>
                <button
                  className="rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-800"
                  onClick={() => {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    nav("/login");
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={cx}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-800"
                >
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      <footer className="mt-12 border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500">
          Local demo. Add real payments + shipping integrations for production.
        </div>
      </footer>
    </div>
  );
}

