"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase, Project, ProjectCategory } from "@/lib/supabase";
import { ChevronLeft, ChevronRight, ArrowDownLeft } from "lucide-react";
import CTASection from "@/components/CTASection";
import NotOnlyKitchens from "@/components/NotOnlyKitchens";

// Loading fallback for Suspense
function ProjectsLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gray-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <h1 className="font-english text-5xl md:text-7xl font-light">פרויקטים</h1>
        </div>
      </section>
      <section className="container mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-[30px] aspect-square mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsLoading />}>
      <ProjectsContent />
    </Suspense>
  );
}

function ProjectsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 8;

  // Read category from URL on initial load
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    fetchCategories();
  }, [searchParams]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('project_categories')
      .select('*')
      .eq('is_active', true)
      .order('order_index');
    setCategories(data || []);
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      // Build base query
      let countQuery = supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });
      
      let dataQuery = supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      // Add category filter if selected
      if (selectedCategory) {
        countQuery = countQuery.eq('category_id', selectedCategory);
        dataQuery = dataQuery.eq('category_id', selectedCategory);
      }

      // Get total count
      const { count } = await countQuery;
      setTotalCount(count || 0);

      // Get paginated projects
      const from = (currentPage - 1) * projectsPerPage;
      const to = from + projectsPerPage - 1;
      
      const { data, error } = await dataQuery.range(from, to);

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when category changes
    fetchProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedCategory]);

  const totalPages = Math.ceil(totalCount / projectsPerPage);

  return (
    <main className="min-h-screen bg-gray-50">
{/* Hero Section */}
<section className="container mx-auto px-6 lg:px-12 pt-6 md:pt-10">
  <div className="bg-black text-white py-10 md:py-14 px-8 md:px-12 rounded-[30px] rounded-tr-none">
<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
    
{/* Right - Breadcrumb & Title */}
<div className="w-full md:w-auto flex flex-col text-right">
  <p className="text-sm text-gray-400 mb-3">
    בית<span className="mx-2">/</span><span className="text-white">פרויקטים</span>
  </p>

  <h1 className="text-4xl md:text-5xl font-bold font-hebrew mb-2 leading-none">
    פרויקטים
  </h1>

  <p className="text-gray-400 font-hebrew">
    <span className="text-white font-medium">{totalCount}</span> פרויקטים
  </p>
</div>

  {/* Left - Description */}
  <div className="max-w-md text-right">
    <p className="text-gray-300 leading-relaxed text-sm font-hebrew">
      כאן תוכלו לראות מטבחים שתכננו ועיצבנו בהתאמה אישית מלאה - מהרעיון הראשוני, דרך בחירת החומרים
      והפרטים הקטנים, ועד ליצירת חלל מדויק שמשלב פונקציונליות, אסתטיקה ואופי ייחודי לכל לקוח.
    </p>
  </div>
</div>
  </div>
</section>
      {/* Projects Grid Section */}
      <section className="container mx-auto px-6 lg:px-12 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="font-english text-3xl md:text-4xl font-light">
            OUR PROJECTS
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

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8" dir="rtl">
          <button
            onClick={() => {
              setSelectedCategory("");
              router.push('/projects');
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === "" 
                ? "bg-black text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            הכל
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                router.push(`/projects?category=${cat.id}`);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.id 
                  ? "bg-black text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
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
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">אין פרויקטים להצגה</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
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

function ProjectCard({ project }: { project: Project }) {
  // Use thumbnail_url, then first image from images array, then image_url as fallback
  const imageUrl = project.thumbnail_url || (project.images && project.images[0]) || project.image_url;
  
  return (
    <Link href={`/projects/${project.id}`} className="group block h-full">
      <div className="bg-white rounded-[30px] rounded-tr-none overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={project.title}
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
            <h3 className="font-bold text-xl text-gray-900 mb-1 leading-tight font-hebrew">
              {project.title}
            </h3>
            {project.location && (
              <p className="text-gray-500 text-base font-hebrew">{project.location}</p>
            )}
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
