'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import CTASection from '@/components/CTASection'
import NotOnlyKitchens from '@/components/NotOnlyKitchens'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  display_order: number
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('הכל')

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) throw error
      setFaqs(data || [])
    } catch (error) {
      console.error('Error fetching FAQs:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['הכל', ...Array.from(new Set(faqs.map(faq => faq.category)))]
  
  const filteredFAQs = selectedCategory === 'הכל' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="container mx-auto px-6 lg:px-12 pt-6 md:pt-10">
        <div className="bg-black text-white py-10 md:py-14 px-8 md:px-12 rounded-[30px] rounded-tr-none">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            
            {/* Right - Breadcrumb & Title */}
            <div className="w-full md:w-auto flex flex-col text-right">
              <p className="text-sm text-gray-400 mb-3">
                בית<span className="mx-2">/</span><span className="text-white">שאלות נפוצות</span>
              </p>

              <h1 className="text-4xl md:text-5xl font-bold font-hebrew mb-2 leading-none">
                שאלות נפוצות
              </h1>

              <p className="text-gray-400 font-hebrew">
                <span className="text-white font-medium">{faqs.length}</span> שאלות ותשובות
              </p>
            </div>

            {/* Left - Description */}
            <div className="max-w-md text-right">
              <p className="text-gray-300 leading-relaxed text-sm font-hebrew">
                כאן תמצאו תשובות לשאלות הנפוצות ביותר שלקוחותינו שואלים. אם לא מצאתם את התשובה שחיפשתם, אנו זמינים תמיד לשירותכם.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="container mx-auto px-6 lg:px-12 py-10">
        {/* Category Filter */}
        <div className="flex items-center justify-center gap-3 mb-12 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-hebrew transition-colors ${
                selectedCategory === category
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQs List */}
        {loading ? (
          <div className="space-y-4 max-w-4xl mx-auto">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredFAQs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg font-hebrew">לא נמצאו שאלות בקטגוריה זו</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-right gap-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900 font-hebrew flex-1">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    size={24}
                    className={`text-gray-400 transition-transform flex-shrink-0 ${
                      openId === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openId === faq.id ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-5">
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed font-hebrew text-right whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="mb-10">
        <CTASection />
      </div>
      
      <NotOnlyKitchens />
    </div>
  )
}
