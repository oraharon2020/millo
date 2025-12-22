export default function NiceToMillo() {
  return (
    <section className="container mx-auto px-6 lg:px-12 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center" dir="ltr">
        
        {/* Text Content - Left Side */}
        <div className="order-2 md:order-1 space-y-6">
          <h2 className="font-english text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.1] font-light tracking-wider text-left">
            NICE TO<br />MILLO YOU!
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed text-sm md:text-base text-right font-hebrew" dir="rtl">
            <p>
              לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג
              אליט לורם איפסום דולור סיט אמט, קונסקטורר
              אדיפיסינג אליט. סת אלמנקום ניסי נון ניבאה. דס
              איאקוליס וולופטה דיאם. וסטיבולום את דולור, קראס
              אגת לקטוס וואל אאוגו וסטיבולום סוליסי טידום
              בעליית, קונדימנטום קורוס בליקרה, נונסטי קלוברר
              בריקנה סטום, לפריקך תצסריק לרטי!
            </p>
          </div>
          
          {/* CTA Button */}
          <div className="flex items-center gap-4 pt-4" dir="rtl">
            <span className="font-hebrew text-base">קרא עוד אודותינו</span>
            <button className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: 'rotate(135deg)' }}>
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Image - Right Side */}
        <div className="order-1 md:order-2">
          <div 
            className="relative h-[350px] md:h-[450px] lg:h-[500px] bg-gradient-to-br from-amber-900 to-orange-800 overflow-hidden shadow-lg"
            style={{ borderRadius: '30px 0 30px 30px' }}
          >
            {/* Placeholder for about image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white/30 text-sm">תמונת מטבח מרכזית</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
