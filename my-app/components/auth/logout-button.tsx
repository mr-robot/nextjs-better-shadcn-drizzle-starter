"use client";

import { authClient } from "@/lib/client-auth";

export function LogoutButton() {
  return (
    <button
      onClick={() => authClient.signOut()}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
}
