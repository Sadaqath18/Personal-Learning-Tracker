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
    () =>
      typeof window !== "undefined" ? localStorage.getItem("token") : null,
    []
  );

  useEffect(() => {
    const init = async () => {
      try {
        if (!token) {
          router.push("/login");
          return;
        }

        // Verify profile (for greeting) and parallel load admin data
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

        // Fetch admin data
        const [uRes, gRes] = await Promise.all([
          fetch("/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/goals", {
            headers: { Authorization: `Bearer ${token}` },
          }),
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

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: data.user.role } : u))
      );
      toast.success("Role updated", { id: toastId });
    } catch (e) {
      toast.error(e.message, { id: toastId });
    } finally {
      setSavingUserId(null);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Delete user and all their data? This cannot be undone."))
      return;
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

  if (loading) return <AdminPanelSkeleton />;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        {me && (
          <p className="mt-2 text-white/80">
            Welcome, {me.name || "Admin"} ({me.email})
          </p>
        )}
      </div>

      {/* Users */}
      <div className="bg-white rounded shadow p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Users</h2>
          <button
            onClick={() => window.location.reload()}
            className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
          >
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto mt-3">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Role</th>
                <th className="py-2 pr-3">Goals</th>
                <th className="py-2 pr-3">Joined</th>
                <th className="py-2 pr-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="py-2 pr-3">{u.name || "—"}</td>
                  <td className="py-2 pr-3">{u.email}</td>
                  <td className="py-2 pr-3">
                    <select
                      className="border rounded px-2 py-1"
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      disabled={savingUserId === u.id}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                    {savingUserId === u.id && (
                      <span className="ml-2 text-xs text-gray-500">
                        Saving…
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-3">{u._count?.goals ?? 0}</td>
                  <td className="py-2 pr-3">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 pr-3 text-right">
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                      disabled={deletingUserId === u.id}
                    >
                      {deletingUserId === u.id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Goals */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold">All Goals</h2>
        <ul className="mt-3 divide-y">
          {goals.map((g) => (
            <li
              key={g.id}
              className="py-3 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-medium break-words">{g.title}</p>
                <p className="text-sm text-gray-600 break-words">
                  {g.description || "No description"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  By {g.user?.name || "Unknown"} ({g.user?.email}) • {g.status}{" "}
                  • {new Date(g.createdAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  g.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : g.status === "in-progress"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {g.status}
              </span>
            </li>
          ))}
          {goals.length === 0 && (
            <li className="py-6 text-center text-gray-500">No goals found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
