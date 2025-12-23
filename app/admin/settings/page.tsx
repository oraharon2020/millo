"use client";

import { useState, useEffect } from "react";
import { Save, Bell, Palette, Globe, Lock, Database, Image as ImageIcon, Upload, Trash2, X, Copy, Check } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import ImagePicker from "@/components/admin/ImagePicker";

interface GalleryImage {
  name: string;
  url: string;
  folder: string;
  created_at?: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    siteName: "MILLO",
    siteDescription: "עיצוב מטבחים יוקרתיים",
    phone: "052-1234567",
    whatsapp: "052-1234567",
    email: "info@millo.co.il",
    address: "תל אביב, ישראל",
    facebook: "",
    instagram: "",
    about_text: "אנחנו MILLO - סטודיו לעיצוב מטבחים יוקרתיים. עם ניסיון של שנים רבות בתחום, אנו מתמחים ביצירת מטבחים ייחודיים שמשלבים עיצוב מודרני, פונקציונליות מקסימלית והתאמה אישית מלאה לצרכי הלקוח.",
    about_image: "",
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    notifications: {
      newContact: true,
      newProject: false,
    }
  });

  const tabs = [
    { id: "general", label: "כללי", icon: Globe },
    { id: "gallery", label: "גלריה", icon: ImageIcon },
    { id: "appearance", label: "עיצוב", icon: Palette },
    { id: "notifications", label: "התראות", icon: Bell },
    { id: "security", label: "אבטחה", icon: Lock },
    { id: "database", label: "מסד נתונים", icon: Database },
  ];

  const folders = ["gallery", "projects", "insights", "home"];

  // Fetch settings from Supabase
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .single();

        if (error) {
          console.error('Error fetching settings:', error);
          return;
        }

        if (data) {
          setSettingsId(data.id);
          setSettings({
            siteName: data.site_name || 'MILLO',
            siteDescription: data.site_description || 'עיצוב מטבחים יוקרתיים',
            phone: data.phone || '052-1234567',
            whatsapp: data.whatsapp || '052-1234567',
            email: data.email || 'info@millo.co.il',
            address: data.address || 'תל אביב, ישראל',
            facebook: data.facebook || '',
            instagram: data.instagram || '',
            about_text: data.about_text || '',
            about_image: data.about_image || '',
            primaryColor: "#000000",
            secondaryColor: "#ffffff",
            notifications: {
              newContact: true,
              newProject: false,
            }
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Fetch gallery images from Supabase Storage
  const fetchGalleryImages = async () => {
    setLoadingGallery(true);
    try {
      const allImages: GalleryImage[] = [];
      
      for (const folder of folders) {
        const { data, error } = await supabase.storage
          .from('images')
          .list(folder, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
        
        if (error) {
          console.error(`Error fetching ${folder}:`, error);
          continue;
        }
        
        if (data) {
          const images = data
            .filter(file => file.name !== '.emptyFolderPlaceholder' && !file.name.startsWith('.'))
            .map(file => {
              const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(`${folder}/${file.name}`);
              
              return {
                name: file.name,
                url: publicUrl,
                folder: folder,
                created_at: file.created_at
              };
            });
          
          allImages.push(...images);
        }
      }
      
      setGalleryImages(allImages);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoadingGallery(false);
    }
  };

  // Upload image to gallery folder
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const folderPath = selectedFolder === 'all' ? 'gallery' : selectedFolder;
      
      const { error } = await supabase.storage
        .from('images')
        .upload(`${folderPath}/${fileName}`, file);
      
      if (error) throw error;
      
      // Refresh gallery
      await fetchGalleryImages();
    } catch (error) {
      console.error('Error uploading:', error);
      alert('שגיאה בהעלאת התמונה');
    } finally {
      setUploadingImage(false);
    }
  };

  // Delete image
  const handleDeleteImage = async (image: GalleryImage) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק תמונה זו?')) return;
    
    try {
      const { error } = await supabase.storage
        .from('images')
        .remove([`${image.folder}/${image.name}`]);
      
      if (error) throw error;
      
      setGalleryImages(prev => prev.filter(img => img.url !== image.url));
    } catch (error) {
      console.error('Error deleting:', error);
      alert('שגיאה במחיקת התמונה');
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Load gallery when tab changes
  useEffect(() => {
    if (activeTab === 'gallery') {
      fetchGalleryImages();
    }
  }, [activeTab]);

  // Filter images by folder
  const filteredImages = selectedFolder === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.folder === selectedFolder);

  const handleSave = async () => {
    try {
      if (!settingsId) {
        alert('שגיאה: לא נמצא מזהה הגדרות');
        return;
      }

      const { error } = await supabase
        .from('settings')
        .update({
          site_name: settings.siteName,
          site_description: settings.siteDescription,
          phone: settings.phone,
          whatsapp: settings.whatsapp,
          email: settings.email,
          address: settings.address,
          facebook: settings.facebook,
          instagram: settings.instagram,
          about_text: settings.about_text,
          about_image: settings.about_image,
          updated_at: new Date().toISOString()
        })
        .eq('id', settingsId);

      if (error) throw error;
      alert('ההגדרות נשמרו בהצלחה!');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      alert('שגיאה בשמירת ההגדרות');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">הגדרות</h1>
          <p className="text-gray-500 text-sm mt-1">ניהול הגדרות המערכת</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Save size={18} />
          <span>שמור שינויים</span>
        </button>
      </div>

      <div className="flex gap-6">
        {/* Tabs */}
        <div className="w-64 shrink-0">
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {activeTab === "general" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">הגדרות כלליות</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">שם האתר</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">תיאור</label>
                  <input
                    type="text"
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              </div>

              <hr className="border-gray-100" />

              <h3 className="font-medium text-gray-900">פרטי יצירת קשר</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">טלפון</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">וואטסאפ</label>
                  <input
                    type="text"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="052-1234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">כתובת</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              </div>

              <hr className="border-gray-100" />

              <h3 className="font-medium text-gray-900">רשתות חברתיות</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                  <input
                    type="url"
                    value={settings.facebook}
                    onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                  <input
                    type="url"
                    value={settings.instagram}
                    onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>

              <hr className="border-gray-100" />

              <h3 className="font-medium text-gray-900">אודות</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">טקסט אודות</label>
                <textarea
                  value={settings.about_text}
                  onChange={(e) => setSettings({ ...settings, about_text: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                  rows={6}
                  placeholder="הכנס טקסט על החברה..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">תמונת אודות</label>
                <div className="flex items-center gap-4">
                  {settings.about_image ? (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden">
                      <Image
                        src={settings.about_image}
                        alt="תמונת אודות"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center">
                      <ImageIcon size={32} className="text-gray-400" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowImagePicker(true)}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    בחר תמונה
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">גלריית תמונות</h2>
                <div className="flex items-center gap-3">
                  {/* Folder Filter */}
                  <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    <option value="all">כל התיקיות</option>
                    {folders.map(folder => (
                      <option key={folder} value={folder}>{folder}</option>
                    ))}
                  </select>
                  
                  {/* Upload Button */}
                  <label className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                    <Upload size={18} />
                    <span>{uploadingImage ? 'מעלה...' : 'העלה תמונה'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadImage}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              <p className="text-sm text-gray-500">
                כאן תוכל לנהל את כל התמונות באתר. התמונות מאוחסנות ב-Supabase Storage.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-gray-900">{galleryImages.length}</p>
                  <p className="text-sm text-gray-500">סה"כ תמונות</p>
                </div>
                {folders.map(folder => (
                  <div key={folder} className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {galleryImages.filter(img => img.folder === folder).length}
                    </p>
                    <p className="text-sm text-gray-500">{folder}</p>
                  </div>
                ))}
              </div>

              {/* Images Grid */}
              {loadingGallery ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <ImageIcon className="mx-auto text-gray-300 mb-2" size={48} />
                  <p className="text-gray-500">אין תמונות בגלריה</p>
                  <p className="text-sm text-gray-400">העלה תמונה להתחלה</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {filteredImages.map((image, index) => (
                    <div key={index} className="group relative bg-gray-100 rounded-xl overflow-hidden aspect-square">
                      <Image
                        src={image.url}
                        alt={image.name}
                        fill
                        className="object-cover"
                      />
                      
                      {/* Overlay with actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => copyToClipboard(image.url)}
                          className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                          title="העתק קישור"
                        >
                          {copiedUrl === image.url ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                        </button>
                        <button
                          onClick={() => handleDeleteImage(image)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          title="מחק"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      {/* Folder badge */}
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-lg">
                        {image.folder}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">הגדרות עיצוב</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">צבע ראשי</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">צבע משני</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                      className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">הגדרות התראות</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">פנייה חדשה</p>
                    <p className="text-sm text-gray-500">קבל התראה כאשר נכנסת פנייה חדשה</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.newContact}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, newContact: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">פרויקט חדש נוסף</p>
                    <p className="text-sm text-gray-500">קבל התראה כאשר מוסיפים פרויקט חדש</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.newProject}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, newProject: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">הגדרות אבטחה</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">סיסמה נוכחית</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">סיסמה חדשה</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">אימות סיסמה</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "database" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">מסד נתונים</h2>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2 text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">מחובר ל-Supabase</span>
                </div>
                <p className="text-sm text-green-600 mt-1">מסד הנתונים פועל כראוי</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">טבלאות</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['projects', 'kitchen_insights', 'contacts', 'gallery'].map((table) => (
                    <div key={table} className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                      {table}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Picker Modal */}
      <ImagePicker
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={(url) => {
          setSettings({ ...settings, about_image: url });
          setShowImagePicker(false);
        }}
        title="בחר תמונת אודות"
      />
    </div>
  );
}
