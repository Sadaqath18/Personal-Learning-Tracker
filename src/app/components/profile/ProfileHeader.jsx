"use client";

import React from "react";

const RoleBadge = ({ role }) => {
  const base =
    "px-2 py-0.5 rounded-full text-xs font-semibold border backdrop-blur";
  const className =
    role === "admin"
      ? `${base} bg-purple-100 text-purple-700 border-purple-200`
      : `${base} bg-blue-100 text-blue-700 border-blue-200`;
  return <span className={className}>{role}</span>;
};

const ProfileHeader = ({ name, email, role }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl p-6 text-white">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
          {name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-white/90 text-sm">{email}</span>
            <RoleBadge role={role} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;