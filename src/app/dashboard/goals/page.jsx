"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";
import GoalCard from "../../components/GoalCard";
import GoalsListSkeleton from "@/app/components/skeletons/GoalsListSkeleton";
import React from "react";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [editingGoal, setEditingGoal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [expandedGoals, setExpandedGoals] = useState({});

  const [filter, setFilter] = useState(() => {
    if (typeof window === "undefined") return "all";
    return localStorage.getItem("plt_goals_filter") || "all";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("plt_goals_filter", filter);
    }
  }, [filter]);

  const fetchGoals = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setGoals(data.goals || []);
    } catch (err) {
      console.error("Error fetching goals:", err.message);
      setError("Failed to load goals.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddGoal = useCallback(
    async (e) => {
      e.preventDefault();
      setSaving(true);
      const loadingToast = toast.loading("Adding goal...");
      try {
        const res = await fetch("/api/goals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add goal");
        setGoals((prev) => [data.goal, ...prev]);
        resetForm();
        toast.success("Goal added successfully!", { id: loadingToast });
      } catch (err) {
        toast.error(err.message, { id: loadingToast });
        console.error("❌ Error adding goal:", err.message);
        setError(err.message);
      } finally {
        setSaving(false);
      }
    },
    [formData]
  );

  const handleUpdateGoal = useCallback(
    async (e) => {
      e.preventDefault();
      setSaving(true);
      const loadingToast = toast.loading("Saving changes...");
      try {
        const res = await fetch(`/api/goals/${editingGoal.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update goal");
        const updated = data.goal ?? data; // support both shapes
        setGoals((prev) =>
          prev.map((g) => (g.id === editingGoal.id ? updated : g))
        );
        setEditingGoal(null);
        resetForm();
        toast.success("Goal updated successfully ✅", { id: loadingToast });
      } catch (err) {
        toast.error(err.message, { id: loadingToast });
        console.error("❌ Error updating goal:", err.message);
        setError(err.message);
      } finally {
        setSaving(false);
      }
    },
    [formData, editingGoal]
  );

  const handleDeleteGoal = useCallback(async (id) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    setDeletingId(id);
    const loadingToast = toast.loading("Deleting goal...");
    try {
      const res = await fetch(`/api/goals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete goal");
      setGoals((prev) => prev.filter((g) => g.id !== id));
      toast.success("Goal deleted ✅", { id: loadingToast });
    } catch (err) {
      toast.error(err.message, { id: loadingToast });
      console.error("❌ Error deleting goal:", err.message);
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }, []);

  const handleStatusChange = useCallback(
    async (goalId, newStatus) => {
      setStatusUpdatingId(goalId);
      const toastId = toast.loading("Updating status...");
      try {
        const goal = goals.find((g) => g.id === goalId);
        const res = await fetch(`/api/goals/${goalId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            status: newStatus,
            // include these only if your server requires title on PUT
            title: goal?.title,
            description: goal?.description ?? null,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update status");

        setGoals((prev) =>
          prev.map((g) => (g.id === goalId ? { ...g, status: newStatus } : g))
        );
        toast.success("Status updated ✅", { id: toastId });
      } catch (err) {
        toast.error(err.message, { id: toastId });
        console.error("❌ Error updating status:", err.message);
        setError(err.message);
      } finally {
        setStatusUpdatingId(null);
      }
    },
    [goals]
  );

  const toggleDescription = useCallback((goalId) => {
    setExpandedGoals((prev) => ({ ...prev, [goalId]: !prev[goalId] }));
  }, []);

  const handleEditClick = useCallback((goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || "",
    });
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ title: "", description: "" });
    setEditingGoal(null);
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // Counts for chips
  const counts = useMemo(() => {
    const c = { all: goals.length, pending: 0, "in-progress": 0, completed: 0 };
    for (const g of goals) {
      if (g.status === "pending") c["pending"]++;
      else if (g.status === "in-progress") c["in-progress"]++;
      else if (g.status === "completed") c["completed"]++;
    }
    return c;
  }, [goals]);

  // Filtered list
  const filteredGoals = useMemo(() => {
    if (filter === "all") return goals;
    return goals.filter((g) => g.status === filter);
  }, [goals, filter]);

  const chipClass = (value) => {
    const active = filter === value;
    if (value === "completed") {
      return active
        ? "bg-emerald-600 text-white border-emerald-600"
        : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700";
    }
    if (value === "in-progress") {
      return active
        ? "bg-amber-500 text-white border-amber-500"
        : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700";
    }
    if (value === "pending") {
      return active
        ? "bg-slate-600 text-white border-slate-600"
        : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700";
    }
    // all
    return active
      ? "bg-indigo-600 text-white border-indigo-600"
      : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700";
  };

  return (
    <div className="p-4 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-4 text-white">My Goals</h1>

      {/* Add/Edit Goal Form (no Status field) */}
      <form
        onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal}
        className="space-y-3 p-4 border rounded bg-gray-50 text-blue-800"
      >
        <h2 className="text-lg font-semibold">
          {editingGoal ? "Edit Goal" : "Add New Goal"}
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Goal Title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Goal Description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded resize-none"
        />

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving || !formData.title.trim()}
            className={`flex items-center justify-center gap-2 ${
              saving || !formData.title.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : editingGoal
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white font-bold px-4 py-2 rounded`}
          >
            {saving ? <Spinner /> : editingGoal ? "Save Changes" : "Add Goal"}
          </button>

          {editingGoal && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-yellow-400 font-bold text-white px-4 py-2 rounded hover:bg-yellow-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Quick status filters */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {[
          { value: "all", label: "All", count: counts.all },
          { value: "pending", label: "Pending", count: counts["pending"] },
          {
            value: "in-progress",
            label: "In Progress",
            count: counts["in-progress"],
          },
          { value: "completed", label: "Completed", count: counts.completed },
        ].map((chip) => (
          <button
            key={chip.value}
            type="button"
            onClick={() => setFilter(chip.value)}
            aria-pressed={filter === chip.value}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${chipClass(
              chip.value
            )}`}
          >
            {chip.label}
            <span className="ml-2 opacity-80">{chip.count}</span>
          </button>
        ))}
      </div>

      {/* Goals List with skeleton while loading */}
      {loading ? (
        <GoalsListSkeleton count={3} />
      ) : (
        <ul className="mt-4 space-y-3">
          {filteredGoals.length > 0 ? (
            filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEditClick}
                onDelete={handleDeleteGoal}
                onStatusChange={handleStatusChange}
                isDeleting={deletingId}
                isStatusUpdating={statusUpdatingId}
                expandedGoals={expandedGoals}
                toggleDescription={toggleDescription}
              />
            ))
          ) : (
            <p className="text-white">No goals found for this filter.</p>
          )}
        </ul>
      )}
    </div>
  );
}
