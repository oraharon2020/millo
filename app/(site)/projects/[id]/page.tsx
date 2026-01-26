"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase, Project } from "@/lib/supabase";
import { ChevronLeft, ChevronRight, X, Images } from "lucide-react";
import CTASection from "@/components/CTASection";
import NotOnlyKitchens from "@/components/NotOnlyKitchens";

export default function ProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string);
    }
  }, [params.id]);

  const fetchProject = async (id: string) => {
    setLoading(true);
    try {
      console.log('Fetching project:', id);
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      console.log('Project fetched:', data, 'Error:', error);
      
      if (error) throw error;
      setProject(data);

      // Fetch related projects
      if (data?.category) {
        const { data: related } = await supabase
          .from('projects')
          .select('*')
          .eq('category', data.category)
          .neq('id', id)
          .limit(4);
        
        setRelatedProjects(related || []);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use thumbnail_url first, then image_url for backward compatibility
  const mainImage = project?.thumbnail_url || project?.image_url;
  const allImages: string[] = project ? [mainImage, ...(project.images || [])].filter((img): img is string => Boolean(img)) : [];

  const openGallery = (index: number = 0) => {
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };

  const closeGallery = () => {
    setGalleryOpen(false);
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-[4/3] bg-gray-200 rounded-[30px]" />
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-32 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">הפרויקט לא נמצא</h1>
          <Link href="/projects" className="text-gray-600 hover:text-gray-900">
            חזרה לפרויקטים
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-6 lg:px-12 pt-6 md:pt-10 pb-16">
        
        {/* Header Section - Compact */}
        <div className="bg-black text-white rounded-[30px] py-6 px-6 text-center mb-6">
          {/* Breadcrumbs */}
          <p className="text-xs text-gray-400 mb-2 font-hebrew">
            <Link href="/" className="hover:text-white transition-colors">בית</Link>
            <span className="mx-2">/</span>
            <Link href="/projects" className="hover:text-white transition-colors">פרויקטים</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{project.title}</span>
          </p>
          
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold font-hebrew leading-tight">
            {project.title}
          </h1>
        </div>

        {/* Two Column Layout - Image Right, Content Left */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Right - Main Image */}
          <button 
            onClick={() => openGallery(0)}
            className="relative w-full aspect-[4/3] rounded-[30px] overflow-hidden bg-gray-100 order-2 md:order-1 cursor-pointer hover:opacity-90 transition-opacity"
          >
            {mainImage ? (
              <Image
                src={mainImage}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                אין תמונה
              </div>
            )}
          </button>

          {/* Left - Content */}
          <div className="flex flex-col justify-center text-right order-1 md:order-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-hebrew">
              {project.title}
            </h2>
            
            <p className="text-gray-700 text-base leading-relaxed mb-6 font-hebrew">
              {project.description}
            </p>
          </div>
        </div>

        {/* Gallery Grid Below */}
        {allImages.length > 1 && (
          <div className="mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {allImages.slice(1, 9).map((img, idx) => img && (
                <button
                  key={idx}
                  onClick={() => openGallery(idx + 1)}
                  className="relative aspect-square rounded-[20px] overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={img}
                    alt={`${project.title} - תמונה ${idx + 2}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Modal */}
        {galleryOpen && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeGallery}
              className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X size={24} className="text-white" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 right-4 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {allImages.length}
            </div>

            {/* Previous Button */}
            <button
              onClick={goToPrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronLeft size={32} className="text-white" />
            </button>

            {/* Current Image */}
            <div className="relative w-full h-full max-w-6xl max-h-[80vh] mx-4">
              <Image
                src={allImages[currentImageIndex]}
                alt={`${project.title} - תמונה ${currentImageIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={goToNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronRight size={32} className="text-white" />
            </button>
          </div>
        )}

        {/* Technical Specifications */}
        <div className="mb-16">
          <div className="bg-gray-50 rounded-[30px] p-8 md:p-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-right font-hebrew">מפרט טכני</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" dir="rtl">
              {/* Spec Item - Style */}
              {project.category && (
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500 font-hebrew">סגנון</span>
                  </div>
                  <p className="text-lg font-medium text-gray-900 font-hebrew">{project.category}</p>
                </div>
              )}

              {/* Spec Item - Location */}
              {project.location && (
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500 font-hebrew">מיקום</span>
                  </div>
                  <p className="text-lg font-medium text-gray-900 font-hebrew">{project.location}</p>
                </div>
              )}

              {/* Spec Item - Materials */}
              {project.materials && (
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500 font-hebrew">חומרים</span>
                  </div>
                  <p className="text-lg font-medium text-gray-900 font-hebrew">{project.materials}</p>
                </div>
              )}

              {/* Spec Item - Countertop */}
              {project.countertop && (
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500 font-hebrew">משטח עבודה</span>
                  </div>
                  <p className="text-lg font-medium text-gray-900 font-hebrew">{project.countertop}</p>
                </div>
              )}

              {/* Spec Item - Handles */}
              {project.handles && (
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500 font-hebrew">ידיות</span>
                  </div>
                  <p className="text-lg font-medium text-gray-900 font-hebrew">{project.handles}</p>
                </div>
              )}

              {/* Spec Item - Appliances */}
              {project.appliances && (
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500 font-hebrew">מכשירי חשמל</span>
                  </div>
                  <p className="text-lg font-medium text-gray-900 font-hebrew">{project.appliances}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="border-t border-gray-100 pt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center font-hebrew">פרויקטים נוספים</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProjects.map((related) => (
                <Link
                  key={related.id}
                  href={`/projects/${related.id}`}
                  className="group block bg-white rounded-[30px] rounded-tr-none overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] bg-gray-100">
                    {related.image_url ? (
                      <Image
                        src={related.image_url}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200" />
                    )}
                  </div>
                  <div className="p-4 text-right">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 font-hebrew">
                      {related.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mb-16">
        <CTASection />
      </div>
      
      <NotOnlyKitchens />
    </main>
  );
}
