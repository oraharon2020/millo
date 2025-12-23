"use client";

import { useEffect, useState } from "react";
import { Save, ChevronDown, ChevronUp, Image as ImageIcon, X } from "lucide-react";
import { supabase, HeroSection, TopBanner, SocialLink, ContactInfo } from "@/lib/supabase";
import Image from "next/image";
import ImagePicker from "@/components/admin/ImagePicker";
import ImagePositionPicker from "@/components/admin/ImagePositionPicker";

// Default values
const defaultHero: HeroSection = {
  id: '1',
  video_url: '/סרטון-לרוחב.mp4',
  title_en: 'TAILORED DESIGN, JUST FOR YOU',
  title_he: 'עיצוב מותאם אישית שמשלב את הצרכים שלכם עם האסתטיקה המושלמת',
  subtitle: 'עיצוב מטבח בנגרות אישית, המשלב פונקציונליות וסטנדרט אסתטי גבוה.',
  cta_text: 'לתאום פגישת ייעוץ ללא עלות',
  cta_link: '/contact',
  main_image_url: '',
  main_image_position: 'center center',
  secondary_image_url: '',
  secondary_image_position: 'center center',
  updated_at: new Date().toISOString()
};

const defaultBanner: TopBanner = {
  id: '1', text: 'לתאום פגישת ייעוץ ללא עלות', link: '/contact',
  is_active: true, background_color: '#000000', text_color: '#ffffff'
};

const defaultSocials: SocialLink[] = [
  { id: '1', platform: 'facebook', url: 'https://facebook.com', is_active: true, order_index: 1 },
  { id: '2', platform: 'instagram', url: 'https://instagram.com', is_active: true, order_index: 2 },
];

const defaultContact: ContactInfo = {
  id: '1', phone: '052-1234567', email: 'info@millo.co.il',
  address: 'תל אביב, ישראל', whatsapp: '972521234567'
};

type ImagePickerField = 'image_url' | 'main_image_url' | 'secondary_image_url';

// Collapsible Section Component
function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 text-sm">{title}</span>
        {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {isOpen && <div className="px-4 pb-4 border-t border-gray-100">{children}</div>}
    </div>
  );
}

// Compact Input Component
function Input({ label, value, onChange, type = "text", placeholder = "", dir = "rtl" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; dir?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
      />
    </div>
  );
}

// Compact Textarea Component
function Textarea({ label, value, onChange, rows = 2 }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none"
      />
    </div>
  );
}

