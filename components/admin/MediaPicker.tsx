"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, Image as ImageIcon, Link2, Search, Check, Loader2, Video, Play } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
  mediaType?: 'image' | 'video' | 'all';
}

interface MediaFile {
  name: string;
  url: string;
  path: string;
  type: 'image' | 'video';
}

type TabType = 'gallery' | 'upload' | 'url';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'avi', 'mkv'];

function getFileType(filename: string): 'image' | 'video' | null {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (IMAGE_EXTENSIONS.includes(ext)) return 'image';
  if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
  return null;
}

export default function MediaPicker({ 
  isOpen, 
  onClose, 
  onSelect, 
  title = "בחר קובץ מדיה",
  mediaType = 'all'
}: MediaPickerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('gallery');
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'image' | 'video' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchAllMedia();
    }
  }, [isOpen]);

  const fetchAllMedia = async () => {
    setLoading(true);
    try {
      const allMedia: MediaFile[] = [];

      // Fetch images
      if (mediaType === 'all' || mediaType === 'image') {
        const imageFolders = ['gallery', 'projects', 'insights', 'home'];
        for (const folder of imageFolders) {
          const { data } = await supabase.storage
            .from('images')
            .list(folder, { sortBy: { column: 'created_at', order: 'desc' } });

          if (data) {
            const folderFiles = data
              .filter(file => file.name !== '.emptyFolderPlaceholder')
              .map(file => ({
                name: file.name,
                path: `images/${folder}/${file.name}`,
                url: supabase.storage.from('images').getPublicUrl(`${folder}/${file.name}`).data.publicUrl,
                type: 'image' as const
              }));
            allMedia.push(...folderFiles);
          }
        }
      }

      // Fetch videos
      if (mediaType === 'all' || mediaType === 'video') {
        const { data: videoData } = await supabase.storage
          .from('videos')
          .list('', { sortBy: { column: 'created_at', order: 'desc' } });

        if (videoData) {
          const videoFiles = videoData
            .filter(file => file.name !== '.emptyFolderPlaceholder' && getFileType(file.name) === 'video')
            .map(file => ({
              name: file.name,
              path: `videos/${file.name}`,
              url: supabase.storage.from('videos').getPublicUrl(file.name).data.publicUrl,
              type: 'video' as const
            }));
          allMedia.push(...videoFiles);
        }
      }

      setMedia(allMedia);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = getFileType(file.name);
    if (!fileType) {
      alert('סוג קובץ לא נתמך');
      return;
    }

    // Check file size (50MB max for videos, 10MB for images)
    const maxSize = fileType === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`הקובץ גדול מדי. מקסימום ${fileType === 'video' ? '50MB' : '10MB'}`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      // Choose bucket based on file type
      const bucket = fileType === 'video' ? 'videos' : 'images';
      const filePath = fileType === 'video' ? fileName : `gallery/${fileName}`;

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      clearInterval(progressInterval);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      setUploadProgress(100);

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      // Add to gallery and select it
      setMedia(prev => [{
        name: fileName,
        path: `${bucket}/${filePath}`,
        url: publicUrl,
        type: fileType
      }, ...prev]);
      
      setSelectedMedia(publicUrl);
      setSelectedType(fileType);
      setActiveTab('gallery');
    } catch (error) {
      console.error('Error uploading:', error);
      alert('שגיאה בהעלאת הקובץ. וודא שה-bucket קיים ב-Supabase Storage.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      const type = getFileType(urlInput) || 'video';
      setSelectedMedia(urlInput.trim());
      setSelectedType(type);
    }
  };

  const handleConfirm = () => {
    if (selectedMedia) {
      onSelect(selectedMedia);
      onClose();
      setSelectedMedia(null);
      setSelectedType(null);
      setUrlInput("");
    }
  };

  const filteredMedia = media.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (mediaType === 'all' || item.type === mediaType)
  );

  // Get accept types based on mediaType prop
  const getAcceptTypes = () => {
    if (mediaType === 'video') return 'video/*';
    if (mediaType === 'image') return 'image/*';
    return 'image/*,video/*';
  };

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
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {mediaType === 'video' && (
              <p className="text-sm text-gray-500">MP4, WebM עד 50MB</p>
            )}
          </div>
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
            {mediaType === 'video' ? <Video size={16} /> : <ImageIcon size={16} />}
            {mediaType === 'video' ? 'סרטונים' : 'גלריה'}
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
                  placeholder={mediaType === 'video' ? 'חיפוש סרטונים...' : 'חיפוש...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              {/* Media Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {mediaType === 'video' ? (
                    <Video className="mx-auto mb-2 text-gray-300" size={48} />
                  ) : (
                    <ImageIcon className="mx-auto mb-2 text-gray-300" size={48} />
                  )}
                  <p>{mediaType === 'video' ? 'אין סרטונים' : 'אין קבצים'}</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="mt-2 text-gray-900 font-medium hover:underline"
                  >
                    העלה קובץ ראשון
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredMedia.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        setSelectedMedia(item.url);
                        setSelectedType(item.type);
                      }}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all bg-gray-100 ${
                        selectedMedia === item.url
                          ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      {item.type === 'video' ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                          <div className="w-12 h-12 bg-black/70 rounded-full flex items-center justify-center">
                            <Play className="text-white ml-1" size={24} fill="white" />
                          </div>
                          <span className="absolute bottom-1 left-1 text-[10px] bg-black/70 text-white px-1 rounded">
                            {item.name.split('.').pop()?.toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <Image
                          src={item.url}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                      {selectedMedia === item.url && (
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
                    <span className="text-gray-500">מעלה... {uploadProgress}%</span>
                    <div className="w-48 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-gray-900 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="text-gray-400 mb-2" size={40} />
                    <span className="text-gray-600 font-medium">
                      {mediaType === 'video' ? 'לחץ לבחירת סרטון' : 'לחץ לבחירת קובץ'}
                    </span>
                    <span className="text-gray-400 text-sm mt-1">או גרור לכאן</span>
                    <span className="text-gray-400 text-xs mt-2">
                      {mediaType === 'video' 
                        ? 'MP4, WebM, MOV עד 50MB'
                        : mediaType === 'image'
                        ? 'PNG, JPG, WEBP עד 10MB'
                        : 'תמונות עד 10MB, סרטונים עד 50MB'
                      }
                    </span>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={getAcceptTypes()}
                  onChange={handleUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              {/* Preview uploaded */}
              {selectedMedia && activeTab === 'upload' && (
                <div className="relative h-48 rounded-xl overflow-hidden bg-gray-100">
                  {selectedType === 'video' ? (
                    <video 
                      src={selectedMedia} 
                      className="w-full h-full object-contain"
                      controls
                    />
                  ) : (
                    <Image src={selectedMedia} alt="Preview" fill className="object-contain" />
                  )}
                </div>
              )}
            </div>
          )}

          {/* URL Tab */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {mediaType === 'video' ? 'הדבק קישור לסרטון' : 'הדבק קישור'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder={mediaType === 'video' 
                      ? 'https://example.com/video.mp4'
                      : 'https://example.com/file'
                    }
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
              {selectedMedia && activeTab === 'url' && (
                <div className="relative h-48 rounded-xl overflow-hidden bg-gray-100">
                  {selectedType === 'video' ? (
                    <video 
                      src={selectedMedia} 
                      className="w-full h-full object-contain"
                      controls
                    />
                  ) : (
                    <Image 
                      src={selectedMedia} 
                      alt="Preview" 
                      fill 
                      className="object-contain"
                      onError={() => {
                        alert('לא ניתן לטעון את הקובץ');
                        setSelectedMedia(null);
                      }}
                    />
                  )}
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">
                  <strong>טיפ:</strong> וודא שהקישור מצביע ישירות לקובץ
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50">
          <div className="text-sm text-gray-500">
            {selectedMedia ? (selectedType === 'video' ? 'סרטון נבחר' : 'קובץ נבחר') : 'בחר קובץ'}
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
              disabled={!selectedMedia}
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
