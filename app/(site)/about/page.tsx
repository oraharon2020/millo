'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import CTASection from '@/components/CTASection'
import NotOnlyKitchens from '@/components/NotOnlyKitchens'

interface AboutContent {
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
  hero_title: 'אודות MILLO',
  hero_subtitle: 'מעצבים חלומות מאז 2010',
  hero_description: 'סטודיו בוטיק לעיצוב וייצור מטבחים יוקרתיים, המשלב מקצועיות ללא פשרות עם חדשנות עיצובית',
  main_title: 'הסיפור שלנו',
  main_text: `מאז 2010, MILLO מוביל את תעשיית המטבחים היוקרתיים בישראל. מה שהתחיל כסטודיו קטן עם חזון גדול, הפך לאחד מבתי העיצוב המובילים בארץ - עם מאות לקוחות מרוצים ופרויקטים שזכו להכרה ופרסים.

אנחנו לא רק מייצרים מטבחים - אנחנו יוצרים חוויות. כל מטבח שיוצא מהמפעל שלנו הוא תוצאה של תהליך עמוק של הקשבה, תכנון קפדני, ויצירה ברמה הגבוהה ביותר. אנחנו מאמינים שהמטבח הוא לב הבית, והוא ראוי להשקעה שתשרת אתכם לשנים רבות.

הצוות שלנו מורכב ממעצבים בכירים, מהנדסים מנוסים, ואנשי מקצוע מהשורה הראשונה שחולקים את אותה התשוקה לשלמות. אנחנו עובדים רק עם החומרים המובחרים ביותר מהיצרנים המובילים בעולם - מפורניר איטלקי ועד אבן קיסר.

מה שמייחד אותנו? הגישה האישית. אצלנו אין "מטבח מהמדף". כל פרויקט מתוכנן מאפס בהתאם לצרכים, לסגנון החיים ולחלומות של הלקוח. מהפגישה הראשונה ועד ההתקנה האחרונה - אנחנו לצידכם.`,
  main_image: null,
  show_stats: true,
  stat1_number: '16',
  stat1_label: 'שנות ניסיון',
  stat2_number: '1,200+',
  stat2_label: 'פרויקטים שהושלמו',
  stat3_number: '98%',
  stat3_label: 'לקוחות ממליצים',
  stat4_number: '5',
  stat4_label: 'שנות אחריות',
  show_values: true,
  values_title: 'למה לבחור בנו',
  value1_title: 'מומחיות שאין שניה לה',
  value1_text: '16 שנות ניסיון בעיצוב וייצור מטבחים יוקרתיים. צוות של מעצבים ומהנדסים מהטובים בישראל.',
  value2_title: 'איכות ללא פשרות',
  value2_text: 'אנחנו עובדים רק עם החומרים הטובים ביותר בעולם - מנגנוני Blum, משטחי Caesarstone, ופורניר איטלקי.',
  value3_title: 'שירות מקצה לקצה',
  value3_text: 'מהרגע הראשון ועד שנים אחרי ההתקנה - אנחנו כאן בשבילכם.',
};

export default function AboutPage() {
  const [content, setContent] = useState<AboutContent>(defaultContent);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('about_content')
          .select('*')
          .single()
        
        if (!error && data) {
          setContent(data);
        }
      } catch (error) {
        console.error('Error fetching about content:', error)
      }
    }

    fetchContent()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="container mx-auto px-6 lg:px-12 pt-6 md:pt-10">
        <div className="bg-black text-white py-10 md:py-14 px-8 md:px-12 rounded-[30px] rounded-tr-none">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            
            {/* Right - Breadcrumb & Title */}
            <div className="w-full md:w-auto flex flex-col text-right">
              <p className="text-sm text-gray-400 mb-3">
                בית<span className="mx-2">/</span><span className="text-white">אודות</span>
              </p>

              <h1 className="text-4xl md:text-5xl font-bold font-hebrew mb-2 leading-none">
                {content.hero_title}
              </h1>

              <p className="text-gray-400 font-hebrew text-sm mt-2">
                {content.hero_subtitle}
              </p>
            </div>

            {/* Left - Description */}
            <div className="max-w-md text-right">
              <p className="text-gray-300 leading-relaxed text-sm font-hebrew">
                {content.hero_description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text - Right Side (in RTL) */}
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold font-hebrew mb-6">{content.main_title}</h2>
              <div className="prose prose-lg max-w-none font-hebrew">
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                  {content.main_text}
                </p>
              </div>
            </div>

            {/* Image - Left Side */}
            <div className="order-1 md:order-2">
              {content.main_image ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-[30px] rounded-tr-none">
                  <Image
                    src={content.main_image}
                    alt="אודות MILLO"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-[30px] rounded-tr-none flex items-center justify-center">
                  <p className="text-gray-400">תמונה</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {content.show_stats && (
        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">{content.stat1_number}</div>
                <div className="text-gray-400">{content.stat1_label}</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">{content.stat2_number}</div>
                <div className="text-gray-400">{content.stat2_label}</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">{content.stat3_number}</div>
                <div className="text-gray-400">{content.stat3_label}</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">{content.stat4_number}</div>
                <div className="text-gray-400">{content.stat4_label}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Values Section */}
      {content.show_values && (
        <section className="py-16">
          <div className="container mx-auto px-6 lg:px-12">
            <h2 className="text-3xl md:text-4xl font-bold font-hebrew text-center mb-12">
              {content.values_title}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[30px] rounded-tr-none shadow-sm text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="text-xl font-bold mb-3 font-hebrew">{content.value1_title}</h3>
                <p className="text-gray-600 font-hebrew">{content.value1_text}</p>
              </div>
              <div className="bg-white p-8 rounded-[30px] rounded-tr-none shadow-sm text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">★</span>
                </div>
                <h3 className="text-xl font-bold mb-3 font-hebrew">{content.value2_title}</h3>
                <p className="text-gray-600 font-hebrew">{content.value2_text}</p>
              </div>
              <div className="bg-white p-8 rounded-[30px] rounded-tr-none shadow-sm text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">♥</span>
                </div>
                <h3 className="text-xl font-bold mb-3 font-hebrew">{content.value3_title}</h3>
                <p className="text-gray-600 font-hebrew">{content.value3_text}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="mb-10">
        <CTASection />
      </div>
      
      <NotOnlyKitchens />
    </div>
  )
}
