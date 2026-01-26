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
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Only check auth after loading completes
  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) {
      console.log('ProtectedRoute: Still loading auth...');
      return;
    }

    console.log('ProtectedRoute: Auth loaded, user:', user?.email || 'none', 'isAdmin:', isAdmin);

    // Auth finished loading, now check
    if (!user) {
      console.log('ProtectedRoute: No user, will redirect to login');
      setShouldRedirect(true);
    } else if (requiredRole === 'admin' && !isAdmin) {
      console.log('ProtectedRoute: User is not admin, will redirect to unauthorized');
      router.replace('/unauthorized');
    }
  }, [user, loading, isAdmin, router, pathname, requiredRole]);

  // Redirect effect (separate to avoid race conditions)
  useEffect(() => {
    if (shouldRedirect) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [shouldRedirect, router, pathname]);

  // Show loader while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={40} />
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!user || (requiredRole === 'admin' && !isAdmin)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={40} />
      </div>
    );
  }

  return <>{children}</>;
}
