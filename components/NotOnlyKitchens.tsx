const projects = [
  {
    title: "נגרות מסדרון",
    bgColor: "from-amber-50 to-orange-50",
  },
  {
    title: "נגרות אמבטיה",
    bgColor: "from-gray-100 to-gray-200",
  },
  {
    title: "ארונות בהתאמה אישית",
    bgColor: "from-amber-100 to-amber-200",
  },
  {
    title: "חדרי שינה",
    bgColor: "from-rose-50 to-pink-50",
  },
];

export default function NotOnlyKitchens() {
  return (
    <section className="container mx-auto px-6 lg:px-12 py-16 md:py-24">
      {/* Header Row - Title Left (in LTR), Description Right */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-12 md:mb-16 gap-6" dir="ltr">
        {/* Title - Left side */}
        <h2 className="font-english text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.1] font-light tracking-wider text-left">
          BUT NOT ONLY KITCHENS
        </h2>
        
        {/* Description - Right side */}
        <p className="font-hebrew text-gray-600 text-sm md:text-base leading-relaxed text-right max-w-md" dir="rtl">
          גלו את מגוון פתרונות הנגרות המתקדמים שלנו - ארונות בהתאמה
          אישית, ארונות אמבטיה, חדרי שינה, נגרות לעסקים ועוד. השראה,
          איכות ועיצובים שיקפיצו כל חלל בבית או בעסק לרמה חדשה!
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {projects.map((project, index) => (
          <div 
            key={index} 
            className="group cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            style={{ borderRadius: '30px 0 30px 30px' }}
          >
            {/* Image */}
            <div 
              className={`relative w-full h-[180px] md:h-[220px] bg-gradient-to-br ${project.bgColor} overflow-hidden`}
              style={{ borderRadius: '30px 0 0 0' }}
            >
              {/* Project image placeholder */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <span className="text-gray-400 text-xs opacity-50 text-center">{project.title}</span>
              </div>
            </div>
            
            {/* Content - Inside card */}
            <div className="p-4 flex flex-col items-end">
              {/* Title - Right aligned */}
              <h3 className="font-hebrew text-right text-base md:text-lg font-medium mb-4 w-full">
                {project.title}
              </h3>
              
              {/* Arrow Button - Right aligned, arrow pointing down-left */}
              <button className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: 'rotate(135deg)' }}>
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
