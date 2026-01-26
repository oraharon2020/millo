export default function ChooseYourDesign() {
  return (
    <section className="pt-10 pb-4 md:pt-12 md:pb-6 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Title */}
          <h2 className="font-english text-4xl md:text-6xl lg:text-7xl font-light tracking-wide text-gray-900 mb-4">
            CHOOSE YOUR DESIGN
          </h2>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-gray-300" />
            <div className="w-2 h-2 rotate-45 bg-gray-400" />
            <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-gray-300" />
          </div>
          
          {/* Hebrew Subtitle */}
          <p className="font-hebrew text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto" dir="rtl">
            הכירו את סגנונות העיצוב הייחודיים שלנו ובחרו את המראה המושלם עבורכם
          </p>
        </div>
      </div>
    </section>
  );
}
