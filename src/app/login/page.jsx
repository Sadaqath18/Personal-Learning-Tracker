"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Inline icons
const Eye = (props) => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" {...props}>
    <path
      stroke="currentColor"
      strokeWidth="2"
      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const EyeOff = (props) => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" {...props}>
    <path
      stroke="currentColor"
      strokeWidth="2"
      d="M3 3l18 18M10.6 10.6a3 3 0 104.24 4.24M6.1 6.55C3.77 8.13 2 12 2 12s3.5 7 10 7a10.9 10.9 0 005.9-1.55M16.2 7.8A10.9 10.9 0 0012 5c-6.5 0-10 7-10 7a20.7 20.7 0 004.2 4.8"
    />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if token already exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.replace("/dashboard");
  }, [router]);

  const hasErrors = useMemo(() => {
    if (!email || !pwd) return true;
    return false;
  }, [email, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasErrors) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pwd }),
      });

      const data = await res.json();
      if (!res.ok || !data?.token)
        throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-slate-900 text-center">
          Welcome back
        </h1>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded border-slate-300 placeholder-gray-400 text-black focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              aria-label={showPwd ? "Hide password" : "Show password"}
              className="text-blue-600 hover:text-blue-700"
            >
              {showPwd ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <input
            type={showPwd ? "text" : "password"}
            className="w-full border px-3 py-2 rounded border-slate-300 placeholder-gray-400 text-black focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Your password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            autoComplete="current-password"
            required
          />
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="invisible">.</span>
            <Link
              href="/forgot-password"
              className="text-indigo-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {error && <p className="text-rose-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading || hasErrors}
          className="w-full px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="text-sm text-slate-600 text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
