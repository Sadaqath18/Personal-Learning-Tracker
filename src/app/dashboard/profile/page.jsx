"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileForm from "../../components/profile/ProfileForm";
import ProfileSkeleton from "@/app/components/skeletons/ProfileSkeleton";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load profile");
        setUser(data.user);
      } catch (err) {
        toast.error(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async ({ name, currentPassword, newPassword }) => {
    setSaving(true);
    try {
      const payload = { name };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setUser((u) => ({ ...u, name: data.user?.name ?? name }));
      toast.success(
        newPassword ? "Profile and password updated!" : "Profile updated!"
      );
      return true;
    } catch (err) {
      toast.error(err.message || "Update failed");
      return false;
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded shadow text-center">
        <p className="text-gray-700">We couldn’t load your profile.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-xl mx-auto p-0"
    >
      <ProfileHeader name={user.name} email={user.email} role={user.role} />
      <div className="bg-white rounded-b-xl shadow p-6">
        <ProfileForm
          defaultName={user.name || ""}
          email={user.email}
          role={user.role}
          onSubmit={handleUpdate}
          saving={saving}
        />
      </div>
    </motion.div>
  );
}
