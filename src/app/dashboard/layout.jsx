"use client";

import { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import DashboardGuardSkeleton from "@/app/components/skeletons/DashboardGuardSkeleton";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [me, setMe] = useState(null);
  const [verified, setVerified] = useState(false);

  // Guard + profile fetch
  useEffect(() => {
    const verify = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.replace("/login");
          return;
        }

        const res = await fetch("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          router.replace("/login");
          return;
        }

        const data = await res.json();
        if (!res.ok || !data?.user) {
          router.replace("/login");
          return;
        }

        // Block non-admins on /dashboard/admin
        if (
          pathname.startsWith("/dashboard/admin") &&
          data.user.role !== "admin"
        ) {
          router.replace("/unauthorized");
          return;
        }

        setMe(data.user);
        setVerified(true);
      } catch {
        localStorage.removeItem("token");
        router.replace("/login");
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = (href) => pathname === href || pathname.startsWith(href + "/");

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  if (!verified) return <DashboardGuardSkeleton />;

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-900 text-slate-100 grid md:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="border-r border-slate-800 bg-slate-950/60 sticky top-0 h-screen hidden md:block">
        <div className="p-4 border-b border-slate-800">
          <Link href="/dashboard" className="font-bold text-lg tracking-wide">
            Personal Learning Tracker
          </Link>
        </div>

        <nav className="p-3 space-y-1">
          <Link
            href="/dashboard"
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
              className={`block px-3 py-2 rounded ${
                active("/dashboard/admin")
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              Admin
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="mt-2 w-full text-left px-3 py-2 rounded bg-red-600/90 hover:bg-red-600 text-white"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main area */}
      <div className="min-h-screen flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-10 w-full overflow-x-clip bg-slate-900/80 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="md:hidden font-semibold">
            PLT Dashboard
          </Link>
          <div className="text-sm text-slate-300 truncate">
            {me?.name || "User"} • {me?.email} {me?.role ? `(${me.role})` : ""}
          </div>
          <div className="md:hidden">
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded bg-red-600/90 hover:bg-red-600 text-white text-sm"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 max-w-6xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
