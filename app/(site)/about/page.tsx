'use client'

import CTASection from '@/components/CTASection'
import NotOnlyKitchens from '@/components/NotOnlyKitchens'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="container mx-auto px-6 lg:px-12 pt-6 md:pt-10">
        <div className="bg-black text-white py-12 md:py-16 px-8 md:px-16 rounded-[30px] rounded-tr-none">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumb */}
            <p className="text-sm text-gray-400 mb-6">
              בית<span className="mx-2">/</span><span className="text-white">אודות</span>
            </p>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl font-bold font-hebrew mb-4 leading-tight">
              Millo
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-hebrew mb-6">
              מטבחים ופרויקטים
            </p>

            {/* Intro Description */}
            <p className="text-gray-400 leading-relaxed text-base md:text-lg font-hebrew max-w-2xl mx-auto">
              סטודיו לתכנון, נגרות ופרויקטים בהתאמה אישית.
              <br />
              החברה פועלת מתוך תפיסה הוליסטית, הרואה את המטבח כחלק ממערכת אדריכלית שלמה – ולא כאלמנט עצמאי.
            </p>
          </div>
        </div>
      </section>

      {/* About Intro Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed font-hebrew">
              מאחורי Millo עומדת שותפות בין אנשי מקצוע בעלי ניסיון מצטבר רב בעולמות הנגרות, הפרויקטים והעיצוב, יחד עם מעצב פנים בעל ניסיון עשיר, המתמחה בתכנון מדויק ובהובלת פרויקטים מורכבים.
            </p>
            <p className="text-gray-600 text-lg mt-4 font-hebrew">
              העבודה מתבצעת בקצב מדוד, תוך שליטה מלאה בפרטים ובתהליך.
            </p>
          </div>
        </div>
      </section>

      {/* Architectural Language Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="order-2 md:order-1">
              <div className="inline-block bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-hebrew mb-6">
                הגישה שלנו
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-hebrew mb-6 leading-tight">
                שפה אדריכלית אחידה
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed font-hebrew mb-6">
                ב־Millo כל פרויקט נבנה סביב שפה אחת ברורה.
                קו עיצובי רציף, מדויק ושקט, המלווה את הבית כולו.
              </p>
              <p className="text-gray-600 leading-relaxed font-hebrew">
                היכולת לייצר אחידות בין חללים מאפשרת תכנון וביצוע של מערך שלם.
                המעבר בין החללים אינו מורגש – החומרים, הפרופורציות והגימורים ממשיכים זה את זה באופן טבעי.
              </p>
            </div>

            {/* Services Grid */}
            <div className="order-1 md:order-2">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🏠', title: 'מטבחים' },
                  { icon: '🛏️', title: 'חדרי שינה' },
                  { icon: '🚪', title: 'מסדרונות' },
                  { icon: '🚿', title: 'חדרי אמבטיה' },
                  { icon: '👔', title: 'חדרי ארונות' },
                  { icon: '🪵', title: 'נגרות מותאמת' },
                ].map((service, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-6 rounded-2xl text-center hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-3xl mb-3">{service.icon}</div>
                    <p className="font-hebrew font-medium text-gray-800">{service.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Projects Section */}
      <section className="py-16 md:py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-white/10 text-white px-4 py-2 rounded-full text-sm font-hebrew mb-6">
                התמחות
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-hebrew mb-6 leading-tight">
                פרויקטים בהתאמה אישית מלאה
              </h2>
            </div>
            
            <div className="space-y-6 text-center">
              <p className="text-gray-300 text-lg leading-relaxed font-hebrew">
                Millo מתמחה בפרויקטים הדורשים רמת התאמה, גמישות ודיוק שאינם מתאימים למסגרות ייצור סדרתיות.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed font-hebrew">
                אנו מלווים פרויקטים ייחודיים, מורכבים ובלתי שגרתיים — כאלה הדורשים חשיבה פרטנית, פתרונות מותאמים ושליטה מלאה בתהליך.
              </p>
              <div className="pt-6">
                <p className="text-gray-400 text-base font-hebrew border-t border-gray-700 pt-6">
                  גישה זו מאפשרת לנו לבצע עבודות שחברות גדולות בוחרות לעיתים שלא לקחת על עצמן,
                  ולספק מענה מדויק לפרויקטים שבהם אין מקום לפשרות או לפתרונות מדף.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Private Carpentry Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image/Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-[30px] rounded-tr-none aspect-square flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold font-hebrew text-gray-800 mb-2">נגרות פרטית</h3>
                  <p className="text-gray-500 font-hebrew">ללא קווי ייצור קבועים</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="inline-block bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-hebrew mb-6">
                הייחודיות שלנו
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-hebrew mb-6 leading-tight">
                נגרות פרטית. שליטה מלאה.
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed font-hebrew mb-6">
                Millo פועלת בנגרות פרטית, ללא קווי ייצור קבועים וללא תבניות מוכנות.
                כל פרויקט מתוכנן ומיוצר במיוחד עבור החלל, האדריכלות והלקוח.
              </p>
              <p className="text-gray-600 leading-relaxed font-hebrew">
                הבחירה בחומרי גלם, מערכות פרזול והגימורים נעשית בקפידה,
                מתוך מחויבות לדיוק, עמידות ואסתטיקה על־זמנית.
              </p>

              {/* Features */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  'חומרי גלם מובחרים',
                  'מערכות פרזול איכותיות',
                  'גימורים מדויקים',
                  'אסתטיקה על־זמנית'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                    <span className="text-gray-700 font-hebrew text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-hebrew mb-6">
              התהליך
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-hebrew mb-6 leading-tight">
              תהליך שקט ומדויק
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed font-hebrew mb-8">
              העבודה מתבצעת בליווי מלא, בתהליך ברור, מסודר ונטול רעש.
              שיח מקצועי, זמני ביצוע מדויקים, ורמת גימור שאינה דורשת הסברים.
            </p>

            {/* Process Steps */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {[
                { step: '01', title: 'ליווי מלא', desc: 'מהפגישה הראשונה ועד ההתקנה' },
                { step: '02', title: 'תהליך ברור', desc: 'שקיפות מלאה בכל שלב' },
                { step: '03', title: 'גימור מושלם', desc: 'תוצאות שמדברות בעד עצמן' },
              ].map((item, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm">
                  <div className="text-4xl font-bold text-gray-200 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold font-hebrew text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 font-hebrew text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Tagline */}
      <section className="py-16 md:py-20 bg-black text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold font-hebrew mb-4">
              Millo
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 font-hebrew mb-2">
              מטבחים ופרויקטים
            </p>
            <p className="text-gray-500 font-hebrew">
              נגרות אדריכלית בהתאמה אישית.
            </p>
          </div>
        </div>
      </section>

      <div className="mb-10">
        <CTASection />
      </div>
      
      <NotOnlyKitchens />
    </div>
  )
}
