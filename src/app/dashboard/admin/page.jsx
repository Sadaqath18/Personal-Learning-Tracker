"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AdminPanelSkeleton from "@/app/components/skeletons/AdminPanelSkeleton";

export default function AdminPage() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [goals, setGoals] = useState([]);
  const [savingUserId, setSavingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  const token = useMemo(
    () => (typeof window !== "undefined" ? localStorage.getItem("token") : null),
    []
  );

  useEffect(() => {
    const init = async () => {
      try {
        if (!token) {
          router.push("/login");
          return;
        }

        // Verify profile (greeting) and parallel load admin data
        const profileRes = await fetch("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileRes.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        const profile = await profileRes.json();
        if (!profileRes.ok || profile?.user?.role !== "admin") {
          router.push("/unauthorized");
          return;
        }
        setMe(profile.user);

        const [uRes, gRes] = await Promise.all([
          fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/admin/goals", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (uRes.status === 401 || uRes.status === 403) {
          router.push("/unauthorized");
          return;
        }

        const uData = await uRes.json();
        const gData = await gRes.json();
        if (!uRes.ok) throw new Error(uData.error || "Failed to load users");
        if (!gRes.ok) throw new Error(gData.error || "Failed to load goals");

        setUsers(uData.users || []);
        setGoals(gData.goals || []);
      } catch (e) {
        toast.error(e.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router, token]);

  const handleRoleChange = async (id, role) => {
    setSavingUserId(id);
    const toastId = toast.loading("Updating role...");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");

      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: data.user.role } : u)));
      toast.success("Role updated", { id: toastId });
    } catch (e) {
      toast.error(e.message, { id: toastId });
    } finally {
      setSavingUserId(null);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Delete user and all their data? This cannot be undone.")) return;
    setDeletingUserId(id);
    const toastId = toast.loading("Deleting user...");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");

      setUsers((prev) => prev.filter((u) => u.id !== id));
      setGoals((prev) => prev.filter((g) => g.user.id !== id));
      toast.success("User deleted", { id: toastId });
    } catch (e) {
      toast.error(e.message, { id: toastId });
    } finally {
      setDeletingUserId(null);
    }
  };

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const admins = users.filter((u) => u.role === "admin").length;
    const totalGoals = goals.length;
    return { totalUsers, admins, totalGoals };
  }, [users, goals]);

  if (loading) return <AdminPanelSkeleton />;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Header with gradient title and subtle subtitle */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-emerald-300">
          Admin Dashboard
        </h1>
        {me && (
          <p className="mt-2 text-slate-300">
            Welcome, {me.name || "Admin"} ({me.email})
          </p>
        )}
      </div>

      {/* Stat chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl p-4 ring-1 ring-indigo-500/30 bg-indigo-500/10">
          <p className="text-indigo-200 text-sm">Total Users</p>
          <p className="text-3xl font-semibold text-indigo-100">{stats.totalUsers}</p>
        </div>
        <div className="rounded-xl p-4 ring-1 ring-fuchsia-500/30 bg-fuchsia-500/10">
          <p className="text-fuchsia-200 text-sm">Admins</p>
          <p className="text-3xl font-semibold text-fuchsia-100">{stats.admins}</p>
        </div>
        <div className="rounded-xl p-4 ring-1 ring-emerald-500/30 bg-emerald-500/10">
          <p className="text-emerald-200 text-sm">Total Goals</p>
          <p className="text-3xl font-semibold text-emerald-100">{stats.totalGoals}</p>
        </div>
      </div>

      {/* Users card with gradient border + subtle ring */}
      <div className="rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500/30 via-fuchsia-500/30 to-emerald-500/30">
        <div className="bg-white rounded-[calc(1rem+1px)] shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Users</h2>
            <button
              onClick={() => window.location.reload()}
              className="text-sm px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              Refresh
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wide">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">Goals</th>
                  <th className="py-3 px-4 text-left">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="odd:bg-white even:bg-slate-50">
                    <td className="py-3 px-4 text-slate-800">{u.name || "—"}</td>
                    <td className="py-3 px-4 text-slate-800">{u.email}</td>
                    <td className="py-3 px-4">
                      <select
                        className="border border-slate-300 text-slate-800 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={savingUserId === u.id}
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                      {savingUserId === u.id && (
                        <span className="ml-2 text-xs text-slate-500">Saving…</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-800">{u._count?.goals ?? 0}</td>
                    <td className="py-3 px-4 text-slate-800">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white"
                        disabled={deletingUserId === u.id}
                      >
                        {deletingUserId === u.id ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-6 px-4 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Goals card with gradient border + subtle ring */}
      <div className="rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500/30 via-fuchsia-500/30 to-emerald-500/30">
        <div className="bg-white rounded-[calc(1rem+1px)] shadow-sm ring-1 ring-slate-200">
          <div className="px-4 py-3 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">All Goals</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {goals.map((g) => (
              <li key={g.id} className="px-4 py-3 flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 break-words">{g.title}</p>
                  <p className="text-sm text-slate-700 break-words">
                    {g.description || "No description"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    By {g.user?.name || "Unknown"} ({g.user?.email}) • {g.status} •{" "}
                    {new Date(g.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 h-fit rounded-full font-medium ${
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
            ))}
            {goals.length === 0 && (
              <li className="py-6 text-center text-slate-500">No goals found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}