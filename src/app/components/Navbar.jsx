"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function PublicNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  // Always call hooks at the top (do not early-return before these)
  const [authed, setAuthed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setAuthed(Boolean(t));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthed(false);
    setOpen(false);
    router.replace("/login");
  };

  const isActive = (href) => pathname === href;
  const isDashboard = pathname?.startsWith("/dashboard");

  // Now it’s safe to conditionally render
  if (isDashboard) return null;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-slate-800">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-slate-100 tracking-tight">
            Personal Learning Tracker
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm ${isActive("/") ? "text-white" : "text-slate-300 hover:text-white"}`}
            >
              Home
            </Link>

            {!authed ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-100"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/goals"
                  className="text-sm px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>

          <button
            onClick={() => setOpen((s) => !s)}
            className="md:hidden px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            ☰
          </button>
        </div>
      </div>

      <div
        className={`md:hidden border-t border-slate-800 bg-slate-900/95 transition-[max-height] duration-200 overflow-hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-3 flex flex-col gap-3">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={`text-sm ${isActive("/") ? "text-white" : "text-slate-300 hover:text-white"}`}
          >
            Home
          </Link>

          {!authed ? (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-sm px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-100 text-center"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="text-sm px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-center"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/goals"
                onClick={() => setOpen(false)}
                className="text-sm px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-center"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-2 rounded bg-rose-600 hover:bg-rose-700 text-white text-center"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}