"use client";

import React from "react";
import Skeleton from "../ui/Skeleton";

export default function AdminPanelSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <Skeleton className="h-6 w-40 mb-2" />

      {/* Users table */}
      <div className="bg-white rounded shadow p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="overflow-x-auto mt-3">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                {Array.from({ length: 6 }).map((_, i) => (
                  <th key={i} className="py-2 pr-3">
                    <Skeleton className="h-3 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, r) => (
                <tr key={r} className="border-b last:border-0">
                  {Array.from({ length: 6 }).map((__, c) => (
                    <td key={c} className="py-3 pr-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Goals list */}
      <div className="bg-white rounded shadow p-4">
        <Skeleton className="h-5 w-28" />
        <ul className="mt-3 divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="py-3 flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-3 w-5/6 mb-1" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-40 mt-2" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
