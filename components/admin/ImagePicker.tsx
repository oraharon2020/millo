"use client";

import { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon, Link2, Search, Check, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface ImagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

interface GalleryImage {
  name: string;
  url: string;
  path: string;
}

type TabType = 'gallery' | 'upload' | 'url';

export default function ImagePicker({ isOpen, onClose, onSelect, title = "בחר תמונה" }: ImagePickerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('gallery');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchAllImages();
    }
  }, [isOpen]);

  const fetchAllImages = async () => {
    setLoading(true);
    try {
      // Fetch from multiple folders
      const folders = ['gallery', 'projects', 'insights', 'home'];
      const allImages: GalleryImage[] = [];

      for (const folder of folders) {
        const { data } = await supabase.storage
          .from('images')
          .list(folder, { sortBy: { column: 'created_at', order: 'desc' } });

        if (data) {
          const folderImages = data
            .filter(file => file.name !== '.emptyFolderPlaceholder')
            .map(file => ({
              name: file.name,
              path: `${folder}/${file.name}`,
              url: supabase.storage.from('images').getPublicUrl(`${folder}/${file.name}`).data.publicUrl
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
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Add to gallery and select it
      setImages(prev => [{
        name: fileName,
        path: filePath,
        url: publicUrl
      }, ...prev]);
      
      setSelectedImage(publicUrl);
      setActiveTab('gallery');
    } catch (error) {
      console.error('Error uploading:', error);
      alert('שגיאה בהעלאת התמונה');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setSelectedImage(urlInput.trim());
    }
  };

  const handleConfirm = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onClose();
      setSelectedImage(null);
      setUrlInput("");
    }
  };

  const filteredImages = images.filter(img =>
    img.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-2 bg-gray-50 border-b border-gray-100">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === 'gallery'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ImageIcon size={16} />
            גלריה
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === 'upload'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Upload size={16} />
            העלאה מהמחשב
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === 'url'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Link2 size={16} />
            קישור URL
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="חיפוש תמונות..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              {/* Images Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ImageIcon className="mx-auto mb-2 text-gray-300" size={48} />
                  <p>אין תמונות בגלריה</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="mt-2 text-gray-900 font-medium hover:underline"
                  >
                    העלה תמונה ראשונה
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {filteredImages.map((image) => (
                    <button
                      key={image.path}
                      onClick={() => setSelectedImage(image.url)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === image.url
                          ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.name}
                        fill
                        className="object-cover"
                      />
                      {selectedImage === image.url && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <Check className="text-gray-900" size={18} />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 transition-colors bg-gray-50">
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin text-gray-400 mb-2" size={32} />
                    <span className="text-gray-500">מעלה...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="text-gray-400 mb-2" size={40} />
                    <span className="text-gray-600 font-medium">לחץ לבחירת תמונה</span>
                    <span className="text-gray-400 text-sm mt-1">או גרור לכאן</span>
                    <span className="text-gray-400 text-xs mt-2">PNG, JPG, WEBP עד 10MB</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              {/* Preview uploaded */}
              {selectedImage && activeTab === 'upload' && (
                <div className="relative h-48 rounded-xl overflow-hidden bg-gray-100">
                  <Image src={selectedImage} alt="Preview" fill className="object-contain" />
                </div>
              )}
            </div>
          )}

          {/* URL Tab */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">הדבק קישור לתמונה</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    dir="ltr"
                  />
                  <button
                    onClick={handleUrlSubmit}
                    disabled={!urlInput.trim()}
                    className="px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    טען
                  </button>
                </div>
              </div>

              {/* Preview URL */}
              {selectedImage && activeTab === 'url' && (
                <div className="relative h-48 rounded-xl overflow-hidden bg-gray-100">
                  <Image 
                    src={selectedImage} 
                    alt="Preview" 
                    fill 
                    className="object-contain"
                    onError={() => {
                      alert('לא ניתן לטעון את התמונה');
                      setSelectedImage(null);
                    }}
                  />
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">
                  <strong>טיפ:</strong> וודא שהקישור מצביע ישירות לקובץ תמונה (נגמר ב-.jpg, .png, .webp וכו')
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50">
          <div className="text-sm text-gray-500">
            {selectedImage ? 'תמונה נבחרה' : 'בחר תמונה'}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ביטול
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedImage}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              אישור
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
