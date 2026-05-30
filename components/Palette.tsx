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
    <div className="flex flex-wrap justify-center items-center gap-3 px-1">
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
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm ring-1 ring-black/5 transition-transform hover:scale-110 active:scale-95 ${
              isActive ? "ring-2 ring-zinc-900 ring-offset-2 scale-110 shadow-md" : "ring-1 ring-black/10"
            } ${color ? (isDark ? "text-white" : "text-black") : "bg-white text-zinc-500"}`}
            style={color ? { backgroundColor: color } : undefined}
          >
            {color ? (isActive ? <Check size={16} strokeWidth={3} /> : null) : <Eraser size={16} strokeWidth={2.5} />}
          </button>
        );
      })}
    </div>
  );
}
