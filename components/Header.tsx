"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaWhatsapp, FaTiktok, FaYoutube, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { supabase, TopBanner, SocialLink } from "@/lib/supabase";

// Default values
const defaultBanner: TopBanner = {
  id: '1',
  text: 'לתאום פגישת ייעוץ ללא עלות',
  link: '/contact',
  is_active: true,
  background_color: '#000000',
  text_color: '#ffffff'
};

const defaultSocials: SocialLink[] = [
  { id: '1', platform: 'facebook', url: 'https://facebook.com', is_active: true, order_index: 1 },
  { id: '2', platform: 'instagram', url: 'https://instagram.com', is_active: true, order_index: 2 },
];

const socialIcons: Record<string, any> = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  whatsapp: FaWhatsapp,
  tiktok: FaTiktok,
  youtube: FaYoutube,
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [banner, setBanner] = useState<TopBanner>(defaultBanner);
  const [socials, setSocials] = useState<SocialLink[]>(defaultSocials);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch banner
      const { data: bannerData } = await supabase
        .from('top_banner')
        .select('*')
        .single();
      if (bannerData) setBanner(bannerData);

      // Fetch social links
      const { data: socialsData } = await supabase
        .from('social_links')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      if (socialsData?.length) setSocials(socialsData);
    } catch (error) {
      // Use default values
    }
  };

  const activeSocials = socials.filter(s => s.is_active);

  return (
    <>
      {/* Top Banner */}
      {banner.is_active && (
        <div className="px-3 py-2 md:py-3">
          {banner.link ? (
            <Link 
              href={banner.link}
              className="block text-center py-2 md:py-3 px-4 text-xs md:text-sm font-light tracking-wide rounded-full mx-auto hover:opacity-90 transition-opacity"
              style={{ backgroundColor: banner.background_color, color: banner.text_color }}
            >
              {banner.text}
            </Link>
          ) : (
            <div 
              className="text-center py-2 md:py-3 px-4 text-xs md:text-sm font-light tracking-wide rounded-full mx-auto"
              style={{ backgroundColor: banner.background_color, color: banner.text_color }}
            >
              {banner.text}
            </div>
          )}
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 bg-white z-50 border-b border-gray-100 overflow-hidden">
        <div className="mx-auto px-4 md:px-6 lg:px-12 max-w-[100vw]">
          <div className="flex items-center justify-between py-4 md:py-6 relative">
            {/* Search Icon - Left */}
            <button className="p-2 hover:opacity-60 transition-opacity z-10" aria-label="חיפוש">
              <FaSearch className="text-lg" />
            </button>

            {/* Logo - Center */}
            <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 flex items-center hover:opacity-80 transition-opacity">
              <img 
                src="/logo-millo.webp" 
                alt="MILLO" 
                className="h-10 md:h-14 w-auto"
              />
            </Link>

            {/* Social Icons - Right (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              {activeSocials.map((social) => {
                const Icon = socialIcons[social.platform];
                return Icon ? (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:opacity-60 transition-opacity"
                    aria-label={social.platform}
                  >
                    <Icon className="text-xl" />
                  </a>
                ) : null;
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 z-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="תפריט"
            >
              {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:block pb-6">
            <ul className="flex flex-row items-center justify-center gap-8 md:gap-12 text-[15px] font-light">
              <li>
                <Link href="/" className="hover:opacity-60 transition-opacity">
                  בית
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:opacity-60 transition-opacity">
                  פרויקטים
                </Link>
              </li>
              <li>
                <Link href="/kitchen-types" className="hover:opacity-60 transition-opacity">
                  סוגי מטבחים
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:opacity-60 transition-opacity">
                  בלוג
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:opacity-60 transition-opacity">
                  אודות
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:opacity-60 transition-opacity">
                  שאלות נפוצות
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:opacity-60 transition-opacity">
                  יצירת קשר
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Mobile Menu - Full Screen Overlay */}
        <div className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`} dir="rtl">
          <div className="flex flex-col items-center justify-center h-full">
            <nav className="text-center">
              <ul className="flex flex-col gap-8 text-xl font-light">
                <li>
                  <Link href="/" onClick={() => setIsMenuOpen(false)} className="hover:opacity-60 transition-opacity">
                    בית
                  </Link>
                </li>
                <li>
                  <Link href="/projects" onClick={() => setIsMenuOpen(false)} className="hover:opacity-60 transition-opacity">
                    פרויקטים
                  </Link>
                </li>
                <li>
                  <Link href="/kitchen-types" onClick={() => setIsMenuOpen(false)} className="hover:opacity-60 transition-opacity">
                    סוגי מטבחים
                  </Link>
                </li>
                <li>
                  <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="hover:opacity-60 transition-opacity">
                    בלוג
                  </Link>
                </li>
                <li>
                  <Link href="/about" onClick={() => setIsMenuOpen(false)} className="hover:opacity-60 transition-opacity">
                    אודות
                  </Link>
                </li>
                <li>
                  <Link href="/faq" onClick={() => setIsMenuOpen(false)} className="hover:opacity-60 transition-opacity">
                    שאלות נפוצות
                  </Link>
                </li>
                <li>
                  <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="hover:opacity-60 transition-opacity">
                    יצירת קשר
                  </Link>
                </li>
              </ul>
            </nav>
            
            {/* Social Icons in Mobile Menu */}
            <div className="flex items-center gap-6 mt-12">
              {activeSocials.map((social) => {
                const Icon = socialIcons[social.platform];
                return Icon ? (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:opacity-60 transition-opacity"
                    aria-label={social.platform}
                  >
                    <Icon className="text-2xl" />
                  </a>
                ) : null;
              })}
            </div>
          </div>
          
          {/* Close button in mobile menu */}
          <button
            className="absolute top-6 right-4 p-2 z-50"
            onClick={() => setIsMenuOpen(false)}
            aria-label="סגור תפריט"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>
      </header>
    </>
  );
}
