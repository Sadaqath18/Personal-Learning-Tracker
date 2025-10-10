"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    localStorage.removeItem("token");
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
      Logging out…
    </div>
  );
}
