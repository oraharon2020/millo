'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import CTASection from '@/components/CTASection'
import NotOnlyKitchens from '@/components/NotOnlyKitchens'

export default function AboutPage() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl">
            <nav className="text-sm mb-6 opacity-70">
              <a href="/" className="hover:underline">בית</a>
              <span className="mx-2">/</span>
              <span>אודות</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-bold font-hebrew">אודות MILLO</h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text - Left Side */}
            <div className="order-2 md:order-1">
              <div className="prose prose-lg max-w-none font-hebrew">
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                  {settings.about_text}
                </p>
              </div>
            </div>

            {/* Image - Right Side */}
            <div className="order-1 md:order-2">
              {settings.about_image ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-[30px]">
                  <Image
                    src={settings.about_image}
                    alt="אודות MILLO"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gray-200 rounded-[30px] flex items-center justify-center">
                  <p className="text-gray-400">טרם הועלתה תמונה</p>
                </div>
              )}
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
