"use client";

import PublicRoute from "@/components/auth/PublicRoute";

export default function AuthLayout({ children }) {
  return <PublicRoute>{children}</PublicRoute>;
}
