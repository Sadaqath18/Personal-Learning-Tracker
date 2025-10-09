"use client";

import Link from "next/link";
import useAuth from "@/hooks/useAuth";

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading user data...</p>;
  if (!user) return <p>Redirecting to login...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold">User Dashboard</h1>

      <div className="mt-4">
        <li className="border-b py-2">
          {user.name ? user.name : "No Name"} - {user.email} ({user.role})
        </li>

        {/* ✅ Role-based rendering */}
        {user.role === "admin" && (
          <div className="mt-4 p-2 border rounded bg-gray-800 text-white">
            <h2 className="font-semibold">Admin Panel</h2>
            <p>Only visible to admins.</p>
            <Link
              href="/dashboard/admin"
              className="underline hover:text-blue-400"
            >
              Manage Users
            </Link>
          </div>
        )}

        {user.role === "user" && (
          <div className="mt-4 p-2 border rounded bg-gray-100">
            <h2 className="font-semibold">User Section</h2>
            <p>Standard user access.</p>
          </div>
        )}
      </div>

      <p className="mt-4">
        <Link href="/dashboard/goals" className="underline hover:text-blue-600">
          📌 View My Goals
        </Link>
      </p>
    </div>
  );
}
