"use client";

import { authClient } from "@/lib/client-auth";

export function LoginButton({ provider }: { provider: "google" | "facebook" }) {
  return (
    <button
      onClick={() => authClient.signIn.social({ provider, callbackURL: "/dashboard" })}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Login with {provider.charAt(0).toUpperCase() + provider.slice(1)}
    </button>
  );
}
