"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowRight, X, Save, ImageIcon, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import ImagePicker from "@/components/admin/ImagePicker";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imagePickerMode, setImagePickerMode] = useState<'thumbnail' | 'gallery'>('thumbnail');
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    image_url: "",
    images: [] as string[],
    is_featured: false
  });

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setFormData({
          title: data.title || "",
          description: data.description || "",
          location: data.location || "",
          category: data.category || "",
          image_url: data.image_url || "",
          images: data.images || [],
          is_featured: data.is_featured || false
        });
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      alert('שגיאה בטעינת הפרויקט');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      alert('נא להזין שם פרויקט');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          category: formData.category,
          image_url: formData.image_url,
          images: formData.images,
          is_featured: formData.is_featured,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      router.push('/admin/projects');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('שגיאה בעדכון הפרויקט');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('האם אתה בטוח שברצונך למחוק פרויקט זה?')) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      router.push('/admin/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('שגיאה במחיקת הפרויקט');
    }
  };

  const openImagePicker = (mode: 'thumbnail' | 'gallery') => {
    setImagePickerMode(mode);
    setShowImagePicker(true);
  };

  const handleImageSelect = (url: string) => {
    if (imagePickerMode === 'thumbnail') {
      setFormData({ ...formData, image_url: url });
    } else {
      setFormData({ ...formData, images: [...formData.images, url] });
    }
    setShowImagePicker(false);
  };

  const removeGalleryImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
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
            href="/admin/projects"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRight size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">עריכת פרויקט</h1>
            <p className="text-gray-500 text-sm mt-1">עדכן את פרטי הפרויקט</p>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">פרטי הפרויקט</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שם הפרויקט *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="הזן שם פרויקט"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">תיאור</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
              placeholder="תאר את הפרויקט..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">מיקום</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="תל אביב"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">קטגוריה</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white"
              >
                <option value="">בחר קטגוריה</option>
                <option value="מטבחים">מטבחים</option>
                <option value="ארונות">ארונות</option>
                <option value="חדרי רחצה">חדרי רחצה</option>
                <option value="סלונים">סלונים</option>
                <option value="משרדים">משרדים</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="featured" className="text-sm text-gray-700">הצג פרויקט זה בדף הבית</label>
          </div>
        </div>

        {/* Thumbnail */}
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
              onClick={() => openImagePicker('thumbnail')}
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-400 transition-colors"
            >
              <ImageIcon className="text-gray-400 mb-2" size={32} />
              <span className="text-gray-500">לחץ לבחירת תמונה</span>
              <span className="text-gray-400 text-sm">מהגלריה, מהמחשב או מקישור</span>
            </button>
          )}
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">גלריית תמונות</h2>
          
          <div className="grid grid-cols-3 gap-4">
            {formData.images.map((url, index) => (
              <div key={index} className="relative h-32 rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={url}
                  alt={`Gallery ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-2 left-2 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-100"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => openImagePicker('gallery')}
              className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-400 transition-colors"
            >
              <Plus className="text-gray-400 mb-1" size={20} />
              <span className="text-gray-400 text-sm">הוסף תמונה</span>
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/projects"
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
        onSelect={handleImageSelect}
        title={imagePickerMode === 'thumbnail' ? 'בחר תמונה ראשית' : 'הוסף תמונה לגלריה'}
      />
    </div>
  );
}
