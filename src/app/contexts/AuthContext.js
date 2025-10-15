"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwtDecode from "jwt-decode";

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  loading: false,
});

// Helper: read token from localStorage and return decoded user if valid
function getInitialUser() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    if (decoded?.exp && decoded.exp * 1000 > Date.now()) {
      return decoded;
    }
    // Expired token
    localStorage.removeItem("token");
    return null;
  } catch {
    // Bad token
    localStorage.removeItem("token");
    return null;
  }
}

export function AuthProvider({ children }) {
  // Derive initial user synchronously to avoid setState inside an effect
  const [user, setUser] = useState(getInitialUser);
  const router = useRouter();

  // Keep other tabs/windows in sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "token") {
        setUser(getInitialUser());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (token) => {
    try {
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      router.push("/dashboard");
    } catch {
      // If token is invalid, ensure a clean state
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
    } catch {}
    setUser(null);
    router.push("/login");
  };

  // loading can be false because initialization is synchronous
  return (
    <AuthContext.Provider value={{ user, login, logout, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
