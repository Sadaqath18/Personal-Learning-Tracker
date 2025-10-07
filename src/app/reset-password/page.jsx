"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const search = useSearchParams();
  const router = useRouter();
  const token = search.get("token") || "";

  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const hasError = useMemo(() => {
    if (!pwd || !confirm) return true;
    if (pwd !== confirm) return true;
    if (pwd.length < 8) return true;
    return false;
  }, [pwd, confirm]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (hasError) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: pwd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");
      toast.success("Password reset. Please log in.");
      router.push("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
        <p className="text-gray-700">Reset token is missing or invalid.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Set a new password</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="password"
          className="w-full border px-3 py-2 rounded"
          placeholder="New password (min 8 chars)"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />
        <input
          type="password"
          className="w-full border px-3 py-2 rounded"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          disabled={submitting || hasError}
          className={`w-full text-white py-2 rounded ${
            submitting || hasError ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {submitting ? "Saving..." : "Reset password"}
        </motion.button>
      </form>
    </div>
  );
}