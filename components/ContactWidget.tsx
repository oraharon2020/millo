'use client'

import { useState, useEffect } from 'react'
import { Phone, MessageCircle, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ContactWidget() {
  const [settings, setSettings] = useState({ phone: '052-1234567', whatsapp: '052-1234567' })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase
          .from('settings')
          .select('phone, whatsapp')
          .single()
        
        if (data) {
          setSettings({
            phone: data.phone || '052-1234567',
            whatsapp: data.whatsapp || data.phone || '052-1234567'
          })
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }

    fetchSettings()
  }, [])

  const handlePhoneClick = () => {
    window.location.href = `tel:${settings.phone}`
    setIsOpen(false)
  }

  const handleWhatsAppClick = () => {
    // Remove spaces and dashes from phone number
    const cleanPhone = settings.whatsapp.replace(/[\s-]/g, '')
    // If phone starts with 0, replace with +972
    const internationalPhone = cleanPhone.startsWith('0') 
      ? '+972' + cleanPhone.substring(1)
      : cleanPhone
    window.open(`https://wa.me/${internationalPhone}`, '_blank')
    setIsOpen(false)
  }

  return (
    <div className="fixed right-6 bottom-6 z-[9999] contact-widget">
      {/* Contact Options - Show when open */}
      <div className={`absolute bottom-20 right-0 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className="bg-white rounded-2xl shadow-xl p-2 min-w-[200px]">
          {/* WhatsApp Option */}
          <button
            onClick={handleWhatsAppClick}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-right group"
          >
            <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 font-hebrew">וואטסאפ</p>
              <p className="text-xs text-gray-500 font-hebrew">{settings.whatsapp}</p>
            </div>
          </button>

          {/* Phone Option */}
          <button
            onClick={handlePhoneClick}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-right group"
          >
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Phone size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 font-hebrew">התקשר</p>
              <p className="text-xs text-gray-500 font-hebrew">{settings.phone}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-200"
        aria-label="פתח תפריט יצירת קשר"
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <MessageCircle size={28} />
        )}
      </button>
    </div>
  )
}
