"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase, KitchenStyle } from "@/lib/supabase";

// Default styles for fallback
const defaultStyles: Partial<KitchenStyle>[] = [
  { name_en: 'MODERN', name_he: 'מטבח מודרני', text_position: 'bottom', order_index: 0 },
  { name_en: 'URBAN', name_he: 'מטבח אורבני', text_position: 'top', order_index: 1 },
  { name_en: 'RUSTIC', name_he: 'מטבח כפרי', text_position: 'bottom', order_index: 2 },
];

export default function KitchenStyles() {
  const [styles, setStyles] = useState<Partial<KitchenStyle>[]>(defaultStyles);

  useEffect(() => {
    const fetchStyles = async () => {
      const { data, error } = await supabase
        .from('kitchen_styles')
        .select('*')
        .eq('row_group', 1)
        .eq('is_active', true)
        .order('order_index');
      
      if (data && data.length > 0) {
        setStyles(data);
      }
    };
    fetchStyles();
  }, []);

  return (
    <section className="container mx-auto px-6 lg:px-12 py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-end">
        
        {styles.map((style, index) => (
          <div key={style.id || index} className="flex flex-col">
            {/* Text - Top (if text_position is top) */}
            {style.text_position === 'top' && (
              <div className="text-center order-2 md:order-1 md:mb-6">
                <h3 className="font-english text-[2.5rem] md:text-[3rem] leading-[1.1] font-light tracking-wider">
                  {style.name_en}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{style.name_he}</p>
              </div>
            )}
            
            {/* Image */}
            <div 
              className={`relative h-[450px] md:h-[500px] overflow-hidden mb-6 ${style.text_position === 'top' ? 'order-1 md:order-2 md:mb-0' : ''}`} 
              style={{ borderRadius: '0 30px 30px 30px' }}
            >
              {style.image_url ? (
                <Image
                  src={style.image_url}
                  alt={style.name_en || ''}
                  fill
                  className="object-cover"
                  style={{ objectPosition: style.image_position || 'center center' }}
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
                  <span className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                    {style.name_en}
                  </span>
                </>
              )}
            </div>
            
            {/* Text - Bottom (if text_position is bottom) */}
            {style.text_position === 'bottom' && (
              <div className="text-center">
                <h3 className="font-english text-[2.5rem] md:text-[3rem] leading-[1.1] font-light tracking-wider">
                  {style.name_en}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{style.name_he}</p>
              </div>
            )}
          </div>
        ))}

      </div>
    </section>
  );
}