export default function HomeContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imagePickerField, setImagePickerField] = useState<ImagePickerField>('main_image_url');
  
  const [hero, setHero] = useState<HeroSection>(defaultHero);
  const [banner, setBanner] = useState<TopBanner>(defaultBanner);
  const [socials, setSocials] = useState<SocialLink[]>(defaultSocials);
  const [contact, setContact] = useState<ContactInfo>(defaultContact);

  const openImagePicker = (field: ImagePickerField) => {
    setImagePickerField(field);
    setShowImagePicker(true);
  };

  const handleImageSelect = (url: string) => {
    setHero({ ...hero, [imagePickerField]: url });
    setShowImagePicker(false);
  };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const { data: heroData } = await supabase.from('hero_section').select('*').single();
      if (heroData) setHero(heroData);
      const { data: bannerData } = await supabase.from('top_banner').select('*').single();
      if (bannerData) setBanner(bannerData);
      const { data: socialsData } = await supabase.from('social_links').select('*').order('order_index');
      if (socialsData?.length) setSocials(socialsData);
      const { data: contactData } = await supabase.from('contact_info').select('*').single();
      if (contactData) setContact(contactData);
    } catch (error) {
      console.log('Using default values');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase.from('hero_section').upsert({
        id: hero.id || '1', video_url: hero.video_url, title_en: hero.title_en, title_he: hero.title_he,
        subtitle: hero.subtitle, cta_text: hero.cta_text, cta_link: hero.cta_link, image_url: hero.image_url,
        main_image_url: hero.main_image_url, main_image_position: hero.main_image_position,
        secondary_image_url: hero.secondary_image_url, secondary_image_position: hero.secondary_image_position,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
      
      await supabase.from('top_banner').upsert({ ...banner, id: banner.id || '1' }, { onConflict: 'id' });
      for (const social of socials) { await supabase.from('social_links').upsert(social); }
      await supabase.from('contact_info').upsert({ ...contact, id: contact.id || '1' }, { onConflict: 'id' });
      
      alert('נשמר בהצלחה!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('שגיאה בשמירה');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">טוען...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-gray-50 py-3 z-10">
        <div>
          <h1 className="text-lg font-bold text-gray-900">תוכן דף הבית</h1>
          <p className="text-gray-500 text-xs">עריכת התוכן המוצג בדף הבית</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm"
        >
          <Save size={16} />
          <span>{saving ? 'שומר...' : 'שמור'}</span>
        </button>
      </div>

      {/* Hero Video/Background */}
      <Section title="🎬 וידאו/רקע באנר ראשי" defaultOpen={true}>
        <div className="pt-3 space-y-3">
          <Input 
            label="קישור לוידאו" 
            value={hero.video_url || ''} 
            onChange={(v) => setHero({ ...hero, video_url: v })}
            placeholder="/video.mp4"
            dir="ltr"
          />
          <p className="text-xs text-gray-400">השאר ריק להצגת תמונת רקע במקום וידאו</p>
        </div>
      </Section>

      {/* Hero Text Content */}
      <Section title="✏️ טקסטים באנר ראשי" defaultOpen={true}>
        <div className="pt-3 space-y-3">
          <Input 
            label="כותרת (אנגלית)" 
            value={hero.title_en} 
            onChange={(v) => setHero({ ...hero, title_en: v })}
            dir="ltr"
          />
          <Textarea 
            label="תת-כותרת (עברית)" 
            value={hero.title_he || ''} 
            onChange={(v) => setHero({ ...hero, title_he: v })}
          />
          <Textarea 
            label="תיאור" 
            value={hero.subtitle || ''} 
            onChange={(v) => setHero({ ...hero, subtitle: v })}
            rows={2}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input 
              label="טקסט כפתור CTA" 
              value={hero.cta_text || ''} 
              onChange={(v) => setHero({ ...hero, cta_text: v })}
            />
            <Input 
              label="קישור כפתור" 
              value={hero.cta_link || ''} 
              onChange={(v) => setHero({ ...hero, cta_link: v })}
              dir="ltr"
              placeholder="/contact"
            />
          </div>
        </div>
      </Section>

      {/* Hero Images */}
      <Section title="🖼️ תמונות סקשן" defaultOpen={false}>
        <div className="pt-3 grid grid-cols-2 gap-4">
          {/* Main Image */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">תמונת מטבח ראשית</span>
              {hero.main_image_url && (
                <button
                  type="button"
                  onClick={() => setHero({ ...hero, main_image_url: '', main_image_position: 'center center' })}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  הסר
                </button>
              )}
            </div>
            {hero.main_image_url ? (
              <div className="space-y-2">
                <ImagePositionPicker
                  imageUrl={hero.main_image_url}
                  position={hero.main_image_position || 'center center'}
                  onChange={(pos) => setHero({ ...hero, main_image_position: pos })}
                  aspectRatio="4/3"
                />
                <button
                  type="button"
                  onClick={() => openImagePicker('main_image_url')}
                  className="w-full py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  החלף תמונה
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openImagePicker('main_image_url')}
                className="flex flex-col items-center justify-center h-24 w-full border-2 border-dashed border-gray-200 rounded-lg hover:border-gray-400 transition-colors"
              >
                <ImageIcon className="text-gray-400 mb-1" size={18} />
                <span className="text-xs text-gray-500">בחר תמונה</span>
              </button>
            )}
          </div>

          {/* Secondary Image */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">תמונת ברז</span>
              {hero.secondary_image_url && (
                <button
                  type="button"
                  onClick={() => setHero({ ...hero, secondary_image_url: '', secondary_image_position: 'center center' })}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  הסר
                </button>
              )}
            </div>
            {hero.secondary_image_url ? (
              <div className="space-y-2">
                <ImagePositionPicker
                  imageUrl={hero.secondary_image_url}
                  position={hero.secondary_image_position || 'center center'}
                  onChange={(pos) => setHero({ ...hero, secondary_image_position: pos })}
                  aspectRatio="16/9"
                />
                <button
                  type="button"
                  onClick={() => openImagePicker('secondary_image_url')}
                  className="w-full py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  החלף תמונה
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openImagePicker('secondary_image_url')}
                className="flex flex-col items-center justify-center h-24 w-full border-2 border-dashed border-gray-200 rounded-lg hover:border-gray-400 transition-colors"
              >
                <ImageIcon className="text-gray-400 mb-1" size={18} />
                <span className="text-xs text-gray-500">בחר תמונה</span>
              </button>
            )}
          </div>
        </div>
      </Section>

      {/* Top Banner */}
      <Section title="📢 באנר עליון" defaultOpen={false}>
        <div className="pt-3 space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="bannerActive"
              checked={banner.is_active}
              onChange={(e) => setBanner({ ...banner, is_active: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="bannerActive" className="text-sm text-gray-700">הצג באנר</label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input 
              label="טקסט" 
              value={banner.text} 
              onChange={(v) => setBanner({ ...banner, text: v })}
            />
            <Input 
              label="קישור" 
              value={banner.link || ''} 
              onChange={(v) => setBanner({ ...banner, link: v })}
              dir="ltr"
              placeholder="/contact"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">צבע רקע</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={banner.background_color}
                  onChange={(e) => setBanner({ ...banner, background_color: e.target.value })}
                  className="w-8 h-8 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={banner.background_color}
                  onChange={(e) => setBanner({ ...banner, background_color: e.target.value })}
                  className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded-lg"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">צבע טקסט</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={banner.text_color}
                  onChange={(e) => setBanner({ ...banner, text_color: e.target.value })}
                  className="w-8 h-8 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={banner.text_color}
                  onChange={(e) => setBanner({ ...banner, text_color: e.target.value })}
                  className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded-lg"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
          {/* Preview */}
          <div 
            className="text-center py-2 px-3 text-xs rounded-full"
            style={{ backgroundColor: banner.background_color, color: banner.text_color }}
          >
            {banner.text}
          </div>
        </div>
      </Section>

      {/* Social Links */}
      <Section title="🔗 רשתות חברתיות" defaultOpen={false}>
        <div className="pt-3 space-y-2">
          {socials.map((social, index) => (
            <div key={social.id} className="flex items-center gap-2">
              <select
                value={social.platform}
                onChange={(e) => {
                  const newSocials = [...socials];
                  newSocials[index].platform = e.target.value as SocialLink['platform'];
                  setSocials(newSocials);
                }}
                className="w-24 px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
              >
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
              </select>
              <input
                type="url"
                value={social.url}
                onChange={(e) => {
                  const newSocials = [...socials];
                  newSocials[index].url = e.target.value;
                  setSocials(newSocials);
                }}
                className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg"
                dir="ltr"
                placeholder="https://..."
              />
              <input
                type="checkbox"
                checked={social.is_active}
                onChange={(e) => {
                  const newSocials = [...socials];
                  newSocials[index].is_active = e.target.checked;
                  setSocials(newSocials);
                }}
                className="w-3.5 h-3.5"
                title="פעיל"
              />
              <button
                type="button"
                onClick={() => setSocials(socials.filter((_, i) => i !== index))}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSocials([...socials, {
              id: Date.now().toString(),
              platform: 'facebook',
              url: '',
              is_active: true,
              order_index: socials.length + 1
            }])}
            className="w-full py-1.5 text-xs text-gray-600 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50"
          >
            + הוסף רשת חברתית
          </button>
        </div>
      </Section>

      {/* Contact Info */}
      <Section title="📞 פרטי יצירת קשר" defaultOpen={false}>
        <div className="pt-3 grid grid-cols-2 gap-3">
          <Input 
            label="טלפון" 
            value={contact.phone || ''} 
            onChange={(v) => setContact({ ...contact, phone: v })}
            dir="ltr"
          />
          <Input 
            label="אימייל" 
            value={contact.email || ''} 
            onChange={(v) => setContact({ ...contact, email: v })}
            type="email"
            dir="ltr"
          />
          <Input 
            label="כתובת" 
            value={contact.address || ''} 
            onChange={(v) => setContact({ ...contact, address: v })}
          />
          <Input 
            label="WhatsApp (עם קידומת)" 
            value={contact.whatsapp || ''} 
            onChange={(v) => setContact({ ...contact, whatsapp: v })}
            placeholder="972521234567"
            dir="ltr"
          />
        </div>
      </Section>

      {/* Image Picker Modal */}
      <ImagePicker
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={handleImageSelect}
        title="בחר תמונה"
      />
    </div>
  );
}
