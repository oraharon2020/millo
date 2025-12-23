'use client'

import { useState, useEffect } from 'react'
import { Phone, Mail } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import CTASection from '@/components/CTASection'
import NotOnlyKitchens from '@/components/NotOnlyKitchens'

export default function AccessibilityPage() {
  const [settings, setSettings] = useState({
    phone: '052-1234567',
    email: 'info@millo.co.il'
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase
          .from('settings')
          .select('phone, email')
          .single()
        
        if (data) {
          setSettings({
            phone: data.phone || '052-1234567',
            email: data.email || 'info@millo.co.il'
          })
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }

    fetchSettings()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="container mx-auto px-6 lg:px-12 pt-6 md:pt-10">
        <div className="bg-black text-white py-10 md:py-14 px-8 md:px-12 rounded-[30px] rounded-tr-none">
          <div className="max-w-5xl">
            <nav className="text-sm mb-6 opacity-70">
              <a href="/" className="hover:underline">בית</a>
              <span className="mx-2">/</span>
              <span>הצהרת נגישות</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold font-hebrew mb-2 leading-none">
              הצהרת נגישות
            </h1>
            <p className="text-gray-400 font-hebrew">
              מחויבים לנגישות מלאה לכל משתמשי האתר
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-6 lg:px-12 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="prose prose-lg max-w-none font-hebrew text-right space-y-8">
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">מחויבות לנגישות</h2>
              <p className="text-gray-700 leading-relaxed">
                MILLO מחויבת להנגיש את אתר האינטרנט שלה בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ"ח-1998 
                ולתקנות שהותקנו מכוחו. הצהרת נגישות זו חלה על אתר האינטרנט של MILLO.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">התאמות נגישות באתר</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                אתר זה הותאם לתקן הנגישות הישראלי (ת"י 5568) ברמת AA, ולהנחיות 
                WCAG 2.0 (Web Content Accessibility Guidelines) ברמת AA. התאמות הנגישות כוללות:
              </p>
              <ul className="list-disc pr-6 text-gray-700 space-y-2">
                <li>שימוש בכותרות מסודרות היררכית לניווט קל יותר</li>
                <li>תמיכה מלאה בניווט מקלדת</li>
                <li>טקסטים חלופיים (Alt) לכל התמונות באתר</li>
                <li>ניגודיות צבעים מתאימה לקריאה נוחה</li>
                <li>אפשרות להגדלת וכיווץ הטקסט</li>
                <li>מבנה סמנטי נכון של הדפים</li>
                <li>תמיכה בקוראי מסך</li>
                <li>קישורים ברורים ומתארים</li>
                <li>פוקוס ברור וגלוי על אלמנטים אינטראקטיביים</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">כלי נגישות באתר</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                באתר זה מותקן כפתור נגישות (בצד שמאל של המסך) המאפשר התאמות נוספות:
              </p>
              <ul className="list-disc pr-6 text-gray-700 space-y-2">
                <li><strong>שינוי גודל הטקסט</strong> - הגדלה והקטנה של הגופן באתר</li>
                <li><strong>ניגודיות גבוהה</strong> - הגברת הניגודיות לקריאה טובה יותר</li>
                <li><strong>סמן עכבר מוגדל</strong> - הגדלת גודל הסמן לזיהוי קל יותר</li>
                <li><strong>הדגשת קישורים</strong> - קו תחתון לכל הקישורים באתר</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">דפדפנים ותוכנות מסייעות</h2>
              <p className="text-gray-700 leading-relaxed">
                האתר תומך בדפדפנים המובילים: Chrome, Firefox, Safari, Edge בגרסאותיהם העדכניות.
                האתר תומך בקוראי מסך מובילים כגון: JAWS, NVDA, VoiceOver.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">בקשות והצעות לשיפור</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                אנו שואפים לספק חווית גלישה נגישה ונוחה לכל המשתמשים. אם נתקלתם בבעיית נגישות באתר, 
                או אם יש לכם הצעות לשיפור הנגישות, נשמח לשמוע מכם.
              </p>
              
              <div className="bg-gray-50 rounded-xl p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">צרו קשר בנושא נגישות:</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-gray-600" />
                    <a href={`tel:${settings.phone}`} className="text-blue-600 hover:underline">
                      {settings.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-gray-600" />
                    <a href={`mailto:${settings.email}`} className="text-blue-600 hover:underline">
                      {settings.email}
                    </a>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  רכז נגישות: MILLO - סטודיו לעיצוב מטבחים
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">תאריך עדכון אחרון</h2>
              <p className="text-gray-700 leading-relaxed">
                הצהרת נגישות זו עודכנה לאחרונה ב-23 בדצמבר 2025.
                אנו ממשיכים לעבוד על שיפור הנגישות באופן שוטף.
              </p>
            </div>

          </div>
        </div>
      </section>

      <div className="mb-16">
        <CTASection />
      </div>
      
      <NotOnlyKitchens />
    </div>
  )
}
