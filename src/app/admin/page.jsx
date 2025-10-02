"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import jwtDecode from "jwt-decode";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const decoded = jwtDecode(token);
    if (decoded.role !== "admin") {
      router.push("/dashboard"); // redirect normal users
    }
  }, [router]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Panel 🚀</h1>
    </div>
  );
}
