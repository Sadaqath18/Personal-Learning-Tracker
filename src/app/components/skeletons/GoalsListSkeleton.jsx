"use client";

import React from "react";
import GoalCardSkeleton from "./GoalCardSkeleton";

export default function GoalsListSkeleton({ count = 3 }) {
  return (
    <ul className="mt-6 space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <GoalCardSkeleton key={i} />
      ))}
    </ul>
  );
}