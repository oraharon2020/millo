"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, GripVertical, Pencil, Trash2, Save, X, Image as ImageIcon } from "lucide-react";
import ImagePicker from "@/components/admin/ImagePicker";

interface Category {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  bg_color: string;
  link_url: string | null;
  order_index: number;
  is_active: boolean;
}

const bgColorOptions = [
  { value: 'from-amber-50 to-orange-50', label: 'כתום בהיר', preview: 'bg-gradient-to-br from-amber-50 to-orange-50' },
  { value: 'from-gray-100 to-gray-200', label: 'אפור', preview: 'bg-gradient-to-br from-gray-100 to-gray-200' },
  { value: 'from-amber-100 to-amber-200', label: 'כתום', preview: 'bg-gradient-to-br from-amber-100 to-amber-200' },
  { value: 'from-rose-50 to-pink-50', label: 'ורוד בהיר', preview: 'bg-gradient-to-br from-rose-50 to-pink-50' },
  { value: 'from-blue-50 to-blue-100', label: 'כחול בהיר', preview: 'bg-gradient-to-br from-blue-50 to-blue-100' },
  { value: 'from-green-50 to-green-100', label: 'ירוק בהיר', preview: 'bg-gradient-to-br from-green-50 to-green-100' },
  { value: 'from-purple-50 to-purple-100', label: 'סגול בהיר', preview: 'bg-gradient-to-br from-purple-50 to-purple-100' },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    bg_color: 'from-gray-100 to-gray-200',
    link_url: '',
    is_active: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order_index');
    
    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    const maxOrder = Math.max(...categories.map(c => c.order_index), 0);
    
    const { error } = await supabase
      .from('categories')
      .insert([{
        ...formData,
        order_index: maxOrder + 1
      }]);
    
    if (error) {
      console.error('Error adding category:', error);
      alert('שגיאה בהוספת קטגוריה');
    } else {
      setShowAddModal(false);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        bg_color: 'from-gray-100 to-gray-200',
        link_url: '',
        is_active: true
      });
      fetchCategories();
    }
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .update({
        title: formData.title,
        description: formData.description || null,
        image_url: formData.image_url || null,
        bg_color: formData.bg_color,
        link_url: formData.link_url || null,
        is_active: formData.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating category:', error);
      alert('שגיאה בעדכון קטגוריה');
    } else {
      setEditingId(null);
      fetchCategories();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם למחוק קטגוריה זו?')) return;
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting category:', error);
      alert('שגיאה במחיקת קטגוריה');
    } else {
      fetchCategories();
    }
  };

  const startEdit = (category: Category) => {
    setFormData({
      title: category.title,
      description: category.description || '',
      image_url: category.image_url || '',
      bg_color: category.bg_color,
      link_url: category.link_url || '',
      is_active: category.is_active
    });
    setEditingId(category.id);
  };

  const moveCategory = async (id: string, direction: 'up' | 'down') => {
    const index = categories.findIndex(c => c.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === categories.length - 1)
    ) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const otherCategory = categories[newIndex];
    const currentCategory = categories[index];

    // Swap order_index values
    await Promise.all([
      supabase.from('categories').update({ order_index: otherCategory.order_index }).eq('id', currentCategory.id),
      supabase.from('categories').update({ order_index: currentCategory.order_index }).eq('id', otherCategory.id)
    ]);

    fetchCategories();
  };

  const openImagePicker = (categoryId: string | null = null) => {
    setSelectedCategoryId(categoryId);
    setShowImagePicker(true);
  };

  const handleImageSelect = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
    setShowImagePicker(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">קטגוריות נגרות</h1>
          <p className="text-gray-600 text-sm mt-1">ניהול הקטגוריות בסקשן "But Not Only Kitchens"</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          <Plus className="w-5 h-5" />
          קטגוריה חדשה
        </button>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            אין קטגוריות עדיין
          </div>
        ) : (
          <div className="divide-y">
            {categories.map((category, index) => (
              <div key={category.id} className="p-4 hover:bg-gray-50">
                {editingId === category.id ? (
                  /* Edit Mode */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">שם הקטגוריה</label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full p-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">קישור (אופציונלי)</label>
                        <input
                          type="text"
                          value={formData.link_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                          className="w-full p-2 border rounded-lg"
                          placeholder="/projects?category=closets"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">תמונה</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formData.image_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                            className="flex-1 p-2 border rounded-lg"
                            placeholder="URL או בחר מהגלריה"
                          />
                          <button
                            onClick={() => openImagePicker(category.id)}
                            className="p-2 border rounded-lg hover:bg-gray-100"
                          >
                            <ImageIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">צבע רקע (כשאין תמונה)</label>
                        <select
                          value={formData.bg_color}
                          onChange={(e) => setFormData(prev => ({ ...prev, bg_color: e.target.value }))}
                          className="w-full p-2 border rounded-lg"
                        >
                          {bgColorOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="rounded"
                      />
                      <label className="text-sm text-gray-700">פעיל</label>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUpdate(category.id)}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        שמור
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="flex items-center gap-4">
                    {/* Drag Handle & Order */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveCategory(category.id, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveCategory(category.id, 'down')}
                        disabled={index === categories.length - 1}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Preview */}
                    <div 
                      className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${!category.image_url ? `bg-gradient-to-br ${category.bg_color}` : ''}`}
                    >
                      {category.image_url ? (
                        <img 
                          src={category.image_url} 
                          alt={category.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          אין תמונה
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{category.title}</h3>
                        {!category.is_active && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">מוסתר</span>
                        )}
                      </div>
                      {category.description && (
                        <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(category)}
                        className="p-2 hover:bg-gray-200 rounded-lg"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4">
            <h2 className="text-xl font-bold">קטגוריה חדשה</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שם הקטגוריה *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                placeholder="למשל: ארונות קיר"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תמונה</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  className="flex-1 p-2 border rounded-lg"
                  placeholder="URL או בחר מהגלריה"
                />
                <button
                  onClick={() => openImagePicker(null)}
                  className="p-2 border rounded-lg hover:bg-gray-100"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">צבע רקע</label>
              <div className="grid grid-cols-4 gap-2">
                {bgColorOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFormData(prev => ({ ...prev, bg_color: opt.value }))}
                    className={`p-3 rounded-lg ${opt.preview} border-2 ${formData.bg_color === opt.value ? 'border-black' : 'border-transparent'}`}
                  >
                    <span className="text-xs">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">קישור (אופציונלי)</label>
              <input
                type="text"
                value={formData.link_url}
                onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                placeholder="/projects?category=closets"
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({
                    title: '',
                    description: '',
                    image_url: '',
                    bg_color: 'from-gray-100 to-gray-200',
                    link_url: '',
                    is_active: true
                  });
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                ביטול
              </button>
              <button
                onClick={handleAdd}
                disabled={!formData.title}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                הוסף קטגוריה
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Picker Modal */}
      <ImagePicker
        isOpen={showImagePicker}
        onSelect={handleImageSelect}
        onClose={() => setShowImagePicker(false)}
      />
    </div>
  );
}
