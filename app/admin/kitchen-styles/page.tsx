"use client";

import { useState, useEffect } from "react";
import { supabase, KitchenStyle } from "@/lib/supabase";
import ImagePicker from "@/components/admin/ImagePicker";
import ImagePositionPicker from "@/components/admin/ImagePositionPicker";
import { Save, Plus, Trash2, GripVertical, ChevronUp, ChevronDown, Image as ImageIcon } from "lucide-react";

// Default kitchen styles
const defaultStyles: Partial<KitchenStyle>[] = [
  // Row 1 - KitchenStyles component
  { name_en: 'MODERN', name_he: 'מטבח מודרני', row_group: 1, text_position: 'bottom', order_index: 0, is_active: true },
  { name_en: 'URBAN', name_he: 'מטבח אורבני', row_group: 1, text_position: 'top', order_index: 1, is_active: true },
  { name_en: 'RUSTIC', name_he: 'מטבח כפרי', row_group: 1, text_position: 'bottom', order_index: 2, is_active: true },
  // Row 2 - KitchenShowcase component
  { name_en: 'CLASSIC', name_he: 'מטבח קלאסי', row_group: 2, text_position: 'top', order_index: 0, is_active: true },
  { name_en: 'LUXURY', name_he: 'מטבח יוקרתי', row_group: 2, text_position: 'bottom', order_index: 1, is_active: true },
  { name_en: 'BOHO', name_he: 'מטבח בוהו', row_group: 2, text_position: 'top', order_index: 2, is_active: true },
];

