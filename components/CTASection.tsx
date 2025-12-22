export default function CTASection() {
  return (
    <section className="container mx-auto px-6 lg:px-12">
      <div className="bg-black text-white py-8 md:py-10 px-6 md:px-12" style={{ borderRadius: '30px 30px 30px 30px' }}>
        <div className="max-w-4xl mx-auto">
          
          {/* Title */}
          <h2 className="font-hebrew text-lg md:text-xl lg:text-2xl text-center mb-6 md:mb-8 leading-relaxed whitespace-nowrap">
            אנחנו מזמינים אתכם <span className="font-bold">לפגישת ייעוץ חינם</span> השאירו פרטים
          </h2>
          
          {/* Form */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-start mb-6" dir="rtl">
            {/* Name Field */}
            <input 
              type="text" 
              placeholder="שם מלא (חובה)"
              className="w-full md:w-auto bg-transparent border border-white/40 rounded-full px-6 py-3 text-white placeholder-white/60 text-right font-hebrew text-sm focus:outline-none focus:border-white"
            />
            
            {/* Phone Field */}
            <input 
              type="tel" 
              placeholder="טלפון (חובה)"
              className="w-full md:w-auto bg-transparent border border-white/40 rounded-full px-6 py-3 text-white placeholder-white/60 text-right font-hebrew text-sm focus:outline-none focus:border-white"
            />
            
            {/* Email Field */}
            <input 
              type="email" 
              placeholder="מייל(חובה)"
              className="w-full md:w-auto bg-transparent border border-white/40 rounded-full px-6 py-3 text-white placeholder-white/60 text-right font-hebrew text-sm focus:outline-none focus:border-white"
            />
            
            {/* Submit Button */}
            <button className="w-full md:w-auto bg-white text-black px-10 py-3 rounded-full hover:bg-gray-100 transition-all font-hebrew text-sm font-medium">
              שלח פרטים
            </button>
          </div>
          
          {/* Checkbox - Aligned with form fields */}
          <div className="flex items-center gap-3 justify-start" dir="rtl">
            <input 
              type="checkbox" 
              id="marketing"
              className="w-4 h-4 rounded border-white/40 bg-transparent"
            />
            <label htmlFor="marketing" className="text-white/80 text-sm font-hebrew">
              מאשר/ת קבלת חומר פרסומי
            </label>
          </div>
          
        </div>
      </div>
    </section>
  );
}
