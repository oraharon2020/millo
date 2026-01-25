import { HeroSection } from "@/lib/supabase";
import Image from "next/image";

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

interface HeroProps {
  data?: HeroSection | null;
}

export default function Hero({ data }: HeroProps) {
  const hero = data || defaultHero;

  // Split title for display
  const titleParts = hero.title_en.split(',');

  return (
    <section className="w-full px-3 overflow-hidden max-w-[100vw]">
      {/* Full Width Video/Image Banner */}
      <div className="relative w-full h-[450px] md:h-[650px] lg:h-[850px] overflow-hidden" style={{ borderRadius: '0 30px 30px 30px' }}>
        {hero.video_url ? (
          <video 
            key={hero.video_url}
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={hero.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : hero.image_url ? (
          <Image 
            key={hero.image_url}
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
    </section>
  );
}