export default function KitchenStylesAdmin() {
  const [styles, setStyles] = useState<Partial<KitchenStyle>[]>(defaultStyles);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expandedStyle, setExpandedStyle] = useState<number | null>(null);
  const [showImagePicker, setShowImagePicker] = useState<number | null>(null);

  useEffect(() => {
    fetchStyles();
  }, []);

  const fetchStyles = async () => {
    const { data, error } = await supabase
      .from('kitchen_styles')
      .select('*')
      .order('row_group')
      .order('order_index');
    
    if (data && data.length > 0) {
      setStyles(data);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // For each style, upsert to database
      for (const style of styles) {
        if (style.id) {
          // Update existing
          const { error } = await supabase
            .from('kitchen_styles')
            .update({
              name_en: style.name_en,
              name_he: style.name_he,
              image_url: style.image_url,
              image_position: style.image_position,
              row_group: style.row_group,
              text_position: style.text_position,
              order_index: style.order_index,
              is_active: style.is_active,
              link_url: style.link_url,
              updated_at: new Date().toISOString(),
            })
            .eq('id', style.id);
          
          if (error) throw error;
        } else {
          // Insert new
          const { error } = await supabase
            .from('kitchen_styles')
            .insert({
              name_en: style.name_en,
              name_he: style.name_he,
              image_url: style.image_url,
              image_position: style.image_position || 'center center',
              row_group: style.row_group,
              text_position: style.text_position,
              order_index: style.order_index,
              is_active: style.is_active ?? true,
              link_url: style.link_url,
            });
          
          if (error) throw error;
        }
      }

      setMessage({ type: 'success', text: 'השינויים נשמרו בהצלחה!' });
      fetchStyles(); // Refresh to get IDs
    } catch (error: any) {
      console.error('Error saving:', error);
      setMessage({ type: 'error', text: error.message || 'שגיאה בשמירה' });
    } finally {
      setSaving(false);
    }
  };

  const updateStyle = (index: number, field: keyof KitchenStyle, value: any) => {
    const newStyles = [...styles];
    newStyles[index] = { ...newStyles[index], [field]: value };
    setStyles(newStyles);
  };

  const addStyle = (rowGroup: 1 | 2) => {
    const rowStyles = styles.filter(s => s.row_group === rowGroup);
    const newStyle: Partial<KitchenStyle> = {
      name_en: 'NEW STYLE',
      name_he: 'סגנון חדש',
      row_group: rowGroup,
      text_position: 'bottom',
      order_index: rowStyles.length,
      is_active: true,
      image_position: 'center center',
    };
    setStyles([...styles, newStyle]);
  };

  const deleteStyle = async (index: number) => {
    const style = styles[index];
    if (style.id) {
      const { error } = await supabase
        .from('kitchen_styles')
        .delete()
        .eq('id', style.id);
      
      if (error) {
        setMessage({ type: 'error', text: 'שגיאה במחיקה' });
        return;
      }
    }
    const newStyles = styles.filter((_, i) => i !== index);
    setStyles(newStyles);
  };

  const row1Styles = styles.filter(s => s.row_group === 1);
  const row2Styles = styles.filter(s => s.row_group === 2);

  const StyleCard = ({ style, globalIndex }: { style: Partial<KitchenStyle>; globalIndex: number }) => {
    const isExpanded = expandedStyle === globalIndex;

    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Header - always visible */}
        <div 
          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50"
          onClick={() => setExpandedStyle(isExpanded ? null : globalIndex)}
        >
          <GripVertical size={16} className="text-gray-300" />
          
          {/* Thumbnail */}
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {style.image_url ? (
              <img 
                src={style.image_url} 
                alt={style.name_en} 
                className="w-full h-full object-cover"
                style={{ objectPosition: style.image_position || 'center' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon size={16} className="text-gray-300" />
              </div>
            )}
          </div>

          {/* Name */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{style.name_en}</p>
            <p className="text-xs text-gray-500">{style.name_he}</p>
          </div>

          {/* Status & Arrow */}
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${style.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50/50">
            {/* Names */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">שם באנגלית</label>
                <input
                  type="text"
                  value={style.name_en || ''}
                  onChange={(e) => updateStyle(globalIndex, 'name_en', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">שם בעברית</label>
                <input
                  type="text"
                  value={style.name_he || ''}
                  onChange={(e) => updateStyle(globalIndex, 'name_he', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">תמונה</label>
              <div 
                className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 cursor-pointer group"
                onClick={() => setShowImagePicker(globalIndex)}
              >
                {style.image_url ? (
                  <>
                    <img 
                      src={style.image_url} 
                      alt={style.name_en}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: style.image_position || 'center' }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm">החלף תמונה</span>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon size={24} />
                    <span className="text-xs mt-1">בחר תמונה</span>
                  </div>
                )}
              </div>
            </div>

            {/* Image Position - only if has image */}
            {style.image_url && (
              <div>
                <label className="text-xs text-gray-500 mb-1 block">מיקוד תמונה</label>
                <ImagePositionPicker
                  imageUrl={style.image_url}
                  position={style.image_position || 'center center'}
                  onChange={(pos) => updateStyle(globalIndex, 'image_position', pos)}
                  aspectRatio="16/9"
                />
              </div>
            )}

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">מיקום טקסט</label>
                <select
                  value={style.text_position || 'bottom'}
                  onChange={(e) => updateStyle(globalIndex, 'text_position', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
                >
                  <option value="top">מעל התמונה</option>
                  <option value="bottom">מתחת לתמונה</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">סטטוס</label>
                <select
                  value={style.is_active ? 'active' : 'inactive'}
                  onChange={(e) => updateStyle(globalIndex, 'is_active', e.target.value === 'active')}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
                >
                  <option value="active">פעיל</option>
                  <option value="inactive">לא פעיל</option>
                </select>
              </div>
            </div>

            {/* Link */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">קישור (אופציונלי)</label>
              <input
                type="text"
                value={style.link_url || ''}
                onChange={(e) => updateStyle(globalIndex, 'link_url', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                placeholder="/projects?style=modern"
                dir="ltr"
              />
            </div>

            {/* Delete button */}
            <button
              onClick={() => deleteStyle(globalIndex)}
              className="flex items-center gap-2 text-red-500 text-sm hover:text-red-600"
            >
              <Trash2 size={14} />
              מחק סגנון
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">סוגי מטבחים</h1>
          <p className="text-sm text-gray-500 mt-1">ניהול כל סגנונות המטבחים בדף הבית</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'שומר...' : 'שמור שינויים'}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Row 1 - KitchenStyles */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">🏠 שורה ראשונה</h2>
          <button
            onClick={() => addStyle(1)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <Plus size={14} />
            הוסף סגנון
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-3">מופיע לפני אזור "מעוצב בשבילך"</p>
        <div className="space-y-2">
          {row1Styles.map((style, idx) => {
            const globalIndex = styles.findIndex(s => s === style);
            return <StyleCard key={style.id || idx} style={style} globalIndex={globalIndex} />;
          })}
        </div>
      </div>

      {/* Row 2 - KitchenShowcase */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">🏡 שורה שנייה</h2>
          <button
            onClick={() => addStyle(2)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <Plus size={14} />
            הוסף סגנון
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-3">מופיע אחרי אזור "מעוצב בשבילך"</p>
        <div className="space-y-2">
          {row2Styles.map((style, idx) => {
            const globalIndex = styles.findIndex(s => s === style);
            return <StyleCard key={style.id || idx} style={style} globalIndex={globalIndex} />;
          })}
        </div>
      </div>

      {/* Image Picker Modal */}
      {showImagePicker !== null && (
        <ImagePicker
          isOpen={true}
          onSelect={(url) => {
            updateStyle(showImagePicker, 'image_url', url);
            setShowImagePicker(null);
          }}
          onClose={() => setShowImagePicker(null)}
        />
      )}
    </div>
  );
}
