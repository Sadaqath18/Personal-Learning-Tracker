"use client";

import React from "react";
import Skeleton, { SkeletonText } from "../ui/Skeleton";

export default function GoalCardSkeleton() {
  return (
    <li className="p-4 border rounded bg-white shadow-sm flex flex-col gap-3">
      <div className="flex-1 min-w-0">
        <Skeleton className="h-4 w-2/3 mb-2" />
        <SkeletonText lines={3} />
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </li>
  );
}