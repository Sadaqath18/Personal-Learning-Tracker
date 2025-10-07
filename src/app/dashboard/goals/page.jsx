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
    status: "pending",
  });
  const [error, setError] = useState("");
  const [editingGoal, setEditingGoal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [expandedGoals, setExpandedGoals] = useState({});

  // Memoized API calls
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
          body: JSON.stringify(formData),
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
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update goal");

        setGoals((prev) =>
          prev.map((g) => (g.id === editingGoal.id ? data : g))
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

  const handleStatusChange = useCallback(async (goalId, newStatus) => {
    setStatusUpdatingId(goalId);
    const toastId = toast.loading("Updating status...");
    try {
      const res = await fetch(`/api/goals/${goalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
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
  }, []);

  const toggleDescription = useCallback((goalId) => {
    setExpandedGoals((prev) => ({
      ...prev,
      [goalId]: !prev[goalId],
    }));
  }, []);

  const handleEditClick = useCallback((goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || "",
      status: goal.status,
    });
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      description: "",
      status: "pending",
    });
    setEditingGoal(null);
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const memoizedGoals = useMemo(() => goals, [goals]);

  return (
    <div className="p-4 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-4 text-white">My Goals</h1>

      {/* Add/Edit Goal Form */}
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

        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className={`flex items-center justify-center gap-2 ${
              editingGoal
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

      {/* Goals List with skeleton while loading */}
      {loading ? (
        <GoalsListSkeleton count={3} />
      ) : (
        <ul className="mt-6 space-y-3">
          {memoizedGoals.length > 0 ? (
            memoizedGoals.map((goal) => (
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
            <p className="text-white">No goals found.</p>
          )}
        </ul>
      )}
    </div>
  );
}
