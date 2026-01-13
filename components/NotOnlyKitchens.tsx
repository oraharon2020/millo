"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Category {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  bg_color: string;
  link_url: string | null;
}

// Fallback data if database is empty
const defaultCategories = [
  { id: '1', title: "נגרות מסדרון", bg_color: "from-amber-50 to-orange-50", image_url: null, description: null, link_url: null },
  { id: '2', title: "נגרות אמבטיה", bg_color: "from-gray-100 to-gray-200", image_url: null, description: null, link_url: null },
  { id: '3', title: "ארונות בהתאמה אישית", bg_color: "from-amber-100 to-amber-200", image_url: null, description: null, link_url: null },
  { id: '4', title: "חדרי שינה", bg_color: "from-rose-50 to-pink-50", image_url: null, description: null, link_url: null },
];

export default function NotOnlyKitchens() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, title, description, image_url, bg_color, link_url')
        .eq('is_active', true)
        .order('order_index');
      
      if (!error && data && data.length > 0) {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="container mx-auto px-6 lg:px-12 py-12 md:py-16">
      {/* Header Row - Title Left (in LTR), Description Right */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-12 md:mb-16 gap-6" dir="ltr">
        {/* Title - Left side */}
        <h2 className="font-english text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.1] font-light text-left">
          BUT NOT ONLY KITCHENS
        </h2>
        
        {/* Description - Right side */}
        <p className="font-hebrew text-gray-600 text-sm md:text-base leading-relaxed text-right max-w-md" dir="rtl">
          גלו את מגוון פתרונות הנגרות המתקדמים שלנו - ארונות בהתאמה
          אישית, ארונות אמבטיה, חדרי שינה, נגרות לעסקים ועוד. השראה,
          איכות ועיצובים שיקפיצו כל חלל בבית או בעסק לרמה חדשה!
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((category) => {
          const CardContent = (
            <>
              {/* Image */}
              <div 
                className={`relative w-full h-[180px] md:h-[220px] overflow-hidden flex-shrink-0 ${!category.image_url ? `bg-gradient-to-br ${category.bg_color}` : ''}`}
                style={{ borderRadius: '30px 0 0 0' }}
              >
                {category.image_url ? (
                  <img 
                    src={category.image_url} 
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <span className="text-gray-400 text-xs opacity-50 text-center">{category.title}</span>
                  </div>
                )}
              </div>
              
              {/* Content - Inside card */}
              <div className="p-4 flex flex-col items-end flex-1 justify-between">
                {/* Title - Right aligned */}
                <h3 className="font-hebrew text-right text-base md:text-lg font-medium mb-4 w-full">
                  {category.title}
                </h3>
                
                {/* Arrow Button */}
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-gray-800 transition-colors flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: 'rotate(135deg)' }}>
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </>
          );
          
          const cardClasses = "group cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col";
          const cardStyle = { borderRadius: '30px 0 30px 30px' };
          
          return category.link_url ? (
            <Link key={category.id} href={category.link_url} className={cardClasses} style={cardStyle}>
              {CardContent}
            </Link>
          ) : (
            <div key={category.id} className={cardClasses} style={cardStyle}>
              {CardContent}
            </div>
          );
        })}
      </div>
    </section>
  );
}
