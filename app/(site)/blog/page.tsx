"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase, KitchenInsight } from "@/lib/supabase";
import { ChevronLeft, ChevronRight, ArrowDownLeft } from "lucide-react";
import CTASection from "@/components/CTASection";
import NotOnlyKitchens from "@/components/NotOnlyKitchens";

export default function BlogPage() {
  const [insights, setInsights] = useState<KitchenInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const insightsPerPage = 8;

  useEffect(() => {
    fetchInsights();
  }, [currentPage]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      // Get total count
      const { count } = await supabase
        .from('kitchen_insights')
        .select('*', { count: 'exact', head: true });
      
      setTotalCount(count || 0);

      // Get paginated insights
      const from = (currentPage - 1) * insightsPerPage;
      const to = from + insightsPerPage - 1;

      const { data, error } = await supabase
        .from('kitchen_insights')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      setInsights(data || []);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / insightsPerPage);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % insights.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + insights.length) % insights.length);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="container mx-auto px-6 lg:px-12 pt-6 md:pt-10">
        <div className="bg-black text-white py-10 md:py-14 px-8 md:px-12 rounded-[30px] rounded-tr-none">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            
            {/* Right - Breadcrumb & Title */}
            <div className="w-full md:w-auto flex flex-col text-right">
              <p className="text-sm text-gray-400 mb-3">
                בית<span className="mx-2">/</span><span className="text-white">בלוג</span>
              </p>

              <h1 className="text-4xl md:text-5xl font-bold font-hebrew mb-2 leading-none">
                בלוג
              </h1>

              <p className="text-gray-400 font-hebrew">
                <span className="text-white font-medium">{totalCount}</span> מאמרים
              </p>
            </div>

            {/* Left - Description */}
            <div className="max-w-md text-right">
              <p className="text-gray-300 leading-relaxed text-sm font-hebrew">
                טיפים, השראה וידע מקצועי בעולם עיצוב המטבח. מדריכים מעשיים, טרנדים עדכניים
                ועצות מומחים לתכנון ועיצוב המטבח המושלם עבורכם.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="container mx-auto px-6 lg:px-12 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-english text-3xl md:text-4xl font-light">
            OUR BLOG
          </h2>
          
          {/* Pagination Arrows */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-[30px] aspect-square mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : insights.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">אין מאמרים להצגה</p>
          </div>
        ) : (
          <>
            {/* Mobile Carousel */}
            <div className="md:hidden relative overflow-hidden py-10">
              {/* Carousel Container */}
              <div className="relative h-[500px] flex items-center justify-center">
                {insights.map((insight, index) => {
                  const offset = index - currentSlide;
                  const absOffset = Math.abs(offset);
                  
                  // Only show cards within 2 positions of current
                  if (absOffset > 2) return null;
                  
                  const isCenter = offset === 0;
                  const scale = isCenter ? 1 : 0.8;
                  const opacity = isCenter ? 1 : 0.4;
                  const translateX = -offset * 340; // Negative for RTL - next card comes from right
                  const zIndex = isCenter ? 20 : 10 - absOffset;

                  return (
                    <div
                      key={insight.id}
                      className="absolute transition-all duration-500 ease-out"
                      style={{
                        transform: `translateX(${translateX}px) scale(${scale})`,
                        opacity,
                        zIndex,
                        width: '320px',
                      }}
                    >
                      <BlogCard insight={insight} isCenter={isCenter} />
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

            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
              {insights.map((insight) => (
                <BlogCard key={insight.id} insight={insight} isCenter={true} />
              ))}
            </div>
          </>
        )}

        {/* Page indicator */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentPage === i + 1 
                    ? 'bg-gray-900 w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </section>
      
      <div className="mb-16">
        <CTASection />
      </div>
      
      <NotOnlyKitchens />
    </main>
  );
}

function BlogCard({ insight, isCenter = false }: { insight: KitchenInsight; isCenter?: boolean }) {
  return (
    <Link href={`/blog/${insight.id}`} className={`group block h-full ${isCenter ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className="bg-white rounded-[30px] rounded-tr-none overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full bg-gray-100">
          {insight.image_url ? (
            <Image
              src={insight.image_url}
              alt={insight.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              אין תמונה
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="text-right mb-4">
            <h3 className="font-bold text-xl text-gray-900 mb-1 leading-tight font-hebrew line-clamp-2">
              {insight.title}
            </h3>
            <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
              {insight.category && (
                <span className="font-hebrew">{insight.category}</span>
              )}
              {insight.reading_time && (
                <>
                  <span>•</span>
                  <span className="font-hebrew">{insight.reading_time}</span>
                </>
              )}
            </div>
          </div>

          {/* Arrow Button - Positioned at bottom left (justify-end in RTL) */}
          <div className="mt-auto flex justify-end">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-gray-800 transition-colors flex-shrink-0">
              <ArrowDownLeft size={24} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
