"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      await res.json();
      toast.success("If the email exists, we sent a reset link.");
      setEmail("");
    } catch {
      toast.success("If the email exists, we sent a reset link.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl text-yellow-800 font-semibold mb-4">
        Forgot your password?
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        Enter your email and we'll send you a link to reset your password.
      </p>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          required
          className="w-full border px-3 py-2 rounded placeholder-gray-400 text-black focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          disabled={submitting}
          className={`w-full text-white py-2 rounded ${
            submitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {submitting ? "Sending..." : "Send reset link"}
        </motion.button>
      </form>
    </div>
  );
}
