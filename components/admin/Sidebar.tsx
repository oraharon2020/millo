"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Lightbulb, 
  MessageSquare, 
  Settings,
  ChevronRight,
  ChevronLeft,
  Image,
  Users,
  Home,
  ChefHat,
  UserPlus,
  FileText,
  Boxes,
  Info
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { 
    title: "דשבורד", 
    href: "/admin", 
    icon: LayoutDashboard 
  },
  { 
    title: "לידים", 
    href: "/admin/leads", 
    icon: UserPlus 
  },
  { 
    title: "הצעות מחיר", 
    href: "/admin/quotes", 
    icon: FileText 
  },
  { 
    title: "תוכן דף הבית", 
    href: "/admin/home-content", 
    icon: Home 
  },
  { 
    title: "דף אודות", 
    href: "/admin/about", 
    icon: Info 
  },
  { 
    title: "סוגי מטבחים", 
    href: "/admin/kitchen-styles", 
    icon: ChefHat 
  },
  { 
    title: "קטגוריות נגרות", 
    href: "/admin/categories", 
    icon: Boxes 
  },
  { 
    title: "פרויקטים", 
    href: "/admin/projects", 
    icon: FolderKanban 
  },
  { 
    title: "Kitchen Insights", 
    href: "/admin/insights", 
    icon: Lightbulb 
  },
  { 
    title: "גלריה", 
    href: "/admin/gallery", 
    icon: Image 
  },
  { 
    title: "משתמשים", 
    href: "/admin/users", 
    icon: Users 
  },
  { 
    title: "הגדרות", 
    href: "/admin/settings", 
    icon: Settings 
  },
];

export default function AdminSidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside 
      className={`fixed top-0 right-0 h-full bg-gray-900 text-white transition-all duration-300 z-50 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
        {isOpen && (
          <span className="font-bold text-xl tracking-wider">MILLO</span>
        )}
        <button 
          onClick={onToggle}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-white text-gray-900 font-medium' 
                  : 'hover:bg-gray-800 text-gray-300'
              } ${!isOpen && 'justify-center'}`}
            >
              <item.icon size={20} />
              {isOpen && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"
          >
            <span>← חזרה לאתר</span>
          </Link>
        </div>
      )}
    </aside>
  );
}
