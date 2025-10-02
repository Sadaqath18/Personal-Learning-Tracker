"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const data = await res.json();

        if (data.user.role !== "admin") {
          alert("Access denied. Admins only!");
          router.push("/dashboard");
          return;
        }

        setUser(data.user);
      } catch (err) {
        console.error("Error verifying user:", err.message);
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) return <p>Checking admin access...</p>;
  if (!user) return <p>Redirecting...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2">
        Welcome, {user.name} ({user.email})
      </p>

      <div className="mt-4 p-4 border rounded bg-gray-800">
        <h2 className="font-semibold">Admin Tools</h2>
        <ul className="list-disc pl-6 mt-2">
          <li>Manage Users</li>
          <li>View Reports</li>
          <li>Update Roles</li>
        </ul>
      </div>
    </div>
  );
}
