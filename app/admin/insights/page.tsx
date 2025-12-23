"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import Link from "next/link";
import { supabase, KitchenInsight } from "@/lib/supabase";
import Image from "next/image";

export default function InsightsPage() {
  const [insights, setInsights] = useState<KitchenInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const { data, error } = await supabase
        .from('kitchen_insights')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setInsights(data || []);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק מאמר זה?')) return;
    
    try {
      const { error } = await supabase
        .from('kitchen_insights')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setInsights(insights.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting insight:', error);
      alert('שגיאה במחיקת המאמר');
    }
  };

  const filteredInsights = insights.filter(insight =>
    insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insight.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kitchen Insights</h1>
          <p className="text-gray-500 text-sm mt-1">ניהול מאמרים וטיפים</p>
        </div>
        <Link 
          href="/admin/insights/new"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} />
          <span>מאמר חדש</span>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="חיפוש מאמרים..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>
      </div>

      {/* Insights Grid */}
      {loading ? (
        <div className="p-8 text-center text-gray-500">טוען...</div>
      ) : filteredInsights.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <p className="text-gray-500 mb-4">לא נמצאו מאמרים</p>
          <Link 
            href="/admin/insights/new"
            className="text-gray-900 font-medium hover:underline"
          >
            צור מאמר ראשון
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInsights.map((insight) => (
            <div 
              key={insight.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group"
            >
              <div className="relative h-48 bg-gray-100">
                {insight.image_url ? (
                  <Image
                    src={insight.image_url}
                    alt={insight.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    אין תמונה
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/insights/${insight.id}`}
                      className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(insight.id)}
                      className="p-3 bg-white rounded-full hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {insight.category && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {insight.category}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 line-clamp-2">{insight.title}</h3>
                {insight.description && (
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">{insight.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
