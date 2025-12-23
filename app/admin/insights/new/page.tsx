"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Upload, X, Save, ImageIcon } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import ImagePicker from "@/components/admin/ImagePicker";

export default function NewInsightPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    image_url: "",
    reading_time: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      alert('נא להזין כותרת');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('kitchen_insights')
        .insert([{
          title: formData.title,
          description: formData.description,
          content: formData.content,
          category: formData.category,
          image_url: formData.image_url,
          reading_time: formData.reading_time
        }]);
      
      if (error) throw error;
      router.push('/admin/insights');
    } catch (error) {
      console.error('Error creating insight:', error);
      alert('שגיאה ביצירת המאמר');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `insights/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('שגיאה בהעלאת התמונה');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/insights"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRight size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">מאמר חדש</h1>
          <p className="text-gray-500 text-sm mt-1">צור מאמר חדש ל-Kitchen Insights</p>
        </div>
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
            disabled={loading}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            <span>{loading ? 'שומר...' : 'שמור מאמר'}</span>
          </button>
        </div>
      </form>

      {/* Image Picker Modal */}
      <ImagePicker
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={(url) => setFormData({ ...formData, image_url: url })}
        title="בחר תמונה למאמר"
      />
    </div>
  );
}
