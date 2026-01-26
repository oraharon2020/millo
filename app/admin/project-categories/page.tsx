"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, Save, X } from "lucide-react";
import { supabase, ProjectCategory } from "@/lib/supabase";

export default function ProjectCategoriesPage() {
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", name_en: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", name_en: "", slug: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('project_categories')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newCategory.name) {
      alert('נא להזין שם קטגוריה');
      return;
    }

    const slug = newCategory.slug || newCategory.name.toLowerCase().replace(/\s+/g, '-');
    
    try {
      const { error } = await supabase
        .from('project_categories')
        .insert([{
          name: newCategory.name,
          name_en: newCategory.name_en,
          slug,
          order_index: categories.length + 1,
          is_active: true
        }]);
      
      if (error) throw error;
      
      setNewCategory({ name: "", name_en: "", slug: "" });
      setShowAddForm(false);
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      alert('שגיאה בהוספת הקטגוריה');
    }
  };

  const handleEdit = (category: ProjectCategory) => {
    setEditingId(category.id);
    setEditForm({ name: category.name, name_en: category.name_en || "" });
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editForm.name) return;

    try {
      const { error } = await supabase
        .from('project_categories')
        .update({ 
          name: editForm.name, 
          name_en: editForm.name_en 
        })
        .eq('id', editingId);
      
      if (error) throw error;
      
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      alert('שגיאה בעדכון הקטגוריה');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק קטגוריה זו?')) return;
    
    try {
      const { error } = await supabase
        .from('project_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('שגיאה במחיקת הקטגוריה');
    }
  };

  const toggleActive = async (category: ProjectCategory) => {
    try {
      const { error } = await supabase
        .from('project_categories')
        .update({ is_active: !category.is_active })
        .eq('id', category.id);
      
      if (error) throw error;
      fetchCategories();
    } catch (error) {
      console.error('Error toggling category:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">קטגוריות פרויקטים</h1>
          <p className="text-gray-500 text-sm mt-1">ניהול קטגוריות לסינון פרויקטים</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} />
          <span>קטגוריה חדשה</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4">הוספת קטגוריה חדשה</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="שם בעברית *"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            <input
              type="text"
              placeholder="שם באנגלית"
              value={newCategory.name_en}
              onChange={(e) => setNewCategory({ ...newCategory, name_en: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            <input
              type="text"
              placeholder="slug (אופציונלי)"
              value={newCategory.slug}
              onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              dir="ltr"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              <Save size={16} />
              שמור
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewCategory({ name: "", name_en: "", slug: "" });
              }}
              className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg"
            >
              <X size={16} />
              ביטול
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">טוען...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">אין קטגוריות</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">שם</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">שם באנגלית</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">סטטוס</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {editingId === category.id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="px-3 py-1 border border-gray-200 rounded-lg w-full"
                      />
                    ) : (
                      <span className="font-medium">{category.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === category.id ? (
                      <input
                        type="text"
                        value={editForm.name_en}
                        onChange={(e) => setEditForm({ ...editForm, name_en: e.target.value })}
                        className="px-3 py-1 border border-gray-200 rounded-lg w-full"
                        dir="ltr"
                      />
                    ) : (
                      <span className="text-gray-500" dir="ltr">{category.name_en}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(category)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        category.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {category.is_active ? "פעיל" : "לא פעיל"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {editingId === category.id ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            className="p-2 hover:bg-green-100 rounded-lg text-green-600"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="p-2 hover:bg-red-100 rounded-lg text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
