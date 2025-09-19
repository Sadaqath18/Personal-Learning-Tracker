"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/auth/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Error fetching protected data:", err.message);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div>
      <h1 className="text-xl font-bold">User Dashboard</h1>

      <div className="mt-4">
        {user ? (
          <>
            <li className="border-b py-2">
              {user.name} - {user.email} ({user.role})
            </li>

            {/* ✅ Role-based rendering */}
            {user.role === "admin" && (
              <div className="mt-4 p-2 border rounded bg-gray-800">
                <h2 className="font-semibold font-bold ">Admin Panel</h2>
                <p>Only visible to admins.</p>
                <Link href="/dashboard/admin" className="underline hover:text-blue-600">
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
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>

      <p className="mt-4">
        <Link href="/dashboard/settings" className="underline hover:text-blue-600">
          Go to Settings
        </Link>
      </p>
    </div>
  );
}
