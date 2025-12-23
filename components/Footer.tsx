'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FiPhone, FiMapPin, FiArrowDownLeft } from "react-icons/fi";
import { supabase } from "@/lib/supabase";

export default function Footer() {
  const [settings, setSettings] = useState({
    phone: "03-3732350",
    address: "אברהם בומה שביט 1 ראשון לציון, מחסן F-101",
    facebook: "",
    instagram: ""
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase
          .from('settings')
          .select('phone, address, facebook, instagram')
          .single()
        
        if (data) {
          setSettings({
            phone: data.phone || "03-3732350",
            address: data.address || "אברהם בומה שביט 1 ראשון לציון, מחסן F-101",
            facebook: data.facebook || "",
            instagram: data.instagram || ""
          })
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }

    fetchSettings()
  }, [])

  return (
    <footer className="bg-white mt-8 md:mt-12 overflow-hidden max-w-[100vw]">
      <div className="container mx-auto px-4 py-8 md:py-12" style={{ direction: 'ltr' }}>
        <div className="flex flex-col-reverse lg:flex-row justify-between gap-10 md:gap-12">
          
          {/* Left Side - Logo & Contact Info */}
          <div className="flex flex-col items-center lg:items-start">
            {/* Social Icons */}
            <div className="flex gap-3 mb-6 md:mb-8">
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity"
                >
                  <FaFacebook className="text-xl text-gray-800" />
                </a>
              )}
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity"
                >
                  <FaInstagram className="text-xl text-gray-800" />
                </a>
              )}
            </div>

            {/* Logo */}
            <div className="mb-8">
              <Image 
                src="/logo-millo.webp" 
                alt="MILLO" 
                width={180} 
                height={60}
                className="h-auto"
              />
            </div>

            {/* Address */}
            <div className="flex items-center gap-2 text-gray-600 mb-3 font-hebrew" style={{ direction: 'rtl' }}>
              <FiMapPin className="text-lg flex-shrink-0" />
              <span>{settings.address}</span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2 text-gray-600 font-hebrew" style={{ direction: 'rtl' }}>
              <FiPhone className="text-lg flex-shrink-0" />
              <span>{settings.phone}</span>
            </div>
          </div>

          {/* Right Side - Navigation & CTA */}
          <div className="flex flex-col items-center lg:items-start" style={{ direction: 'rtl' }}>
            {/* CTA Button */}
            <div className="mb-8 md:mb-12">
              <button className="bg-gray-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-full flex items-center gap-3 hover:bg-gray-800 transition-all font-hebrew text-sm md:text-base">
                <span>לתאום פגישת ייעוץ ללא עלות</span>
                <FiArrowDownLeft className="text-lg" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex gap-8 md:gap-16">
              {/* Column 1 */}
              <nav className="flex flex-col items-start gap-4 text-right">
                <Link href="/" className="text-gray-600 hover:text-black transition-colors font-hebrew">
                  בית
                </Link>
                <Link href="/projects" className="text-gray-600 hover:text-black transition-colors font-hebrew">
                  פרויקטים
                </Link>
                <Link href="/showroom" className="text-gray-600 hover:text-black transition-colors font-english tracking-wider">
                  SHOWROOM
                </Link>
                <Link href="/blog" className="text-gray-600 hover:text-black transition-colors font-hebrew">
                  בלוג
                </Link>
              </nav>

              {/* Column 2 */}
              <nav className="flex flex-col items-start gap-4 text-right">
                <Link href="/about" className="text-gray-600 hover:text-black transition-colors font-hebrew">
                  אודות
                </Link>
                <Link href="/contact" className="text-gray-600 hover:text-black transition-colors font-hebrew">
                  יצירת קשר
                </Link>
                <Link href="/faq" className="text-gray-600 hover:text-black transition-colors font-hebrew">
                  שאלות נפוצות
                </Link>
                <Link href="/accessibility" className="text-gray-600 hover:text-black transition-colors font-hebrew">
                  הצהרת נגישות
                </Link>
                <Link href="/terms" className="text-gray-600 hover:text-black transition-colors font-hebrew">
                  תנאי שימוש ותקנון האתר
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          {/* Empty or can add copyright */}
        </div>
      </div>
    </footer>
  );
}
