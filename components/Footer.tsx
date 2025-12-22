import Link from "next/link";
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-serif font-light tracking-widest mb-4">MILLO</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              אנחנו מתמחים בעיצוב וייצור מטבחים מותאמים אישית שמשלבים פונקציונליות ואסתטיקה ברמה הגבוהה ביותר.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaInstagram className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">קישורים</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-black transition-colors">
                  בית
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-600 hover:text-black transition-colors">
                  פרויקטים
                </Link>
              </li>
              <li>
                <Link href="/kitchen-types" className="text-gray-600 hover:text-black transition-colors">
                  סוגי מטבחים
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-black transition-colors">
                  בלוג
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">צור קשר</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-600">
                <FaPhone className="text-sm" />
                <span>050-123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <FaEnvelope className="text-sm" />
                <span>info@millo.co.il</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© 2025 MILLO. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
}
