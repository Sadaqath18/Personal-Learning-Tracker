"use client";

import React from "react";

const roundedMap = {
  none: "",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export default function Skeleton({ className = "", rounded = "md" }) {
  const roundedClass = roundedMap[rounded] || roundedMap.md;
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-600 ${roundedClass} ${className}`}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className = "",
  lineClassName = "",
}) {
  const widths = [100, 90, 75, 60, 80, 95];
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="flex">
          <Skeleton
            className={`h-3 ${lineClassName}`}
            style={{ width: `${widths[i % widths.length]}%` }}
          />
        </div>
      ))}
    </div>
  );
}
