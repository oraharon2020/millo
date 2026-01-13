"use client";

import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Edit, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Plus,
  Home,
  FolderKanban,
  Lightbulb,
  FileText,
  Image,
  User
} from "lucide-react";
import { useState } from "react";

interface EditLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function AdminBar() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Don't show on admin pages or if not admin
  if (!isAdmin || pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return null;
  }

  // Determine edit link based on current page
  const getEditLink = (): EditLink | null => {
    // Home page
    if (pathname === '/') {
      return { 
        label: 'ערוך דף הבית', 
        href: '/admin/home-content',
        icon: <Home size={14} />
      };
    }

    // Project detail page
    const projectMatch = pathname.match(/^\/projects\/([^/]+)$/);
    if (projectMatch) {
      return { 
        label: 'ערוך פרויקט', 
        href: `/admin/projects/${projectMatch[1]}`,
        icon: <FolderKanban size={14} />
      };
    }

    // Projects list
    if (pathname === '/projects') {
      return { 
        label: 'נהל פרויקטים', 
        href: '/admin/projects',
        icon: <FolderKanban size={14} />
      };
    }

    // Blog/Insights detail page
    const insightMatch = pathname.match(/^\/blog\/([^/]+)$/);
    if (insightMatch) {
      return { 
        label: 'ערוך מאמר', 
        href: `/admin/insights/${insightMatch[1]}`,
        icon: <Lightbulb size={14} />
      };
    }

    // Blog list
    if (pathname === '/blog') {
      return { 
        label: 'נהל מאמרים', 
        href: '/admin/insights',
        icon: <Lightbulb size={14} />
      };
    }

    // Kitchen types
    if (pathname === '/kitchen-types') {
      return { 
        label: 'ערוך סגנונות', 
        href: '/admin/kitchen-styles',
        icon: <Image size={14} />
      };
    }

    // About page
    if (pathname === '/about') {
      return { 
        label: 'ערוך אודות', 
        href: '/admin/home-content',
        icon: <FileText size={14} />
      };
    }

    // Contact page
    if (pathname === '/contact') {
      return { 
        label: 'צפה בפניות', 
        href: '/admin/contacts',
        icon: <FileText size={14} />
      };
    }

    // FAQ page
    if (pathname === '/faq') {
      return { 
        label: 'ערוך שאלות', 
        href: '/admin/settings',
        icon: <FileText size={14} />
      };
    }

    return null;
  };

  const editLink = getEditLink();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-gray-900 text-white h-10 flex items-center justify-between px-4 text-sm shadow-lg">
      {/* Right side - Logo & Quick Links */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin" 
          className="flex items-center gap-2 font-medium hover:text-gray-300 transition-colors"
        >
          <LayoutDashboard size={16} />
          <span>MILLO Admin</span>
        </Link>

        <div className="h-4 w-px bg-gray-700" />

        {/* Edit current page */}
        {editLink && (
          <Link
            href={editLink.href}
            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-800 transition-colors"
          >
            <Edit size={14} />
            <span>{editLink.label}</span>
          </Link>
        )}

        {/* Quick add buttons */}
        <div className="flex items-center gap-1">
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-800 transition-colors"
            title="הוסף פרויקט"
          >
            <Plus size={14} />
            <FolderKanban size={14} />
          </Link>
          <Link
            href="/admin/insights/new"
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-800 transition-colors"
            title="הוסף מאמר"
          >
            <Plus size={14} />
            <Lightbulb size={14} />
          </Link>
        </div>
      </div>

      {/* Left side - User menu */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-800 transition-colors"
          target="_blank"
        >
          <span>צפה באתר</span>
        </Link>

        <div className="h-4 w-px bg-gray-700" />

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-800 transition-colors"
          >
            <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
              <User size={14} />
            </div>
            <span>{profile?.full_name || user?.email?.split('@')[0]}</span>
          </button>

          {showUserMenu && (
            <>
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute left-0 top-full mt-1 w-48 bg-white text-gray-900 rounded-lg shadow-xl border border-gray-100 py-1 z-20">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="font-medium text-sm">{profile?.full_name}</p>
                  <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
                </div>
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  <LayoutDashboard size={14} />
                  <span>דשבורד</span>
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings size={14} />
                  <span>הגדרות</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={14} />
                  <span>התנתקות</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
