"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
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

        // 🚫 Redirect if not admin
        if (data.user.role !== "admin") {
          router.push("/dashboard");
        }
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

  if (loading) return <p>Checking permissions...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <p className="mt-2">Welcome, {user?.name}. You have admin privileges.</p>

      <div className="mt-4 p-4 border rounded text-red-900 bg-gray-300">
        <h2 className="font-semibold">Manage Users:</h2>
        <ul className="mt-2 list-disc text-black list-inside ">
          <li>View all users</li>
          <li>Update user roles</li>
          <li>Delete users</li>
        </ul>
      </div>
    </div>
  );
}
