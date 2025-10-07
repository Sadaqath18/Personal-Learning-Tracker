"use client";

import React from "react";
import Skeleton, { SkeletonText } from "../ui/Skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="max-w-xl mx-auto p-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 bg-white/30" rounded="full" />
          <div className="flex-1">
            <Skeleton className="h-5 w-40 bg-white/40" />
            <div className="flex items-center gap-2 mt-2">
              <Skeleton className="h-3 w-52 bg-white/30" />
              <Skeleton className="h-4 w-16 bg-white/30 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white rounded-b-xl shadow p-6 space-y-5">
        {/* Name */}
        <div>
          <Skeleton className="h-3 w-16 mb-2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-32 mt-2" />
        </div>
        {/* Email */}
        <div>
          <Skeleton className="h-3 w-16 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        {/* Role */}
        <div>
          <Skeleton className="h-3 w-12 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        {/* Password section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="mt-3 space-y-3">
            <div>
              <Skeleton className="h-3 w-36 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-3 w-28 mb-2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-2 w-full mt-2" />
            </div>
            <div>
              <Skeleton className="h-3 w-40 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
        {/* Button */}
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}