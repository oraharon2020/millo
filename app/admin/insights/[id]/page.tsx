"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowRight, X, Save, ImageIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import ImagePicker from "@/components/admin/ImagePicker";

export default function EditInsightPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    image_url: "",
    reading_time: ""
  });

  useEffect(() => {
    fetchInsight();
  }, [id]);

  const fetchInsight = async () => {
    try {
      const { data, error } = await supabase
        .from('kitchen_insights')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setFormData({
          title: data.title || "",
          description: data.description || "",
          content: data.content || "",
          category: data.category || "",
          image_url: data.image_url || "",
          reading_time: data.reading_time || ""
        });
      }
    } catch (error) {
      console.error('Error fetching insight:', error);
      alert('שגיאה בטעינת המאמר');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      alert('נא להזין כותרת');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('kitchen_insights')
        .update({
          title: formData.title,
          description: formData.description,
          content: formData.content,
          category: formData.category,
          image_url: formData.image_url,
          reading_time: formData.reading_time,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      router.push('/admin/insights');
    } catch (error) {
      console.error('Error updating insight:', error);
      alert('שגיאה בעדכון המאמר');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('האם אתה בטוח שברצונך למחוק מאמר זה?')) return;
    
    try {
      const { error } = await supabase
        .from('kitchen_insights')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      router.push('/admin/insights');
    } catch (error) {
      console.error('Error deleting insight:', error);
      alert('שגיאה במחיקת המאמר');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/insights"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRight size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">עריכת מאמר</h1>
            <p className="text-gray-500 text-sm mt-1">עדכן את פרטי המאמר</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
          <span>מחק</span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">פרטי המאמר</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">כותרת *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="הזן כותרת"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">תקציר</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
              placeholder="תקציר קצר של המאמר..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">תוכן</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
              placeholder="כתוב את תוכן המאמר..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">קטגוריה</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white"
              >
                <option value="">בחר קטגוריה</option>
                <option value="עיצוב">עיצוב</option>
                <option value="חומרים">חומרים</option>
                <option value="טרנדים">טרנדים</option>
                <option value="טיפים">טיפים</option>
                <option value="השראה">השראה</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">זמן קריאה</label>
              <input
                type="text"
                value={formData.reading_time}
                onChange={(e) => setFormData({ ...formData, reading_time: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="3 דקות"
              />
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">תמונה ראשית</h2>
          
          {formData.image_url ? (
            <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={formData.image_url}
                alt="Thumbnail"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, image_url: "" })}
                className="absolute top-2 left-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowImagePicker(true)}
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-400 transition-colors"
            >
              <ImageIcon className="text-gray-400 mb-2" size={32} />
              <span className="text-gray-500">לחץ לבחירת תמונה</span>
              <span className="text-gray-400 text-sm">מהגלריה, מהמחשב או מקישור</span>
            </button>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/insights"
            className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            ביטול
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            <span>{saving ? 'שומר...' : 'שמור שינויים'}</span>
          </button>
        </div>
      </form>

      {/* Image Picker Modal */}
      <ImagePicker
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={(url) => {
          setFormData({ ...formData, image_url: url });
          setShowImagePicker(false);
        }}
        title="בחר תמונה למאמר"
      />
    </div>
  );
}
