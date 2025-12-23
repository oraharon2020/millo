"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase, KitchenStyle } from "@/lib/supabase";
import { ChevronLeft, ChevronRight, ArrowDownLeft } from "lucide-react";
import CTASection from "@/components/CTASection";
import NotOnlyKitchens from "@/components/NotOnlyKitchens";

export default function KitchenTypesPage() {
  const [kitchenTypes, setKitchenTypes] = useState<KitchenStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchKitchenTypes();
  }, []);

  const fetchKitchenTypes = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('kitchen_styles')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setKitchenTypes(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching kitchen types:', error);
    } finally {
      setLoading(false);
    }
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
                בית<span className="mx-2">/</span><span className="text-white">סוגי מטבחים</span>
              </p>

              <h1 className="text-4xl md:text-5xl font-bold font-hebrew mb-2 leading-none">
                סוגי מטבחים
              </h1>

              <p className="text-gray-400 font-hebrew">
                <span className="text-white font-medium">{totalCount}</span> סוגים
              </p>
            </div>

            {/* Left - Description */}
            <div className="max-w-md text-right">
              <p className="text-gray-300 leading-relaxed text-sm font-hebrew">
                גלו את מגוון סגנונות המטבח שאנו מציעים - מעיצוב מודרני מינימליסטי ועד כפרי חם ומזמין.
                כל סגנון משקף גישה ייחודית לעיצוב, תוך התאמה מלאה לאופי ולצרכים של הלקוח.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Kitchen Types Grid Section */}
      <section className="container mx-auto px-6 lg:px-12 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-english text-3xl md:text-4xl font-light">
            KITCHEN STYLES
          </h2>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-[30px] aspect-square mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : kitchenTypes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">אין סוגי מטבחים להצגה</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {kitchenTypes.map((type) => (
              <KitchenTypeCard key={type.id} kitchenType={type} />
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

function KitchenTypeCard({ kitchenType }: { kitchenType: KitchenStyle }) {
  return (
    <Link href={kitchenType.link_url || '#'} className="group block h-full">
      <div className="bg-white rounded-[30px] rounded-tr-none overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full bg-gray-100">
          {kitchenType.image_url ? (
            <Image
              src={kitchenType.image_url}
              alt={kitchenType.name_he}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              style={{ objectPosition: kitchenType.image_position || 'center' }}
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
            <h3 className="font-bold text-xl text-gray-900 mb-1 leading-tight font-hebrew">
              {kitchenType.name_he}
            </h3>
            <p className="text-gray-500 text-sm font-english uppercase">
              {kitchenType.name_en}
            </p>
          </div>

          {/* Arrow Button - Positioned at bottom left (justify-end in RTL) */}
          <div className="mt-auto flex justify-end">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-gray-800 transition-colors">
              <ArrowDownLeft size={24} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
