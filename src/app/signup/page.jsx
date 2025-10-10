"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Inline icons (no extra deps)
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

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Redirect if already signed in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.replace("/goals");
  }, [router]);

  // Live validation
  const errors = useMemo(() => {
    const next = { name: "", pwd: "", confirm: "" };

    if (!name.trim() || name.trim().length < 2) {
      next.name = "Name must be at least 2 characters.";
    } else if (name.trim().length > 30) {
      next.name = "Name cannot exceed 30 characters.";
    }

    if (!pwd) {
      next.pwd = "Password is required.";
    } else if (pwd.length < 8) {
      next.pwd = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(pwd)) {
      next.pwd = "Include at least one uppercase letter.";
    } else if (!/[a-z]/.test(pwd)) {
      next.pwd = "Include at least one lowercase letter.";
    } else if (!/[0-9]/.test(pwd)) {
      next.pwd = "Include at least one number.";
    } else if (!/[^\w\s]/.test(pwd)) {
      next.pwd = "Include at least one special character.";
    }

    if (!confirm) {
      next.confirm = "Please confirm your password.";
    } else if (confirm !== pwd) {
      next.confirm = "Passwords do not match.";
    }

    return next;
  }, [name, pwd, confirm]);

  const hasErrors = useMemo(
    () => Object.values(errors).some(Boolean),
    [errors]
  );

  // Strength + requirement chips
  const reqs = {
    len: pwd.length >= 8,
    up: /[A-Z]/.test(pwd),
    lo: /[a-z]/.test(pwd),
    num: /[0-9]/.test(pwd),
    sp: /[^\w\s]/.test(pwd),
  };
  const pwdStrength = useMemo(() => {
    if (!pwd) return { score: 0, label: "No password", color: "bg-gray-300" };
    let score = 0;
    if (reqs.len) score++;
    if (reqs.up) score++;
    if (reqs.lo) score++;
    if (reqs.num) score++;
    if (reqs.sp) score++;
    const pct = (score / 5) * 100;
    const color =
      pct >= 80
        ? "bg-emerald-500"
        : pct >= 60
        ? "bg-amber-500"
        : pct >= 40
        ? "bg-orange-500"
        : "bg-rose-500";
    const label =
      pct >= 80
        ? "Strong"
        : pct >= 60
        ? "Good"
        : pct >= 40
        ? "Weak"
        : "Very weak";
    return { score: pct, label, color };
  }, [pwd, reqs]);

  const reqPill = (ok) =>
    `text-[10px] px-2 py-0.5 rounded-full border ${
      ok
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-slate-50 text-slate-500 border-slate-200"
    }`;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (hasErrors) return;

    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email,
          password: pwd,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/profile"); // alias → /dashboard/profile
      } else {
        router.push("/login");
      }
    } catch (err) {
      setServerError(err.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-xl shadow p-6 w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-slate-900 text-center">
          Create account
        </h1>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 ">
            Full name
          </label>
          <div className="relative">
            <input
              type="text"
              className={`w-full border px-3 py-2 pr-14 rounded border-slate-300 placeholder-gray-400 text-black focus:outline-none focus:ring-1 focus:ring-blue-400 ${
                errors.name ? "border-rose-300" : ""
              }`}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              autoComplete="name"
              required
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              {name.length}/30
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Use 2–30 characters.</p>
          {errors.name && (
            <p className="text-sm text-rose-600 mt-1">{errors.name}</p>
          )}
        </div>

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
            <label className="block text-sm font-medium text-slate-700 ">
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
            className={`w-full border px-3 py-2 rounded border-slate-300 placeholder-gray-400 text-black focus:outline-none focus:ring-1 focus:ring-blue-400 ${
              errors.pwd ? "border-rose-300" : ""
            }`}
            placeholder="Create a password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            autoComplete="new-password"
            required
          />
          <div className="flex flex-wrap gap-1 mt-2">
            <span className={reqPill(reqs.len)}>8+ chars</span>
            <span className={reqPill(reqs.up)}>A‑Z</span>
            <span className={reqPill(reqs.lo)}>a‑z</span>
            <span className={reqPill(reqs.num)}>0‑9</span>
            <span className={reqPill(reqs.sp)}>symbol</span>
          </div>
          <div className="mt-2">
            <div className="h-2 w-full bg-slate-200 rounded">
              <div
                className={`h-2 rounded ${pwdStrength.color}`}
                style={{ width: `${pwdStrength.score}%` }}
              />
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {pwd
                ? `Strength: ${pwdStrength.label}`
                : "Use at least 8 characters"}
            </div>
          </div>
          {errors.pwd && (
            <p className="text-sm text-rose-600 mt-1">{errors.pwd}</p>
          )}
        </div>

        {/* Confirm */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-slate-700">
              Confirm password
            </label>
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              aria-label={
                showConfirm ? "Hide confirm password" : "Show confirm password"
              }
              className="text-blue-600 hover:text-blue-700"
            >
              {showConfirm ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <input
            type={showConfirm ? "text" : "password"}
            className={`w-full border px-3 py-2 rounded border-slate-300 placeholder-gray-400 text-black focus:outline-none focus:ring-1 focus:ring-blue-400 ${
              errors.confirm ? "border-rose-300" : ""
            }`}
            placeholder="Re-enter your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />
          {errors.confirm && (
            <p className="text-sm text-rose-600 mt-1">{errors.confirm}</p>
          )}
        </div>

        {serverError && <p className="text-rose-600 text-sm">{serverError}</p>}

        <button
          type="submit"
          disabled={submitting || hasErrors}
          className="w-full px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:opacity-70"
        >
          {submitting ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-sm text-slate-600 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}