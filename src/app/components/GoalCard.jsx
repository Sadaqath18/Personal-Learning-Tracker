"use client";

import { useState } from "react";
import Spinner from "./Spinner";
import { motion } from "framer-motion";

const GoalCard = ({
  goal,
  onEdit,
  onDelete,
  onStatusChange,
  isDeleting,
  isStatusUpdating,
  expandedGoals,
  toggleDescription,
}) => {
  const isExpanded = expandedGoals[goal.id] || false;
  const isCurrentDeleting = isDeleting === goal.id;
  const isCurrentStatusUpdating = isStatusUpdating === goal.id;
  const isCompleted = goal.status === "completed";

  return (
    <li
      key={goal.id}
      className="p-4 border rounded bg-white shadow-sm text-red-800 flex flex-col gap-3"
    >
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <h2
          className={`font-semibold text-lg break-words ${
            isCompleted ? "line-through text-gray-400" : ""
          }`}
        >
          {goal.title}
        </h2>
        <p
          className={`break-words whitespace-pre-wrap text-sm mt-1 ${
            isExpanded ? "" : "line-clamp-3"
          } ${isCompleted ? "line-through text-gray-400" : ""}`}
        >
          {goal.description || "No description provided"}
        </p>

        {goal.description && goal.description.length > 100 && (
          <button
            onClick={() => toggleDescription(goal.id)}
            className="text-blue-600 text-left text-sm mt-1 hover:underline"
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-600">Status:</p>
          <select
            disabled={isCurrentStatusUpdating}
            value={goal.status}
            onChange={(e) => onStatusChange(goal.id, e.target.value)}
            className="border px-2 py-1 rounded text-gray-800"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {isCurrentStatusUpdating && <Spinner size="sm" />}

          {/* Animated status display */}
          <motion.span
            key={goal.status}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`ml-2 text-sm font-semibold ${
              goal.status === "completed"
                ? "text-green-600"
                : goal.status === "in-progress"
                ? "text-yellow-600"
                : "text-gray-500"
            }`}
          >
            {goal.status.replace("-", " ")}
          </motion.span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(goal)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            disabled={isCurrentDeleting}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            {isCurrentDeleting ? <Spinner size="sm" /> : "Delete"}
          </button>
        </div>
      </div>
    </li>
  );
};

export default GoalCard;