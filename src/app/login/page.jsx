"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if token already exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/dashboard");
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex h-screen items-center justify-center bg-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-80 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-black">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50 placeholder-gray-400 text-black focus:outline-none focus:ring-1 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-400 rounded-lg px-3 py-2 bg-gray-50 placeholder-gray-400 text-black focus:outline-none focus:ring-1 focus:ring-blue-400"
        />

        <div className="flex items-center justify-between text-sm">
          <span className="invisible">.</span>
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-green-500 font-bold text-white py-2 rounded-lg transition hover:bg-green-600 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <span>Logging in...</span>
            </span>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
}
