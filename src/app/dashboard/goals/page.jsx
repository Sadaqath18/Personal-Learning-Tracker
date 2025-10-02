"use client";

import { useEffect, useState } from "react";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState("");

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

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ include token
        },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add goal");
      }

      setGoals((prev) => [data.goal, ...prev]); // ✅ update UI immediately
      setTitle("");
      setDescription("");
      setStatus("success");
    } catch (err) {
      console.error("❌ Error adding goal:", err.message);
      setError(err.message); // ✅ show actual error from backend
    }
  };

  if (loading) return <p>Loading goals...</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Goals</h1>

      {/* Add Goal Form */}
      <form
        onSubmit={handleAddGoal}
        className="space-y-3 p-4 border rounded bg-gray-50 text-blue-800"
      >
        <h2 className="text-lg font-semibold">Add New Goal</h2>
        <input
          type="text"
          placeholder="Goal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          placeholder="Goal Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded border-black-800 hover:bg-green-600"
        >
          Add Goal
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Goals List */}
      <ul className="mt-6 space-y-3">
        {goals.length > 0 ? (
          goals.map((goal) => (
            <li key={goal.id} className="p-3 border rounded bg-white shadow-sm text-red-600">
              <h2 className="font-semibold">{goal.title}</h2>
              <p>{goal.description || "No description provided"}</p>
              <p className="text-sm text-gray-600">Status: {goal.status}</p>
            </li>
          ))
        ) : (
          <p>No goals found.</p>
        )}
      </ul>
    </div>
  );
}
