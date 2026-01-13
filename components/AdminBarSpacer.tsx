"use client";

import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";

/**
 * Adds spacing when AdminBar is visible
 * This is a separate component to keep the AdminBar logic clean
 */
export default function AdminBarSpacer() {
  const { isAdmin } = useAuth();
  const pathname = usePathname();

  // Match the same conditions as AdminBar
  if (!isAdmin || pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return null;
  }

  // Add 40px (h-10) spacer for the admin bar
  return <div className="h-10" />;
}
