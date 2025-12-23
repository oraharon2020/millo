"use client";

import { useEffect, useState } from "react";
import { Upload, Trash2, Search, Grid3X3, List, Download, Copy, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface GalleryImage {
  name: string;
  url: string;
  folder: string;
  created_at: string;
}

const folders = ["gallery", "projects", "insights", "home"];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const allImages: GalleryImage[] = [];
      
      for (const folder of folders) {
        const { data, error } = await supabase.storage
          .from('images')
          .list(folder, {
            limit: 100,
            sortBy: { column: 'created_at', order: 'desc' }
          });
        
        if (error) {
          console.error(`Error fetching ${folder}:`, error);
          continue;
        }
        
        if (data) {
          const folderImages = data
            .filter(file => file.name !== '.emptyFolderPlaceholder' && !file.name.startsWith('.'))
            .map(file => ({
              name: file.name,
              url: supabase.storage.from('images').getPublicUrl(`${folder}/${file.name}`).data.publicUrl,
              folder: folder,
              created_at: file.created_at || ''
            }));
          
          allImages.push(...folderImages);
        }
      }
      
      setImages(allImages);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadFolder = selectedFolder === 'all' ? 'gallery' : selectedFolder;
      
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${uploadFolder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;
      }
      
      await fetchImages();
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('שגיאה בהעלאת התמונות');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק תמונה זו?')) return;

    try {
      const { error } = await supabase.storage
        .from('images')
        .remove([`${image.folder}/${image.name}`]);
      
      if (error) throw error;
      setImages(images.filter(img => img.url !== image.url));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('שגיאה במחיקת התמונה');
    }
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredImages = images
    .filter(img => selectedFolder === 'all' || img.folder === selectedFolder)
    .filter(img => img.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">גלריה</h1>
          <p className="text-gray-500 text-sm mt-1">ניהול תמונות האתר</p>
        </div>
        <label className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
          <Upload size={18} />
          <span>{uploading ? 'מעלה...' : 'העלה תמונות'}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Search & View Toggle */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="חיפוש תמונות..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
          
          {/* Folder Filter */}
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <option value="all">כל התיקיות ({images.length})</option>
            {folders.map(folder => (
              <option key={folder} value={folder}>
                {folder} ({images.filter(img => img.folder === folder).length})
              </option>
            ))}
          </select>
          
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <Grid3X3 size={18} className={viewMode === 'grid' ? 'text-gray-900' : 'text-gray-400'} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <List size={18} className={viewMode === 'list' ? 'text-gray-900' : 'text-gray-400'} />
            </button>
          </div>
        </div>
      </div>

      {/* Images */}
      {loading ? (
        <div className="p-8 text-center text-gray-500">טוען...</div>
      ) : filteredImages.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <Upload className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 mb-2">אין תמונות בגלריה</p>
          <label className="text-gray-900 font-medium hover:underline cursor-pointer">
            העלה תמונה ראשונה
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredImages.map((image) => (
            <div 
              key={image.url}
              className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100"
            >
              <Image
                src={image.url}
                alt={image.name}
                fill
                className="object-cover"
              />
              {/* Folder Badge */}
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-lg">
                {image.folder}
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyUrl(image.url)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    title="העתק קישור"
                  >
                    {copiedUrl === image.url ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                  <button
                    onClick={() => handleDelete(image)}
                    className="p-2 bg-white rounded-full hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
                    title="מחק"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">תמונה</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">שם קובץ</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">תיקייה</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredImages.map((image) => (
                <tr key={image.url} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden relative">
                      <Image
                        src={image.url}
                        alt={image.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900 text-sm">{image.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">{image.folder}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyUrl(image.url)}
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="העתק קישור"
                      >
                        {copiedUrl === image.url ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                      </button>
                      <button
                        onClick={() => handleDelete(image)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="מחק"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
