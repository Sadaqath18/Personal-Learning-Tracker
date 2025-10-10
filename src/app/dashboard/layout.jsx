"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import DashboardGuardSkeleton from "@/app/components/skeletons/DashboardGuardSkeleton";

const NavLinks = ({ me, active, onNavigate }) => (
  <nav className="p-3 space-y-1">
    <Link
      href="/dashboard"
      onClick={onNavigate}
      className={`block px-3 py-2 rounded ${
        active("/dashboard") &&
        !active("/dashboard/goals") &&
        !active("/dashboard/profile") &&
        !active("/dashboard/admin")
          ? "bg-slate-800 text-white"
          : "text-slate-300 hover:text-white hover:bg-slate-800"
      }`}
    >
      Overview
    </Link>

    <Link
      href="/dashboard/goals"
      onClick={onNavigate}
      className={`block px-3 py-2 rounded ${
        active("/dashboard/goals")
          ? "bg-slate-800 text-white"
          : "text-slate-300 hover:text-white hover:bg-slate-800"
      }`}
    >
      Goals
    </Link>

    <Link
      href="/dashboard/profile"
      onClick={onNavigate}
      className={`block px-3 py-2 rounded ${
        active("/dashboard/profile")
          ? "bg-slate-800 text-white"
          : "text-slate-300 hover:text-white hover:bg-slate-800"
      }`}
    >
      Profile
    </Link>

    {me?.role === "admin" && (
      <Link
        href="/dashboard/admin"
        onClick={onNavigate}
        className={`block px-3 py-2 rounded ${
          active("/dashboard/admin")
            ? "bg-slate-800 text-white"
            : "text-slate-300 hover:text-white hover:bg-slate-800"
        }`}
      >
        Admin
      </Link>
    )}
  </nav>
);

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [me, setMe] = useState(null);
  const [verified, setVerified] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return router.replace("/login");

        const res = await fetch("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          localStorage.removeItem("token");
          return router.replace("/login");
        }
        const data = await res.json();
        if (!res.ok || !data?.user) return router.replace("/login");

        if (pathname.startsWith("/dashboard/admin") && data.user.role !== "admin") {
          return router.replace("/unauthorized");
        }

        setMe(data.user);
        setVerified(true);
      } catch {
        localStorage.removeItem("token");
        router.replace("/login");
      }
    };

    verify();

    // restore sidebar preference or default: open on desktop, closed on mobile
    const saved = localStorage.getItem("plt_sidebar_open");
    if (saved === "1") setSidebarOpen(true);
    else if (saved === "0") setSidebarOpen(false);
    else setSidebarOpen(typeof window !== "undefined" ? window.innerWidth >= 768 : false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("plt_sidebar_open", sidebarOpen ? "1" : "0");
  }, [sidebarOpen]);

  const active = (href) => pathname === href || pathname.startsWith(href + "/");

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  if (!verified) return <DashboardGuardSkeleton />;

  return (
    // App shell fills viewport; only main content scrolls
    <div className="h-screen overflow-hidden bg-slate-900 text-slate-100">
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity md:hidden ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Fixed sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-800 bg-slate-950/80 backdrop-blur transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <Link href="/dashboard" className="font-bold text-lg tracking-wide">
            Personal Learning Tracker
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <NavLinks me={me} active={active} onNavigate={() => setSidebarOpen(false)} />

        <div className="mt-auto p-3">
          <button
            onClick={() => {
              setSidebarOpen(false);
              handleLogout();
            }}
            className="w-full text-left px-3 py-2 rounded bg-rose-600 hover:bg-rose-700 text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main column: margin-left matches sidebar on desktop; scrolls independently */}
      <div className={`h-full transition-[margin] duration-200 md:ml-64`}>
        <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen((s) => !s)}
              className="px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800"
              aria-label="Toggle sidebar"
              aria-expanded={sidebarOpen}
              title="Menu"
            >
              ☰
            </button>
            <Link href="/dashboard" className="md:hidden font-semibold">
              Dashboard
            </Link>
          </div>
          <div className="text-sm text-slate-300 truncate">
            {me?.name || "User"} • {me?.email} {me?.role ? `(${me.role})` : ""}
          </div>
          <div className="md:hidden">
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-sm"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="h-[calc(100vh-52px)] overflow-y-auto p-4 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}