"use client";

import { useEffect, useState } from "react";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState("");
  const [editingGoal, setEditingGoal] = useState(null); // track goal being edited
  const [saving, setSaving] = useState(false);
  //

  useEffect(() => {
    const fetchGoals = async () => {
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
    };

    fetchGoals();
  }, []);

  // ✅ Add goal
  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, description, status }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to add goal");

      setGoals((prev) => [data.goal, ...prev]);
      setTitle("");
      setDescription("");
      setStatus("pending");
    } catch (err) {
      console.error("❌ Error adding goal:", err.message);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Start editing
  const handleEditClick = (goal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setDescription(goal.description || "");
    setStatus(goal.status);
  };

  // ✅ Save edited goal
  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch(`/api/goals/${editingGoal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, description, status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update goal");

      setGoals((prev) => prev.map((g) => (g.id === editingGoal.id ? data : g)));

      setEditingGoal(null);
      setTitle("");
      setDescription("");
      setStatus("pending");
    } catch (err) {
      console.error("❌ Error updating goal:", err.message);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Delete goal
  const handleDeleteGoal = async (id) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;

    try {
      const res = await fetch(`/api/goals/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete goal");

      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error("❌ Error deleting goal:", err.message);
      setError(err.message);
    }
  };

  // ✅ Update status directly
  const handleStatusChange = async (goalId, newStatus) => {
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
    } catch (err) {
      console.error("❌ Error updating status:", err.message);
      setError(err.message);
    }
  };

  if (loading) return <p>Loading goals...</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Goals</h1>

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
          placeholder="Goal Title"
          value={title ?? ""}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <textarea
          placeholder="Goal Description"
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <select
          value={status ?? "pending"}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button
          type="submit"
          disabled={saving}
          className={`${
            editingGoal
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-green-500 hover:bg-green-600"
          } text-white px-4 py-2 rounded`}
        >
          {saving
            ? editingGoal
              ? "Saving..."
              : "Adding..."
            : editingGoal
            ? "Save Changes"
            : "Add Goal"}
        </button>
        {editingGoal && (
          <button
            type="button"
            onClick={() => {
              setEditingGoal(null);
              setTitle("");
              setDescription("");
              setStatus("pending");
            }}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Goals List */}
      <ul className="mt-6 space-y-3">
        {goals.length > 0 ? (
          goals.map((goal) => (
            <li
              key={goal.id}
              className="p-3 border rounded bg-white shadow-sm flex text-red-800 justify-between items-start"
            >
              <div>
                <h2 className="font-semibold">{goal.title}</h2>
                <p className="break-words whitespace-pre-line line-clamp-3">
                  {goal.description || "No description provided"}
                </p>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <select
                    value={goal.status}
                    onChange={(e) =>
                      handleStatusChange(goal.id, e.target.value)
                    }
                    className="ml-2 border px-2 py-1 rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditClick(goal)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No goals found.</p>
        )}
      </ul>
    </div>
  );
}
