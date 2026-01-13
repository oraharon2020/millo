"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Image as ImageIcon, Eye } from "lucide-react";
import ImagePicker from "@/components/admin/ImagePicker";
import Link from "next/link";

interface AboutContent {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  main_title: string;
  main_text: string;
  main_image: string | null;
  show_stats: boolean;
  stat1_number: string;
  stat1_label: string;
  stat2_number: string;
  stat2_label: string;
  stat3_number: string;
  stat3_label: string;
  stat4_number: string;
  stat4_label: string;
  show_values: boolean;
  values_title: string;
  value1_title: string;
  value1_text: string;
  value2_title: string;
  value2_text: string;
  value3_title: string;
  value3_text: string;
}

const defaultContent: AboutContent = {
  id: '',
  hero_title: 'אודות MILLO',
  hero_subtitle: 'הסיפור שלנו',
  hero_description: 'סטודיו לעיצוב מטבחים יוקרתיים המתמחה ביצירת חללי מטבח ייחודיים ומותאמים אישית',
  main_title: 'מי אנחנו',
  main_text: 'אנחנו MILLO - סטודיו לעיצוב מטבחים יוקרתיים...',
  main_image: null,
  show_stats: true,
  stat1_number: '500+',
  stat1_label: 'פרויקטים',
  stat2_number: '15+',
  stat2_label: 'שנות ניסיון',
  stat3_number: '100%',
  stat3_label: 'שביעות רצון',
  stat4_number: '50+',
  stat4_label: 'עובדים מקצועיים',
  show_values: true,
  values_title: 'הערכים שלנו',
  value1_title: 'איכות ללא פשרות',
  value1_text: 'אנו משתמשים רק בחומרים מהאיכות הגבוהה ביותר',
  value2_title: 'עיצוב מותאם אישית',
  value2_text: 'כל מטבח מעוצב בהתאמה מושלמת לצרכי הלקוח',
  value3_title: 'שירות מקצועי',
  value3_text: 'ליווי צמוד מהתכנון ועד ההתקנה הסופית',
};

export default function AboutContentPage() {
  const [content, setContent] = useState<AboutContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'main' | 'stats' | 'values'>('hero');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setContent(data);
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('about_content')
        .upsert({
          ...content,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      alert('התוכן נשמר בהצלחה!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('שגיאה בשמירה');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof AboutContent, value: any) => {
    setContent(prev => ({ ...prev, [field]: value }));
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
          <h1 className="text-2xl font-bold text-gray-900">עריכת דף אודות</h1>
          <p className="text-gray-600 text-sm mt-1">עריכת התוכן של דף האודות</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/about"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Eye className="w-4 h-4" />
            צפה בדף
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'שומר...' : 'שמור שינויים'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {[
          { id: 'hero', label: 'באנר ראשי' },
          { id: 'main', label: 'תוכן מרכזי' },
          { id: 'stats', label: 'מספרים' },
          { id: 'values', label: 'ערכים' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 -mb-px border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-black text-black font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Hero Tab */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">כותרת הבאנר</label>
              <input
                type="text"
                value={content.hero_title}
                onChange={(e) => updateField('hero_title', e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">כותרת משנה</label>
              <input
                type="text"
                value={content.hero_subtitle}
                onChange={(e) => updateField('hero_subtitle', e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">תיאור קצר</label>
              <textarea
                value={content.hero_description}
                onChange={(e) => updateField('hero_description', e.target.value)}
                rows={3}
                className="w-full p-3 border rounded-lg resize-none"
              />
            </div>
          </div>
        )}

        {/* Main Tab */}
        {activeTab === 'main' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">כותרת הסקשן</label>
              <input
                type="text"
                value={content.main_title}
                onChange={(e) => updateField('main_title', e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">טקסט מפורט</label>
              <textarea
                value={content.main_text}
                onChange={(e) => updateField('main_text', e.target.value)}
                rows={10}
                className="w-full p-3 border rounded-lg resize-none"
                placeholder="הכנס כאן את הטקסט המלא על העסק..."
              />
              <p className="text-xs text-gray-500 mt-1">אפשר להשתמש בשורות חדשות לפסקאות</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">תמונה ראשית</label>
              <div className="flex gap-4 items-start">
                {content.main_image ? (
                  <div className="relative w-48 h-32 rounded-lg overflow-hidden">
                    <img src={content.main_image} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => updateField('main_image', null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    אין תמונה
                  </div>
                )}
                <button
                  onClick={() => setShowImagePicker(true)}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <ImageIcon className="w-4 h-4" />
                  בחר תמונה
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={content.show_stats}
                onChange={(e) => updateField('show_stats', e.target.checked)}
                className="rounded"
              />
              <label className="font-medium">הצג סקשן מספרים</label>
            </div>

            {content.show_stats && (
              <div className="grid grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(num => (
                  <div key={num} className="p-4 border rounded-lg space-y-3">
                    <h4 className="font-medium text-gray-700">נתון #{num}</h4>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">מספר</label>
                      <input
                        type="text"
                        value={(content as any)[`stat${num}_number`]}
                        onChange={(e) => updateField(`stat${num}_number` as keyof AboutContent, e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="500+"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">תווית</label>
                      <input
                        type="text"
                        value={(content as any)[`stat${num}_label`]}
                        onChange={(e) => updateField(`stat${num}_label` as keyof AboutContent, e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="פרויקטים"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Values Tab */}
        {activeTab === 'values' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={content.show_values}
                onChange={(e) => updateField('show_values', e.target.checked)}
                className="rounded"
              />
              <label className="font-medium">הצג סקשן ערכים</label>
            </div>

            {content.show_values && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">כותרת הסקשן</label>
                  <input
                    type="text"
                    value={content.values_title}
                    onChange={(e) => updateField('values_title', e.target.value)}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map(num => (
                    <div key={num} className="p-4 border rounded-lg space-y-3">
                      <h4 className="font-medium text-gray-700">ערך #{num}</h4>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">כותרת</label>
                        <input
                          type="text"
                          value={(content as any)[`value${num}_title`]}
                          onChange={(e) => updateField(`value${num}_title` as keyof AboutContent, e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">תיאור</label>
                        <textarea
                          value={(content as any)[`value${num}_text`]}
                          onChange={(e) => updateField(`value${num}_text` as keyof AboutContent, e.target.value)}
                          className="w-full p-2 border rounded resize-none"
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Image Picker */}
      <ImagePicker
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={(url) => {
          updateField('main_image', url);
          setShowImagePicker(false);
        }}
      />
    </div>
  );
}
