"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'client';
}

export default function ProtectedRoute({ children, requiredRole = 'admin' }: ProtectedRouteProps) {
  const { user, profile, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  console.log('ProtectedRoute Debug:', { user: user?.email, profile, loading, isAdmin, requiredRole });

  useEffect(() => {
    if (!loading) {
      // Not logged in
      if (!user) {
        console.log('No user, redirecting to login');
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // Check role
      if (requiredRole === 'admin' && !isAdmin) {
        console.log('Not admin, redirecting to unauthorized');
        router.push('/unauthorized');
        return;
      }
    }
  }, [user, profile, loading, isAdmin, router, pathname, requiredRole]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-gray-400 mx-auto mb-4" size={40} />
          <p className="text-gray-500">טוען...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Not authorized (wrong role)
  if (requiredRole === 'admin' && !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
