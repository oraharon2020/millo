"use client";

import { Bell, Search, Menu, User } from "lucide-react";

interface TopBarProps {
  onMenuClick: () => void;
}

export default function AdminTopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Right side - Search */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
        >
          <Menu size={20} />
        </button>
        
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="חיפוש..."
            className="w-64 pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Left side - Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-3 pr-4 border-r border-gray-200">
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">מנהל</p>
            <p className="text-xs text-gray-500">admin@millo.co.il</p>
          </div>
          <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
            <User size={18} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
