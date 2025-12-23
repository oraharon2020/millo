"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, Search, MoreVertical } from "lucide-react";
import Link from "next/link";
import { supabase, Project } from "@/lib/supabase";
import Image from "next/image";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק פרויקט זה?')) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('שגיאה במחיקת הפרויקט');
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">פרויקטים</h1>
          <p className="text-gray-500 text-sm mt-1">ניהול כל הפרויקטים שלך</p>
        </div>
        <Link 
          href="/admin/projects/new"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} />
          <span>פרויקט חדש</span>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="חיפוש פרויקטים..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">טוען...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">לא נמצאו פרויקטים</p>
            <Link 
              href="/admin/projects/new"
              className="text-gray-900 font-medium hover:underline"
            >
              צור פרויקט ראשון
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">תמונה</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">שם הפרויקט</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">מיקום</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">קטגוריה</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">סטטוס</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden relative">
                      {project.thumbnail_url ? (
                        <Image 
                          src={project.thumbnail_url} 
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Eye size={20} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{project.title}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{project.location || '-'}</td>
                  <td className="px-6 py-4 text-gray-500">{project.category || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.is_featured
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {project.is_featured ? 'מוצג' : 'רגיל'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="עריכה"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="מחיקה"
                      >
                        <Trash2 size={16} />
                      </button>
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
