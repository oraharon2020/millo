"use client";

import { useEffect, useState } from "react";
import { Upload, Trash2, Search, Grid3X3, List, Download, Copy, Check, X, Edit3, Save, Tag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface GalleryImage {
  name: string;
  url: string;
  folder: string;
  created_at: string;
}

interface ImageSeoData {
  alt_text: string;
  title: string;
  description: string;
  tags: string[];
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
  
  // SEO Edit Modal State
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [seoData, setSeoData] = useState<ImageSeoData>({
    alt_text: '',
    title: '',
    description: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [savingSeo, setSavingSeo] = useState(false);
  const [seoCache, setSeoCache] = useState<Record<string, ImageSeoData>>({});

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
      
      // Fetch SEO data for all images
      await fetchAllSeoData(allImages);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSeoData = async (imagesList: GalleryImage[]) => {
    try {
      const urls = imagesList.map(img => img.url);
      const { data, error } = await supabase
        .from('gallery_images')
        .select('url, alt_text, title, description, tags')
        .in('url', urls);
      
      if (error) {
        console.error('Error fetching SEO data:', error);
        return;
      }
      
      if (data) {
        const cache: Record<string, ImageSeoData> = {};
        data.forEach(item => {
          cache[item.url] = {
            alt_text: item.alt_text || '',
            title: item.title || '',
            description: item.description || '',
            tags: item.tags || []
          };
        });
        setSeoCache(cache);
      }
    } catch (error) {
      console.error('Error fetching SEO data:', error);
    }
  };

  const openSeoEditor = (image: GalleryImage) => {
    setEditingImage(image);
    const cached = seoCache[image.url];
    if (cached) {
      setSeoData(cached);
    } else {
      setSeoData({
        alt_text: image.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        title: '',
        description: '',
        tags: []
      });
    }
    setTagInput('');
  };

  const addTag = () => {
    if (tagInput.trim() && !seoData.tags.includes(tagInput.trim())) {
      setSeoData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSeoData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const saveSeoData = async () => {
    if (!editingImage) return;
    
    setSavingSeo(true);
    try {
      const storagePath = `${editingImage.folder}/${editingImage.name}`;
      
      // Upsert the SEO data
      const { error } = await supabase
        .from('gallery_images')
        .upsert({
          url: editingImage.url,
          storage_path: storagePath,
          folder: editingImage.folder,
          file_name: editingImage.name,
          alt_text: seoData.alt_text,
          title: seoData.title,
          description: seoData.description,
          tags: seoData.tags
        }, {
          onConflict: 'url'
        });
      
      if (error) throw error;
      
      // Update cache
      setSeoCache(prev => ({
        ...prev,
        [editingImage.url]: seoData
      }));
      
      setEditingImage(null);
    } catch (error) {
      console.error('Error saving SEO data:', error);
      alert('שגיאה בשמירת נתוני SEO');
    } finally {
      setSavingSeo(false);
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
              {/* SEO Badge */}
              {seoCache[image.url] && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-green-500/90 text-white text-xs rounded-lg flex items-center gap-1">
                  <Check size={10} />
                  SEO
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openSeoEditor(image)}
                    className="p-2 bg-white rounded-full hover:bg-blue-50 transition-colors"
                    title="ערוך SEO"
                  >
                    <Edit3 size={16} className="text-blue-600" />
                  </button>
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
                        alt={seoCache[image.url]?.alt_text || image.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900 text-sm">{image.name}</p>
                    {seoCache[image.url] && (
                      <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                        <Check size={10} />
                        SEO מוגדר
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">{image.folder}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openSeoEditor(image)}
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="ערוך SEO"
                      >
                        <Edit3 size={16} />
                      </button>
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

      {/* SEO Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">עריכת SEO לתמונה</h2>
              <button
                onClick={() => setEditingImage(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Image Preview */}
              <div className="flex gap-6">
                <div className="w-48 h-32 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                  <Image
                    src={editingImage.url}
                    alt={seoData.alt_text || editingImage.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-gray-500">שם קובץ</p>
                  <p className="font-medium text-gray-900">{editingImage.name}</p>
                  <p className="text-sm text-gray-500 mt-2">תיקייה</p>
                  <p className="font-medium text-gray-900">{editingImage.folder}</p>
                </div>
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  טקסט חלופי (Alt Text) *
                  <span className="text-gray-400 font-normal mr-2">חשוב לנגישות ול-SEO</span>
                </label>
                <input
                  type="text"
                  value={seoData.alt_text}
                  onChange={(e) => setSeoData(prev => ({ ...prev, alt_text: e.target.value }))}
                  placeholder="תאר את התמונה בקצרה..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                <p className="text-xs text-gray-400 mt-1">מומלץ 125 תווים לכל היותר</p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  כותרת (Title)
                  <span className="text-gray-400 font-normal mr-2">מוצג בהעברה מעל התמונה</span>
                </label>
                <input
                  type="text"
                  value={seoData.title}
                  onChange={(e) => setSeoData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="כותרת התמונה..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תיאור מורחב
                  <span className="text-gray-400 font-normal mr-2">לשימוש פנימי ולמנועי חיפוש</span>
                </label>
                <textarea
                  value={seoData.description}
                  onChange={(e) => setSeoData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="תיאור מפורט של התמונה..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תגיות
                  <span className="text-gray-400 font-normal mr-2">לסינון וארגון</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="הוסף תגית..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <Tag size={18} />
                  </button>
                </div>
                {seoData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {seoData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setEditingImage(null)}
                className="px-6 py-2.5 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors"
              >
                ביטול
              </button>
              <button
                onClick={saveSeoData}
                disabled={savingSeo || !seoData.alt_text.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {savingSeo ? 'שומר...' : 'שמור'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
