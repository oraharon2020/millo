"use client";

import { useEffect, useState } from "react";
import { supabase, HeroSection } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

const defaultHero: HeroSection = {
  id: '1',
  video_url: '/סרטון-לרוחב.mp4',
  title_en: 'TAILORED DESIGN, JUST FOR YOU',
  title_he: 'עיצוב מותאם אישית שמשלב את הצרכים שלכם עם האסתטיקה המושלמת',
  subtitle: 'עיצוב מטבח בנגרות אישית, המשלב פונקציונליות וסטנדרט אסתטי גבוה. הזמינו פגישת ייעוץ אישית להתאמה מושלמת עבור הבית שלכם.',
  cta_text: 'לתאום פגישת ייעוץ ללא עלות',
  cta_link: '/contact',
  main_image_url: '',
  main_image_position: 'center center',
  secondary_image_url: '',
  secondary_image_position: 'center center',
  updated_at: new Date().toISOString()
};

export default function Hero() {
  const [hero, setHero] = useState<HeroSection>(defaultHero);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const { data } = await supabase
        .from('hero_section')
        .select('*')
        .single();
      
      if (data) setHero(data);
    } catch (error) {
      // Use default values
    }
  };

  // Split title for display
  const titleParts = hero.title_en.split(',');

  return (
    <section className="w-full px-3 overflow-hidden max-w-[100vw]">
      {/* Full Width Video/Image Banner */}
      <div className="relative w-full h-[450px] md:h-[650px] lg:h-[850px] overflow-hidden" style={{ borderRadius: '0 30px 30px 30px' }}>
        {hero.video_url ? (
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={hero.video_url} type="video/mp4" />
          </video>
        ) : hero.image_url ? (
          <Image 
            src={hero.image_url} 
            alt="Hero" 
            fill 
            className="object-cover"
            priority
          />
        ) : (
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/סרטון-לרוחב.mp4" type="video/mp4" />
          </video>
        )}
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="elegant-title text-2xl md:text-5xl lg:text-7xl mb-4 md:mb-6 drop-shadow-2xl">
              {titleParts[0]}{titleParts[1] && <>,<br />{titleParts[1].trim()}</>}
            </h1>
            <p className="text-sm md:text-xl font-light drop-shadow-lg max-w-2xl mx-auto">
              {hero.title_he}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section Below Video */}
      <div className="container mx-auto px-4 md:px-6 lg:px-12 py-10 md:py-24">
        
        {/* Top Row - Text + CTA Left, Title Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 mb-8 md:mb-12">
          {/* Left - Description + CTA */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4 md:mb-6 text-right">
              {hero.subtitle}
            </p>
            
            <div className="flex justify-start">
              <a 
                href={hero.cta_link || '/contact'} 
                className="bg-black text-white px-5 md:px-8 py-3 md:py-4 text-xs md:text-sm font-medium hover:bg-gray-800 transition-all flex items-center gap-2 md:gap-3" 
                style={{ borderRadius: '50px 0 50px 50px' }}
              >
                <svg className="w-3 h-3 md:w-4 md:h-4 rotate-[-45deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {hero.cta_text}
              </a>
            </div>
          </div>
          
          {/* Right - Title */}
          <div className="order-1 lg:order-2 text-left">
            <h2 className="font-english text-[1.75rem] md:text-[3rem] lg:text-[4rem] leading-[1.1] font-light italic">
              Tailored design,<br />just for you
            </h2>
          </div>
        </div>

        {/* Bottom Row - Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          
          {/* Left - Craft Your Kitchen + Small Image */}
          <div className="flex flex-col gap-4 md:gap-6 order-2 lg:order-1">
            
            {/* Craft Your Kitchen Title */}
            <h3 className="font-english text-[1.75rem] md:text-[2.5rem] lg:text-[3.5rem] leading-[1.1] font-light italic text-left order-1">
              Craft<br />Your<br />Kitchen
            </h3>
            
            {/* Small Faucet Image */}
            <div className="relative h-[180px] md:h-[260px] rounded-[20px] md:rounded-[25px] overflow-hidden order-2">
              {hero.secondary_image_url ? (
                <Image 
                  src={hero.secondary_image_url} 
                  alt="Secondary" 
                  fill 
                  className="object-cover" 
                  style={{ objectPosition: hero.secondary_image_position || 'center center' }}
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
                  <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">תמונת ברז</span>
                </>
              )}
            </div>
            
            {/* View Projects Link */}
            <div className="flex items-center gap-3 justify-start order-3">
              <span className="text-sm md:text-lg font-medium text-gray-700">הצצה לפרויקטים</span>
              <Link href="/projects" className="w-10 h-10 md:w-12 md:h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all">
                <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 7L7 17" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 7v10M17 17H7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Right - Main Kitchen Image */}
          <div className="relative h-[280px] md:h-[450px] lg:h-[550px] overflow-hidden rounded-[20px] md:rounded-[30px] order-1 lg:order-2">
            {hero.main_image_url ? (
              <Image 
                src={hero.main_image_url} 
                alt="Kitchen" 
                fill 
                className="object-cover" 
                style={{ objectPosition: hero.main_image_position || 'center center' }}
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
                <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">תמונת מטבח ראשית</span>
              </>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}
