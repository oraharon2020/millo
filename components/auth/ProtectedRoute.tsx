"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'client';
}

export default function ProtectedRoute({ children, requiredRole = 'admin' }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [timedOut, setTimedOut] = useState(false);

  // Safety timeout - if loading takes more than 3 seconds, redirect to login
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setTimedOut(true);
      }
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [loading]);

  useEffect(() => {
    if (loading && !timedOut) return;

    if (!user || timedOut) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (requiredRole === 'admin' && !isAdmin) {
      router.replace('/unauthorized');
    }
  }, [user, loading, isAdmin, router, pathname, requiredRole, timedOut]);

  if (loading && !timedOut) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={40} />
      </div>
    );
  }

  if (!user || (requiredRole === 'admin' && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
