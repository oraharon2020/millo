"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Send, Facebook, Instagram } from "lucide-react";
import { supabase } from "@/lib/supabase";
import CTASection from "@/components/CTASection";
import NotOnlyKitchens from "@/components/NotOnlyKitchens";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [settings, setSettings] = useState({
    phone: "052-1234567",
    email: "info@millo.co.il",
    address: "תל אביב, ישראל",
    facebook: "",
    instagram: ""
  });
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  // Fetch settings from Supabase
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase
          .from('settings')
          .select('phone, email, address, facebook, instagram')
          .single()
        
        if (data) {
          setSettings({
            phone: data.phone || "052-1234567",
            email: data.email || "info@millo.co.il",
            address: data.address || "תל אביב, ישראל",
            facebook: data.facebook || "",
            instagram: data.instagram || ""
          })
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }

    fetchSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      alert('נא למלא שם וטלפון');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('contacts')
        .insert([{
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          message: formData.message || "פנייה מדף יצירת קשר",
          status: 'new'
        }]);
      
      if (error) throw error;
      
      setSubmitted(true);
      setFormData({ name: "", phone: "", email: "", message: "" });
      
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting contact:', error);
      alert('שגיאה בשליחת הפנייה, נסה שוב');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="container mx-auto px-6 lg:px-12 pt-6 md:pt-10">
        <div className="bg-black text-white py-10 md:py-14 px-8 md:px-12 rounded-[30px] rounded-tr-none">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            
            {/* Right - Breadcrumb & Title */}
            <div className="w-full md:w-auto flex flex-col text-right">
              <p className="text-sm text-gray-400 mb-3">
                בית<span className="mx-2">/</span><span className="text-white">צור קשר</span>
              </p>

              <h1 className="text-4xl md:text-5xl font-bold font-hebrew mb-2 leading-none">
                צור קשר
              </h1>

              <p className="text-gray-400 font-hebrew text-sm mt-2">
                נשמח לענות על כל שאלה
              </p>
            </div>

            {/* Left - Description */}
            <div className="max-w-md text-right">
              <p className="text-gray-300 leading-relaxed text-sm font-hebrew">
                יש לכם חזון למטבח? רעיון? שאלה? אנחנו כאן בשבילכם. צרו איתנו קשר והבה נתכנן ביחד
                את המטבח המושלם עבורכם - כזה שמשקף את הסגנון והצרכים שלכם בדיוק.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <div className="bg-white rounded-[30px] p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right font-hebrew">
              שלחו לנו הודעה
            </h2>
            
            {submitted && (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 mb-6 text-right">
                <p className="font-hebrew">תודה! ההודעה נשלחה בהצלחה. ניצור קשר בהקדם.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew">
                  שם מלא *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 text-right"
                  placeholder="הזן שם מלא"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew">
                  טלפון *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 text-right"
                  placeholder="050-1234567"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew">
                  אימייל
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 text-right"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew">
                  הודעה
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none text-right"
                  placeholder="ספרו לנו על הפרויקט שלכם..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-hebrew"
              >
                <Send size={20} />
                <span>{loading ? 'שולח...' : 'שלח הודעה'}</span>
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-[30px] p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right font-hebrew">
                פרטי התקשרות
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4 text-right" dir="rtl">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 font-hebrew">טלפון</h3>
                    <a href={`tel:${settings.phone}`} className="text-gray-600 hover:text-gray-900 transition-colors">
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-right" dir="rtl">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 font-hebrew">אימייל</h3>
                    <a href={`mailto:${settings.email}`} className="text-gray-600 hover:text-gray-900 transition-colors">
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-right" dir="rtl">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 font-hebrew">כתובת</h3>
                    <p className="text-gray-600 font-hebrew">
                      {settings.address}
                    </p>
                  </div>
                </div>

                {/* Social Media */}
                {(settings.facebook || settings.instagram) && (
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-3 text-right font-hebrew">עקבו אחרינו</h3>
                    <div className="flex gap-3 justify-end">
                      {settings.facebook && (
                        <a
                          href={settings.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <Facebook size={18} className="text-gray-700" />
                        </a>
                      )}
                      {settings.instagram && (
                        <a
                          href={settings.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <Instagram size={18} className="text-gray-700" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-[30px] p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right font-hebrew">
                שעות פעילות
              </h2>
              <div className="space-y-2 text-right font-hebrew text-gray-600">
                <p>ראשון - חמישי: 09:00 - 18:00</p>
                <p>שישי: 09:00 - 13:00</p>
                <p>שבת: סגור</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="mb-16">
        <CTASection />
      </div>
      
      <NotOnlyKitchens />
    </main>
  );
}
