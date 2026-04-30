"use client";

import { Check, Eraser } from "lucide-react";

type PaletteProps = {
  colors: string[];
  activeColor: string | null;
  onSelect: (color: string | null) => void;
};

export default function Palette({
  colors,
  activeColor,
  onSelect,
}: PaletteProps) {
  const swatches = [...colors, null];

  const isDarkColor = (hex: string) => {
    const normalized = hex.replace("#", "");
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance < 0.45;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {swatches.map((color, index) => {
        const isActive = color === activeColor;
        const isDark = color ? isDarkColor(color) : false;
        return (
          <button
            key={color ?? "eraser"}
            type="button"
            aria-label={color ? `Color ${index + 1}: ${color}` : "Eraser"}
            title={color ? color : "Eraser"}
            onClick={() => onSelect(color)}
            className={`flex h-11 w-11 items-center justify-center rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              isActive ? "ring-2 ring-black ring-offset-2" : "ring-0"
            } ${color ? (isDark ? "text-white" : "text-black") : "bg-white"}`}
            style={color ? { backgroundColor: color } : undefined}
          >
            {color ? (isActive ? <Check size={16} /> : null) : <Eraser size={16} />}
          </button>
        );
      })}
    </div>
  );
}
