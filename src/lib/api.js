"use client";

import toast from "react-hot-toast";

// Wrapper around fetch that adds auth header if token is present
export async function api(url, options = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.body && !options.headers?.["Content-Type"]
      ? { "Content-Type": "application/json" }
      : {}),
  };

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      toast.error("Session expired. Please log in again.");
      window.location.href = "/login";
    }
  }

  return res;
}

// Convenience wrapper that parses JSON and throws on !ok
export async function apiJson(url, options = {}) {
  const res = await api(url, options);
  let data = {};
  try {
    data = await res.json();
  } catch {
    // no body
  }
  if (!res.ok) {
    const err = new Error(data?.error || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
