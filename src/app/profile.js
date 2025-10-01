"use client";
import useAuth from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>Redirecting...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl">Profile</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
