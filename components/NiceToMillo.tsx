'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function NiceToMillo() {
  const [settings, setSettings] = useState({
    about_text: 'אנחנו MILLO - סטודיו לעיצוב מטבחים יוקרתיים המתמחה ביצירת חללי מטבח ייחודיים ומותאמים אישית. אנו משלבים עיצוב מודרני עם פונקציונליות מקסימלית.',
    about_image: ''
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase
          .from('settings')
          .select('about_text, about_image')
          .single()
        
        if (data) {
          setSettings({
            about_text: data.about_text || 'אנחנו MILLO - סטודיו לעיצוב מטבחים יוקרתיים המתמחה ביצירת חללי מטבח ייחודיים ומותאמים אישית. אנו משלבים עיצוב מודרני עם פונקציונליות מקסימלית.',
            about_image: data.about_image || ''
          })
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }

    fetchSettings()
  }, [])

  // Get first paragraph from about text
  const firstParagraph = settings.about_text?.split('\n')[0] || settings.about_text || ''

  return (
    <section className="container mx-auto px-6 lg:px-12 py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center" dir="ltr">
        
        {/* Text Content - Left Side */}
        <div className="order-2 md:order-1 space-y-6">
          <h2 className="font-english text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.1] font-light text-left">
            NICE TO<br />MILLO YOU!
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed text-sm md:text-base text-right font-hebrew" dir="rtl">
            <p>
              {firstParagraph}
            </p>
          </div>
          
          {/* CTA Button */}
          <div className="flex items-center gap-4 pt-4" dir="rtl">
            <span className="font-hebrew text-base">קרא עוד אודותינו</span>
            <Link href="/about">
              <button className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: 'rotate(135deg)' }}>
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </Link>
          </div>
        </div>

        {/* Image - Right Side */}
        <div className="order-1 md:order-2">
          <div 
            className="relative h-[350px] md:h-[450px] lg:h-[500px] overflow-hidden shadow-lg"
            style={{ borderRadius: '30px 0 30px 30px' }}
          >
            {settings.about_image ? (
              <Image
                src={settings.about_image}
                alt="אודות MILLO"
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-amber-900 to-orange-800 flex items-center justify-center">
                <span className="text-white/30 text-sm">תמונת מטבח מרכזית</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}

