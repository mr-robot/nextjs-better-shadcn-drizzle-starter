"use client";

import { authClient } from "@/lib/client-auth";

export function UserProfile() {
  // TODO: Implement proper user state management with Better Auth
  // For now, this is a placeholder component
  return (
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-full bg-gray-300"></div>
      <span>User Profile</span>
    </div>
  );
}
