const insights = [
  {
    title: "טיפים לתכנון מטבח מושלם",
    description: "כל מה שצריך לדעת לפני שמתחילים בתכנון המטבח החדש שלכם",
    date: "15 דצמבר 2025",
    bgColor: "from-blue-50 to-indigo-50",
  },
  {
    title: "מגמות עיצוב מטבחים 2025",
    description: "הסגנונות והצבעים החמים ביותר בעיצוב מטבחים השנה",
    date: "10 דצמבר 2025",
    bgColor: "from-gray-800 to-gray-900",
    textColor: "text-white",
  },
  {
    title: "כיצד לבחור חומרים לארונות המטבח",
    description: "מדריך מקיף להבנת ההבדלים בין סוגי החומרים השונים",
    date: "5 דצמבר 2025",
    bgColor: "from-amber-50 to-orange-50",
  },
  {
    title: "תאורה נכונה למטבח",
    description: "טיפים לתכנון תאורה שתהפוך את המטבח שלכם למושלם",
    date: "1 דצמבר 2025",
    bgColor: "from-emerald-50 to-teal-50",
  },
];

export default function KitchenInsights() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="elegant-title text-4xl md:text-5xl">
          KITCHEN INSIGHTS
        </h2>
        <button className="w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all hover:scale-105 shadow-lg">
          <span className="text-2xl">→</span>
        </button>
      </div>

      <p className="text-gray-500 text-sm tracking-wider mb-16">
        כתבות, טיפים והמלצות לתכנון ועיצוב המטבח המושלם
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <article key={index} className="group cursor-pointer">
            <div className={`relative h-[280px] bg-gradient-to-br ${insight.bgColor} rounded-[25px] overflow-hidden mb-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}>
              {/* Blog image placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xs opacity-30 ${insight.textColor ? 'text-white' : 'text-gray-400'}`}>
                  Blog Image {index + 1}
                </span>
              </div>

              {/* Arrow button on hover */}
              <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                <span className="text-xl">→</span>
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-400 tracking-wide">{insight.date}</p>
              <h3 className="text-lg font-semibold leading-snug group-hover:text-gray-600 transition-colors">
                {insight.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {insight.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
