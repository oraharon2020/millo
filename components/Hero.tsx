export default function Hero() {
  return (
    <section className="w-full">
      {/* Full Width Video Banner */}
      <div className="relative w-full h-[600px] md:h-[750px] lg:h-[850px] overflow-hidden" style={{ borderRadius: '0 50px 50px 50px' }}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/%D7%A1%D7%A8%D7%98%D7%95%D7%9F-%D7%9C%D7%A8%D7%95%D7%97%D7%91.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="elegant-title text-4xl md:text-6xl lg:text-7xl mb-6 drop-shadow-2xl">
              TAILORED DESIGN,<br />JUST FOR YOU
            </h1>
            <p className="text-lg md:text-xl font-light drop-shadow-lg max-w-2xl mx-auto">
              עיצוב מותאם אישית שמשלב את הצרכים שלכם עם האסתטיקה המושלמת
            </p>
          </div>
        </div>
      </div>

      {/* Content Section Below Video */}
      <div className="container mx-auto px-6 lg:px-12 py-16 md:py-24">
        
        {/* Top Row - Text + CTA Left, Title Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-12">
          {/* Left - Description + CTA */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <p className="text-gray-600 text-sm leading-relaxed mb-6 text-right">
              עיצוב מטבח בנגרות אישית, המשלב פונקציונליות וסטנדרט אסתטי גבוה. הזמינו<br />
              פגישת ייעוץ אישית להתאמה מושלמת עבור הבית שלכם.
            </p>
            
            <div className="flex justify-start">
              <button className="bg-black text-white px-8 py-4 text-sm font-medium hover:bg-gray-800 transition-all flex items-center gap-3" style={{ borderRadius: '50px 0 50px 50px' }}>
                <svg className="w-4 h-4 rotate-[-45deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                לתאום פגישת ייעוץ ללא עלות
              </button>
            </div>
          </div>
          
          {/* Right - Title */}
          <div className="order-1 lg:order-2 text-left">
            <h2 className="font-english text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.1] font-light italic">
              Tailored design,<br />just for you
            </h2>
          </div>
        </div>

        {/* Bottom Row - Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Left - Craft Your Kitchen + Small Image */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            
            {/* Craft Your Kitchen Title */}
            <h3 className="font-english text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] leading-[1.1] font-light italic text-left">
              Craft<br />Your<br />Kitchen
            </h3>
            
            {/* Small Faucet Image */}
            <div className="relative h-[220px] md:h-[260px] rounded-[25px] overflow-hidden flex-grow">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
              <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">תמונת ברז</span>
            </div>
            
            {/* View Projects Link */}
            <div className="flex items-center gap-3 justify-start">
              <span className="text-sm text-gray-700">הצצה לפרויקטים</span>
              <button className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all">
                <span className="text-lg">←</span>
              </button>
            </div>
          </div>

          {/* Right - Main Kitchen Image */}
          <div className="relative h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden rounded-[30px] order-1 lg:order-2">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
            <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">תמונת מטבח ראשית</span>
          </div>
          
        </div>
      </div>
    </section>
  );
}
