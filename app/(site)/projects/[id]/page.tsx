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
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

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

  const allImages = project ? [project.image_url, ...(project.images || [])].filter(Boolean) : [];

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
          <div className="relative w-full aspect-[4/3] rounded-[30px] overflow-hidden bg-gray-100 order-2 md:order-1">
            {project.image_url ? (
              <Image
                src={project.image_url}
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
          </div>

          {/* Left - Content */}
          <div className="flex flex-col justify-center text-right order-1 md:order-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-hebrew">
              {project.title}
            </h2>
            
            <p className="text-gray-700 text-base leading-relaxed mb-6 font-hebrew">
              {project.description}
            </p>

            {/* View Gallery Button */}
            {allImages.length > 1 && (
              <button
                onClick={() => openGallery(0)}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors self-start"
              >
                <Images size={20} />
                <span className="font-hebrew">צפה בגלריה ({allImages.length} תמונות)</span>
              </button>
            )}
          </div>
        </div>

        {/* Gallery Grid Below */}
        {allImages.length > 1 && (
          <div className="mb-16">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-right font-hebrew">תמונות נוספות</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {allImages.slice(1, 9).map((img, idx) => (
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
