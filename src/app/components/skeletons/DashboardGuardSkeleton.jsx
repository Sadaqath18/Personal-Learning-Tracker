"use client";

import React from "react";
import Skeleton from "../ui/Skeleton";

export default function DashboardGuardSkeleton() {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <Skeleton className="h-6 w-48" />
      <div className="grid sm:grid-cols-3 gap-4">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
      <div className="grid gap-4">
        <Skeleton className="h-36 w-full rounded-lg" />
        <Skeleton className="h-36 w-full rounded-lg" />
      </div>
    </div>
  );
}
