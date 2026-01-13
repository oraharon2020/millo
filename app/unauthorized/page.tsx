"use client";

import Link from "next/link";
import { ShieldX } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX className="text-red-500" size={40} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">גישה נדחתה</h1>
        <p className="text-gray-500 mb-6">
          אין לך הרשאות לצפות בדף זה.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            חזרה לדף הבית
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            התחברות
          </Link>
        </div>
      </div>
    </div>
  );
}
