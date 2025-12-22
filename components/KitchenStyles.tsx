export default function KitchenStyles() {
  return (
    <section className="container mx-auto px-6 lg:px-12 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-end">
        
        {/* MODERN - Left */}
        <div className="flex flex-col">
          {/* Image */}
          <div className="relative h-[450px] md:h-[500px] overflow-hidden mb-6" style={{ borderRadius: '0 30px 30px 30px' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
            <span className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">MODERN</span>
          </div>
          
          {/* Text - Center */}
          <div className="text-center">
            <h3 className="font-english text-[2.5rem] md:text-[3rem] leading-[1.1] font-light tracking-wider">
              MODERN
            </h3>
            <p className="text-gray-600 text-sm mt-1">מטבח מודרני</p>
          </div>
        </div>

        {/* URBAN - Center */}
        <div className="flex flex-col">
          {/* Text - Top Center */}
          <div className="text-center mb-6">
            <h3 className="font-english text-[2.5rem] md:text-[3rem] leading-[1.1] font-light tracking-wider">
              URBAN
            </h3>
            <p className="text-gray-600 text-sm mt-1">מטבח אורבני</p>
          </div>
          
          {/* Image */}
          <div className="relative h-[450px] md:h-[520px] overflow-hidden" style={{ borderRadius: '0 30px 30px 30px' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-700" />
            <span className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">URBAN</span>
          </div>
        </div>

        {/* RUSTIC - Right */}
        <div className="flex flex-col">
          {/* Image */}
          <div className="relative h-[450px] md:h-[500px] overflow-hidden mb-6" style={{ borderRadius: '0 30px 30px 30px' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-amber-300" />
            <span className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">RUSTIC</span>
          </div>
          
          {/* Text - Center */}
          <div className="text-center">
            <h3 className="font-english text-[2.5rem] md:text-[3rem] leading-[1.1] font-light tracking-wider">
              RUSTIC
            </h3>
            <p className="text-gray-600 text-sm mt-1">מטבח כפרי</p>
          </div>
        </div>

      </div>
    </section>
  );
}
