"use client";

import { useState, useRef, useEffect } from "react";
import { FiArrowDownLeft } from "react-icons/fi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase, KitchenInsight } from "../lib/supabase";

export default function KitchenInsights() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [insights, setInsights] = useState<KitchenInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const { data, error } = await supabase
        .from('kitchen_insights')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setInsights(data || []);
    } catch (error) {
      // DB not available yet - using fallback data
      // Fallback to static data if DB fails
      setInsights([
        {
          id: '1',
          title: "לורם איפסום דולור סיט אמט אדפסינג אליט",
          description: "לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית",
          image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % insights.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + insights.length) % insights.length);
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 overflow-hidden max-w-[100vw]">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4 mx-auto max-w-md"></div>
            <div className="h-4 bg-gray-200 rounded mx-auto max-w-xl"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 overflow-hidden max-w-[100vw]">
      {/* Header */}
      <div className="container mx-auto px-4 text-center mb-8 md:mb-12">
        <h2 className="elegant-title text-3xl md:text-5xl lg:text-6xl mb-3 md:mb-4">
          KITCHEN INSIGHTS
        </h2>
        <p className="text-gray-500 text-xs md:text-base leading-relaxed max-w-xl mx-auto px-4">
          גלו את כל הטרנדים הכי חמים בעולם עיצוב המטבחים - רעיונות, השראה
          <br className="hidden md:block" />
          <span className="md:hidden"> </span>
          וטיפים שיעשו לכם חשק לעצב מחדש את המטבח שלכם!
        </p>
      </div>

      {/* Cards Carousel */}
      <div className="w-full overflow-hidden">
        {/* Mobile Carousel */}
        <div className="md:hidden relative overflow-hidden py-10">
          {/* Carousel Container */}
          <div className="relative h-[450px] flex items-center justify-center">
            {insights.map((insight, index) => {
              const offset = index - currentSlide;
              const absOffset = Math.abs(offset);
              
              // Only show cards within 2 positions of current
              if (absOffset > 2) return null;
              
              const isCenter = offset === 0;
              const scale = isCenter ? 1 : 0.8;
              const opacity = isCenter ? 1 : 0.4;
              const translateX = -offset * 270; // Negative for RTL - next card comes from right
              const zIndex = isCenter ? 20 : 10 - absOffset;

              return (
                <div
                  key={insight.id}
                  className="absolute transition-all duration-500 ease-out"
                  style={{
                    transform: `translateX(${translateX}px) scale(${scale})`,
                    opacity,
                    zIndex,
                    width: '240px',
                  }}
                >
                  <InsightCard insight={insight} />
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border-2 border-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all"
            >
              <ChevronRight size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border-2 border-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all"
            >
              <ChevronLeft size={24} />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {insights.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === i 
                    ? 'bg-gray-900 w-8' 
                    : 'bg-gray-300 w-2 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Horizontal Scroll */}
        <div 
          ref={scrollContainerRef}
          className="hidden md:flex gap-4 md:gap-6 overflow-x-auto pt-4 md:pt-8 pb-12 md:pb-16 px-4 md:px-12 lg:px-20 scrollbar-hide lg:justify-center w-full"
          style={{ scrollSnapType: "x mandatory", direction: "ltr" }}
        >
          {insights.map((insight) => (
            <div key={insight.id} style={{ scrollSnapAlign: "start" }}>
              <InsightCard insight={insight} />
            </div>
          ))}
        </div>
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

function InsightCard({ insight }: { insight: KitchenInsight }) {
  return (
    <article className="flex-shrink-0 w-[240px] md:w-[300px] bg-white rounded-[24px] md:rounded-[30px] rounded-tr-none shadow-lg hover:shadow-2xl transition-all duration-300 group h-full flex flex-col">
      {/* Image */}
      <div className="relative h-[200px] overflow-hidden rounded-tl-[30px] flex-shrink-0">
        <img 
          src={insight.image_url} 
          alt={insight.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-6 text-right flex flex-col flex-grow">
        <h3 className="text-lg font-semibold leading-snug mb-3 text-gray-900 font-hebrew line-clamp-2">
          {insight.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-6 font-hebrew line-clamp-3">
          {insight.description}
        </p>
        
        {/* Arrow Button - aligned left (using justify-end in RTL) */}
        <div className="flex justify-end mt-auto">
          <button className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-all hover:scale-110 group-hover:bg-black flex-shrink-0">
            <FiArrowDownLeft className="text-xl" />
          </button>
        </div>
      </div>
    </article>
  );
}
