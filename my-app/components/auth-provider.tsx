"use client";

import React from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // TODO: Implement proper Better Auth provider when available
  // For now, this is a simple wrapper
  return <>{children}</>;
}
