"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [goals, setGoals] = useState([]);
  const [goalsLoading, setGoalsLoading] = useState(true);

  useEffect(() => {
    if (!user) return; // wait for auth
    let mounted = true;
    (async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) return;
        const res = await fetch("/api/goals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          localStorage.removeItem("token");
          router.replace("/login");
          return;
        }
        const data = await res.json();
        if (mounted) setGoals(data.goals || []);
      } catch {
        // no-op
      } finally {
        if (mounted) setGoalsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user, router]);

  const counts = useMemo(() => {
    const c = { pending: 0, progress: 0, completed: 0 };
    for (const g of goals) {
      if (g.status === "pending") c.pending++;
      else if (g.status === "in-progress") c.progress++;
      else if (g.status === "completed") c.completed++;
    }
    return c;
  }, [goals]);

  const recent = useMemo(() => goals.slice(0, 5), [goals]);

  if (loading) return <p className="text-slate-300">Loading user data...</p>;
  if (!user) return <p className="text-slate-300">Redirecting to login...</p>;

  return (
    <div className="space-y-6">
      {/* Header + quick actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          User Dashboard
        </h1>
        <div className="flex gap-2">
          <Link
            href="/dashboard/goals"
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
          >
            Create Goal
          </Link>
          <Link
            href="/dashboard/profile"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* User row */}
      <ul className="text-slate-300">
        <li className="border-b border-slate-800 py-2">
          {user.name || "No Name"} - {user.email} ({user.role})
        </li>
      </ul>

      {/* Role-based callout */}
      {user.role === "admin" ? (
        <div className="rounded-xl p-4 ring-1 ring-[rgba(99,102,241,0.30)] bg-[rgba(99,102,241,0.10)]">
          <h2 className="font-semibold text-indigo-100">Admin Panel</h2>
          <p className="text-indigo-200 text-sm">
            Manage users and review all goals.
          </p>
          <Link
            href="/dashboard/admin"
            className="inline-block mt-2 px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
          >
            Manage Users
          </Link>
        </div>
      ) : (
        <div className="rounded-xl p-4 ring-1 ring-[rgba(148,163,184,0.30)] bg-[rgba(148,163,184,0.08)]">
          <h2 className="font-semibold text-slate-100">Welcome</h2>
          <p className="text-slate-300 text-sm">
            You have standard user access.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl p-4 ring-1 ring-[rgba(148,163,184,0.30)] bg-[rgba(148,163,184,0.08)]">
          <p className="text-slate-300 text-sm">Pending</p>
          <p className="text-3xl font-semibold text-slate-50">
            {goalsLoading ? "…" : counts.pending}
          </p>
        </div>
        <div className="rounded-xl p-4 ring-1 ring-[rgba(245,158,11,0.30)] bg-[rgba(245,158,11,0.10)]">
          <p className="text-amber-200 text-sm">In Progress</p>
          <p className="text-3xl font-semibold text-amber-100">
            {goalsLoading ? "…" : counts.progress}
          </p>
        </div>
        <div className="rounded-xl p-4 ring-1 ring-[rgba(16,185,129,0.30)] bg-[rgba(16,185,129,0.10)]">
          <p className="text-emerald-200 text-sm">Completed</p>
          <p className="text-3xl font-semibold text-emerald-100">
            {goalsLoading ? "…" : counts.completed}
          </p>
        </div>
      </div>

      {/* Recent goals */}
      <div className="rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500/30 via-fuchsia-500/30 to-emerald-500/30">
        <div className="bg-white rounded-[calc(1rem+1px)] shadow-sm ring-1 ring-slate-200">
          <div className="px-4 py-3 border-b border-slate-200">
            <h2 className="text-slate-800 font-semibold">Recent Goals</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {goalsLoading ? (
              <li className="px-4 py-6 text-center text-slate-500">Loading…</li>
            ) : recent.length > 0 ? (
              recent.map((g) => (
                <li
                  key={g.id}
                  className="px-4 py-3 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-slate-900 font-medium truncate">
                      {g.title}
                    </p>
                    <p className="text-slate-600 text-sm truncate">
                      {(g.description || "No description").slice(0, 160)}
                      {g.description && g.description.length > 160 ? "…" : ""}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                      g.status === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : g.status === "in-progress"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {g.status}
                  </span>
                </li>
              ))
            ) : (
              <li className="px-4 py-6 text-center text-slate-500">
                No goals yet. Create your first goal!
              </li>
            )}
          </ul>
          <div className="px-4 py-3 border-t border-slate-200 flex justify-end">
            <Link
              href="/dashboard/goals"
              className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
            >
              Go to Goals →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
