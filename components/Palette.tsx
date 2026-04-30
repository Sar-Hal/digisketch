"use client";

import { Eraser } from "lucide-react";

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

  return (
    <div className="flex flex-wrap items-center gap-2">
      {swatches.map((color, index) => {
        const isActive = color === activeColor;
        return (
          <button
            key={color ?? "eraser"}
            type="button"
            aria-label={color ? `Color ${index + 1}` : "Eraser"}
            onClick={() => onSelect(color)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              isActive ? "ring-2 ring-black ring-offset-2" : "ring-0"
            }`}
          >
            {color ? (
              <span
                className="h-6 w-6 rounded-full border-2 border-black/80"
                style={{ backgroundColor: color }}
              />
            ) : (
              <Eraser size={16} />
            )}
          </button>
        );
      })}
    </div>
  );
}
