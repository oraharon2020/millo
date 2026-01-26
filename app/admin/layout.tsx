"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminTopBar from "@/components/admin/TopBar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50" dir="rtl">
        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Main Content */}
        <div className={`transition-all duration-300 ${sidebarOpen ? 'mr-64' : 'mr-20'}`}>
          <AdminTopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
