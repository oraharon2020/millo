import { getKitchenInsights } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CTASection from "@/components/CTASection";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 60;

// Generate static params for common blog posts
export async function generateStaticParams() {
  const insights = await getKitchenInsights(20);
  return insights.map((insight) => ({
    id: insight.id,
  }));
}

async function getInsight(id: string) {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data, error } = await supabase
    .from('kitchen_insights')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;
  const insight = await getInsight(id);

  if (!insight) {
    notFound();
  }

  // Format date
  const formattedDate = new Date(insight.created_at).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="container mx-auto px-6 lg:px-12 pt-6 md:pt-10">
        <div className="bg-black text-white py-10 md:py-14 px-8 md:px-12 rounded-[30px] rounded-tr-none">
          <div className="flex flex-col text-right">
            {/* Breadcrumb */}
            <p className="text-sm text-gray-400 mb-3">
              <Link href="/" className="hover:text-white transition-colors">בית</Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-white transition-colors">בלוג</Link>
              <span className="mx-2">/</span>
              <span className="text-white">{insight.title}</span>
            </p>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-hebrew mb-4 leading-tight">
              {insight.title}
            </h1>

            <p className="text-gray-400 font-hebrew">
              {formattedDate}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-6 lg:px-12 py-10 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          {insight.image_url && (
            <div className="relative h-[300px] md:h-[450px] rounded-[30px] overflow-hidden mb-10">
              <Image
                src={insight.image_url}
                alt={insight.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Article Content */}
          <article className="prose prose-lg max-w-none text-right" dir="rtl">
            {/* Description/Summary */}
            {insight.description && (
              <p className="text-xl text-gray-600 leading-relaxed mb-8 font-hebrew">
                {insight.description}
              </p>
            )}

            {/* Main Content */}
            {insight.content ? (
              <div 
                className="text-gray-700 leading-relaxed font-hebrew"
                dangerouslySetInnerHTML={{ __html: insight.content }}
              />
            ) : (
              <div className="text-gray-700 leading-relaxed font-hebrew">
                <p>
                  {insight.description || 'תוכן המאמר יתווסף בקרוב...'}
                </p>
              </div>
            )}
          </article>

          {/* Back to Blog */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-hebrew"
            >
              <ArrowRight size={20} />
              <span>חזרה לבלוג</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </main>
  );
}
