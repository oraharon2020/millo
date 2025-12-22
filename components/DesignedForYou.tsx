const sizes = [
  {
    title: "גדול",
    range: "9+ מטר רץ",
    description: "מטבח מרווח בסטנדרט גבוה",
  },
  {
    title: "בינוני",
    range: "6-9 מטר רץ",
    description: "מטבח משפחתי פונקציונאלי",
  },
  {
    title: "קטן",
    range: "3-6 מטר רץ",
    description: "מטבח דירה סטנדרטי",
  },
];

export default function DesignedForYou() {
  return (
    <section className="bg-gray-50 py-20 md:py-28">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <h2 className="font-english text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.1] font-light italic text-center mb-4">
            DESIGNED TO FIT YOUR HOME
          </h2>
          <p className="text-center text-gray-600 text-base mb-16 font-hebrew">
            מהו גודל המטבח שאתם מחפשים?
          </p>

          {/* Size Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {sizes.map((size, index) => (
              <div key={index} className="text-center">
                {/* Arrows Icon - pointing outward */}
                <div className="flex justify-center mb-6">
                  <div className="grid grid-cols-2 gap-2 w-12 h-12">
                    {/* Top-left arrow */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                    {/* Top-right arrow */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 17L7 7M7 7H17M7 7V17" />
                    </svg>
                    {/* Bottom-left arrow */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7L17 17M17 17H7M17 17V7" />
                    </svg>
                    {/* Bottom-right arrow */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 7L7 17M7 17H17M7 17V7" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-2 font-hebrew">{size.title}</h3>
                <p className="text-lg font-medium mb-2 font-hebrew">{size.range}</p>
                <p className="text-gray-500 text-sm font-hebrew">{size.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button className="bg-white border-2 border-gray-200 text-gray-800 px-8 py-4 text-sm font-medium hover:border-gray-400 transition-all flex items-center gap-4 font-hebrew" style={{ borderRadius: '0 50px 50px 50px' }}>
              <span className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 rotate-[-45deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              הכנס מידה מדויקת
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
