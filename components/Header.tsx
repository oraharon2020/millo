"use client";

import Link from "next/link";
import { useState } from "react";
import { FaFacebook, FaInstagram, FaSearch, FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Top Banner */}
      <div className="px-4 py-3">
        <div className="bg-black text-white text-center py-3 px-4 text-sm font-light tracking-wide rounded-full max-w-[1400px] mx-auto">
          לחזום פגישת ייעוץ ללא עלות
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 bg-white z-50 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between py-6">
            {/* Search Icon - Left */}
            <button className="p-2 hover:opacity-60 transition-opacity" aria-label="חיפוש">
              <FaSearch className="text-lg" />
            </button>

            {/* Logo - Center */}
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img 
                src="/logo-millo.webp" 
                alt="MILLO" 
                className="h-12 md:h-14 w-auto"
              />
            </Link>

            {/* Social Icons - Right (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:opacity-60 transition-opacity"
                aria-label="Facebook"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:opacity-60 transition-opacity"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="תפריט"
            >
              {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className={`${isMenuOpen ? "block" : "hidden"} md:block pb-6`}>
            <ul className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 text-[15px] font-light">
              <li>
                <Link href="/" className="hover:opacity-60 transition-opacity">
                  בית
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:opacity-60 transition-opacity">
                  פרויקטים
                </Link>
              </li>
              <li>
                <Link href="/kitchen-types" className="hover:opacity-60 transition-opacity">
                  סוגי מטבחים
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:opacity-60 transition-opacity">
                  בלוג
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:opacity-60 transition-opacity">
                  יצירת קשר
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
