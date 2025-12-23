"use client";

import { useState } from "react";
import Image from "next/image";

interface ImagePositionPickerProps {
  imageUrl: string;
  position: string;
  onChange: (position: string) => void;
  aspectRatio?: string;
}

const positionPresets = [
  { value: 'left top', icon: '↖' },
  { value: 'center top', icon: '↑' },
  { value: 'right top', icon: '↗' },
  { value: 'left center', icon: '←' },
  { value: 'center center', icon: '•' },
  { value: 'right center', icon: '→' },
  { value: 'left bottom', icon: '↙' },
  { value: 'center bottom', icon: '↓' },
  { value: 'right bottom', icon: '↘' },
];

export default function ImagePositionPicker({ 
  imageUrl, 
  position, 
  onChange,
  aspectRatio = "16/9"
}: ImagePositionPickerProps) {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customX, setCustomX] = useState(50);
  const [customY, setCustomY] = useState(50);

  const handlePresetClick = (value: string) => {
    setIsCustomMode(false);
    onChange(value);
  };

  const handleCustomChange = (x: number, y: number) => {
    setCustomX(x);
    setCustomY(y);
    onChange(`${x}% ${y}%`);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setIsCustomMode(true);
    handleCustomChange(x, y);
  };

  return (
    <div className="space-y-2">
      {/* Preview with clickable area */}
      <div 
        className="relative w-full overflow-hidden rounded-lg cursor-crosshair bg-gray-100"
        style={{ aspectRatio }}
        onClick={handleImageClick}
      >
        <Image
          src={imageUrl}
          alt="Preview"
          fill
          className="object-cover transition-all duration-300"
          style={{ objectPosition: position || 'center center' }}
        />
        {isCustomMode && (
          <div 
            className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-black/50"
            style={{ left: `${customX}%`, top: `${customY}%` }}
          />
        )}
      </div>

      {/* Compact preset grid */}
      <div className="flex items-center gap-2">
        <div className="grid grid-cols-9 gap-0.5 flex-1" dir="ltr">
          {positionPresets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => handlePresetClick(preset.value)}
              className={`p-1 text-xs rounded transition-all ${
                position === preset.value 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {preset.icon}
            </button>
          ))}
        </div>
        <code className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded whitespace-nowrap">
          {position || 'center'}
        </code>
      </div>
    </div>
  );
}
