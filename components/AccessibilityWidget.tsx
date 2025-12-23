'use client'

import { useState, useEffect } from 'react'
import { Accessibility, X, Type, Contrast, ZoomIn, ZoomOut, MousePointer } from 'lucide-react'

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)
  const [largePointer, setLargePointer] = useState(false)
  const [underlineLinks, setUnderlineLinks] = useState(false)

  useEffect(() => {
    // Load saved preferences
    const savedFontSize = localStorage.getItem('accessibility-fontSize')
    const savedContrast = localStorage.getItem('accessibility-contrast')
    const savedPointer = localStorage.getItem('accessibility-pointer')
    const savedLinks = localStorage.getItem('accessibility-links')

    if (savedFontSize) {
      const size = parseInt(savedFontSize)
      setFontSize(size)
      document.documentElement.style.fontSize = `${size}%`
    }
    if (savedContrast === 'true') {
      setHighContrast(true)
      document.documentElement.classList.add('high-contrast')
    }
    if (savedPointer === 'true') {
      setLargePointer(true)
      document.body.classList.add('large-pointer')
    }
    if (savedLinks === 'true') {
      setUnderlineLinks(true)
      document.body.classList.add('underline-links')
    }
  }, [])

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 10, 150)
    setFontSize(newSize)
    document.documentElement.style.fontSize = `${newSize}%`
    localStorage.setItem('accessibility-fontSize', newSize.toString())
  }

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 10, 80)
    setFontSize(newSize)
    document.documentElement.style.fontSize = `${newSize}%`
    localStorage.setItem('accessibility-fontSize', newSize.toString())
  }

  const resetFontSize = () => {
    setFontSize(100)
    document.documentElement.style.fontSize = '100%'
    localStorage.setItem('accessibility-fontSize', '100')
  }

  const toggleContrast = () => {
    const newValue = !highContrast
    setHighContrast(newValue)
    
    if (newValue) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
    
    localStorage.setItem('accessibility-contrast', newValue.toString())
  }

  const togglePointer = () => {
    const newValue = !largePointer
    setLargePointer(newValue)
    document.body.classList.toggle('large-pointer')
    localStorage.setItem('accessibility-pointer', newValue.toString())
  }

  const toggleLinks = () => {
    const newValue = !underlineLinks
    setUnderlineLinks(newValue)
    document.body.classList.toggle('underline-links')
    localStorage.setItem('accessibility-links', newValue.toString())
  }

  const resetAll = () => {
    setFontSize(100)
    setHighContrast(false)
    setLargePointer(false)
    setUnderlineLinks(false)
    document.documentElement.style.fontSize = '100%'
    document.documentElement.classList.remove('high-contrast')
    document.body.classList.remove('large-pointer', 'underline-links')
    localStorage.removeItem('accessibility-fontSize')
    localStorage.removeItem('accessibility-contrast')
    localStorage.removeItem('accessibility-pointer')
    localStorage.removeItem('accessibility-links')
  }

  return (
    <>
      {/* Accessibility Panel */}
      <div className={`fixed left-6 bottom-24 z-[9999] transition-all duration-300 accessibility-widget-panel ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className="bg-white rounded-2xl shadow-2xl p-4 w-80 border border-gray-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 font-hebrew">הגדרות נגישות</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="סגור תפריט נגישות"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Font Size */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 font-hebrew">גודל טקסט</span>
                <span className="text-sm text-gray-500">{fontSize}%</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={decreaseFontSize}
                  className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                  aria-label="הקטן טקסט"
                >
                  <ZoomOut size={18} />
                  <span className="text-xs font-hebrew">הקטן</span>
                </button>
                <button
                  onClick={resetFontSize}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="אפס גודל טקסט"
                >
                  <Type size={18} />
                </button>
                <button
                  onClick={increaseFontSize}
                  className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                  aria-label="הגדל טקסט"
                >
                  <ZoomIn size={18} />
                  <span className="text-xs font-hebrew">הגדל</span>
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <button
              onClick={toggleContrast}
              className={`w-full p-3 rounded-lg transition-all flex items-center justify-between ${
                highContrast 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
              aria-pressed={highContrast}
            >
              <span className="flex items-center gap-2">
                <Contrast size={18} />
                <span className="text-sm font-hebrew">ניגודיות גבוהה</span>
              </span>
              <div className={`w-4 h-4 rounded border-2 ${
                highContrast ? 'bg-white border-white' : 'border-gray-400'
              }`}>
                {highContrast && <span className="text-black text-xs">✓</span>}
              </div>
            </button>

            {/* Large Pointer */}
            <button
              onClick={togglePointer}
              className={`w-full p-3 rounded-lg transition-all flex items-center justify-between ${
                largePointer 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
              aria-pressed={largePointer}
            >
              <span className="flex items-center gap-2">
                <MousePointer size={18} />
                <span className="text-sm font-hebrew">סמן עכבר גדול</span>
              </span>
              <div className={`w-4 h-4 rounded border-2 ${
                largePointer ? 'bg-white border-white' : 'border-gray-400'
              }`}>
                {largePointer && <span className="text-black text-xs">✓</span>}
              </div>
            </button>

            {/* Underline Links */}
            <button
              onClick={toggleLinks}
              className={`w-full p-3 rounded-lg transition-all flex items-center justify-between ${
                underlineLinks 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
              aria-pressed={underlineLinks}
            >
              <span className="flex items-center gap-2">
                <Type size={18} />
                <span className="text-sm font-hebrew">הדגש קישורים</span>
              </span>
              <div className={`w-4 h-4 rounded border-2 ${
                underlineLinks ? 'bg-white border-white' : 'border-gray-400'
              }`}>
                {underlineLinks && <span className="text-black text-xs">✓</span>}
              </div>
            </button>

            {/* Reset Button */}
            <button
              onClick={resetAll}
              className="w-full p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-hebrew"
            >
              אפס את כל ההגדרות
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-6 bottom-6 z-[9999] w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-700 transition-all duration-200 hover:scale-105 accessibility-widget-button"
        aria-label={isOpen ? 'סגור תפריט נגישות' : 'פתח תפריט נגישות'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={28} /> : <Accessibility size={28} />}
      </button>

      {/* Global Styles */}
      <style jsx global>{`
        .accessibility-widget-button {
          filter: none !important;
        }
      `}</style>
    </>
  )
}
