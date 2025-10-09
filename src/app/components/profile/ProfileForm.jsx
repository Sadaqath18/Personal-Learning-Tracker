"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function ProfileForm({
  defaultName,
  email,
  role,
  onSubmit,
  saving,
}) {
  const [name, setName] = useState(defaultName || "");
  const [changePwd, setChangePwd] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => setName(defaultName || ""), [defaultName]);

  const errors = useMemo(() => {
    const next = { name: "", currentPwd: "", newPwd: "", confirmPwd: "" };

    if (!name?.trim() || name.trim().length < 2)
      next.name = "Name must be at least 2 characters.";
    else if (name.trim().length > 30)
      next.name = "Name cannot exceed 30 characters.";

    if (changePwd) {
      if (!currentPwd) next.currentPwd = "Current password is required.";
      if (!newPwd) next.newPwd = "New password is required.";
      else if (newPwd.length < 8)
        next.newPwd = "Password must be at least 8 characters.";
      else if (!/[A-Z]/.test(newPwd))
        next.newPwd = "Include at least one uppercase letter.";
      else if (!/[a-z]/.test(newPwd))
        next.newPwd = "Include at least one lowercase letter.";
      else if (!/[0-9]/.test(newPwd))
        next.newPwd = "Include at least one number.";
      else if (!/[^\w\s]/.test(newPwd))
        next.newPwd = "Include at least one special character.";
      else if (currentPwd && newPwd === currentPwd)
        next.newPwd = "New password must be different from current password.";
      if (!confirmPwd) next.confirmPwd = "Please confirm your new password.";
      else if (confirmPwd !== newPwd)
        next.confirmPwd = "Passwords do not match.";
    }
    return next;
  }, [name, changePwd, currentPwd, newPwd, confirmPwd]);

  const hasErrors = useMemo(
    () => Object.values(errors).some(Boolean),
    [errors]
  );

  const pwdStrength = useMemo(() => {
    if (!newPwd)
      return { score: 0, label: "No password", color: "bg-gray-300" };
    let score = 0;
    if (newPwd.length >= 8) score++;
    if (/[A-Z]/.test(newPwd)) score++;
    if (/[a-z]/.test(newPwd)) score++;
    if (/[0-9]/.test(newPwd)) score++;
    if (/[^\w\s]/.test(newPwd)) score++;
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
  }, [newPwd]);

  const dirty = useMemo(() => {
    const nameChanged = name?.trim() !== (defaultName || "");
    const pwdChanged = changePwd && (currentPwd || newPwd || confirmPwd);
    return nameChanged || pwdChanged;
  }, [name, currentPwd, newPwd, confirmPwd, changePwd, defaultName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasErrors) return;
    const ok = await onSubmit({
      name: name.trim(),
      currentPassword: changePwd ? currentPwd : undefined,
      newPassword: changePwd ? newPwd : undefined,
    });
    if (ok) {
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      setChangePwd(false);
    }
  };

  const reqs = {
    len: newPwd.length >= 8,
    up: /[A-Z]/.test(newPwd),
    lo: /[a-z]/.test(newPwd),
    num: /[0-9]/.test(newPwd),
    sp: /[^\w\s]/.test(newPwd),
  };

  const reqPill = (ok) =>
    `text-[10px] px-2 py-0.5 rounded-full border ${
      ok
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-slate-50 text-slate-500 border-slate-200"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Name
        </label>
        <div className="relative">
          <input
            type="text"
            className={`w-full border border-slate-300 px-3 py-2 pr-14 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.name ? "border-rose-300" : ""
            }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={30}
            required
            autoComplete="name"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            {name.length}/30
          </span>
        </div>
        <div className="text-xs text-slate-500 mt-1">Use 2–30 characters.</div>
        <AnimatePresence>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-sm text-rose-600 mt-1"
            >
              {errors.name}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <input
          type="email"
          className="w-full border border-slate-300 px-3 py-2 rounded-lg bg-slate-50 text-slate-800"
          value={email}
          disabled
          readOnly
          autoComplete="email"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Role
        </label>
        <input
          className="w-full border border-slate-300 px-3 py-2 rounded-lg bg-slate-50 text-slate-800"
          value={role}
          disabled
          readOnly
        />
      </div>

      {/* Password change */}
      <div className="border-t border-slate-200 pt-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <button
            type="button"
            className="text-xs text-indigo-600 hover:underline"
            onClick={() => setChangePwd((s) => !s)}
          >
            {changePwd ? "Cancel change" : "Change password"}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {changePwd && (
            <motion.div
              key="pwd-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 space-y-4"
            >
              {/* Current */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-slate-700">
                    Current Password
                  </label>
                  <div className="flex items-center gap-3">
                    <a
                      href="/forgot-password"
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      Forgot current password?
                    </a>
                    <button
                      type="button"
                      className="text-indigo-600 hover:text-indigo-700"
                      onClick={() => setShowCurrent((s) => !s)}
                      aria-label="Toggle current password"
                    >
                      {showCurrent ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>
                <input
                  type={showCurrent ? "text" : "password"}
                  className={`w-full border border-slate-300 px-3 py-2 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.currentPwd ? "border-rose-300" : ""
                  }`}
                  placeholder="Enter current password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  autoComplete="current-password"
                />
                <AnimatePresence>
                  {errors.currentPwd && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-sm text-rose-600 mt-1"
                    >
                      {errors.currentPwd}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* New */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-slate-700">
                    New Password
                  </label>
                  <button
                    type="button"
                    className="text-indigo-600 hover:text-indigo-700"
                    onClick={() => setShowNew((s) => !s)}
                    aria-label="Toggle new password"
                  >
                    {showNew ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                <input
                  type={showNew ? "text" : "password"}
                  className={`w-full border border-slate-300 px-3 py-2 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.newPwd ? "border-rose-300" : ""
                  }`}
                  placeholder="Enter new password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  autoComplete="new-password"
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
                    {newPwd
                      ? `Strength: ${pwdStrength.label}`
                      : "Use at least 8 characters"}
                  </div>
                </div>
                <AnimatePresence>
                  {errors.newPwd && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-sm text-rose-600 mt-1"
                    >
                      {errors.newPwd}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Confirm */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-slate-700">
                    Confirm New Password
                  </label>
                  <button
                    type="button"
                    className="text-indigo-600 hover:text-indigo-700"
                    onClick={() => setShowConfirm((s) => !s)}
                    aria-label="Toggle confirm password"
                  >
                    {showConfirm ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  className={`w-full border border-slate-300 px-3 py-2 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.confirmPwd ? "border-rose-300" : ""
                  }`}
                  placeholder="Confirm new password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  autoComplete="new-password"
                />
                <AnimatePresence>
                  {errors.confirmPwd && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-sm text-rose-600 mt-1"
                    >
                      {errors.confirmPwd}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        type="submit"
        whileTap={{ scale: 0.97 }}
        disabled={saving || !dirty || hasErrors}
        className={`w-full text-white py-2.5 rounded-lg font-semibold transition shadow-sm ${
          saving || !dirty || hasErrors
            ? "bg-slate-300 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {saving ? "Saving..." : "Update Profile"}
      </motion.button>
    </form>
  );
}
