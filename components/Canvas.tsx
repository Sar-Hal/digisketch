"use client";

import { useCallback, useEffect, useState } from "react";
import type { Grid, Pixel } from "@/lib/types";
import { updateGridCell } from "@/lib/utils";

type CanvasProps = {
  grid: Grid;
  activeColor: Pixel;
  onChange: (updater: (grid: Grid) => Grid) => void;
};

export default function Canvas({ grid, activeColor, onChange }: CanvasProps) {
  const [isDrawing, setIsDrawing] = useState(false);

  const paintCell = useCallback(
    (row: number, col: number) => {
      onChange((current) => updateGridCell(current, row, col, activeColor));
    },
    [activeColor, onChange]
  );

  useEffect(() => {
    const stopDrawing = () => setIsDrawing(false);
    window.addEventListener("pointerup", stopDrawing);
    window.addEventListener("pointercancel", stopDrawing);
    return () => {
      window.removeEventListener("pointerup", stopDrawing);
      window.removeEventListener("pointercancel", stopDrawing);
    };
  }, []);

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDrawing) {
      return;
    }
    event.preventDefault();
    const touch = event.touches[0];
    if (!touch) {
      return;
    }
    const target = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    ) as HTMLElement | null;
    const cell = target?.closest<HTMLButtonElement>("[data-row][data-col]");
    if (!cell) {
      return;
    }
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    paintCell(row, col);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div
        className="grid w-full aspect-square select-none grid-cols-16 grid-rows-16 gap-px rounded-2xl bg-zinc-200 p-2 shadow-inner ring-1 ring-black/5 touch-none"
        onPointerDown={() => setIsDrawing(true)}
        onPointerUp={() => setIsDrawing(false)}
        onTouchStart={(event) => {
          setIsDrawing(true);
          handleTouchMove(event);
        }}
        onTouchEnd={() => setIsDrawing(false)}
        onTouchMove={handleTouchMove}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              type="button"
              data-row={rowIndex}
              data-col={colIndex}
              aria-label={`Row ${rowIndex + 1}, Column ${colIndex + 1}`}
              onPointerDown={(event) => {
                event.preventDefault();
                setIsDrawing(true);
                paintCell(rowIndex, colIndex);
              }}
              onPointerEnter={() => {
                if (isDrawing) {
                  paintCell(rowIndex, colIndex);
                }
              }}
              className="aspect-square w-full rounded-[2px] bg-white shadow-sm transition-colors duration-75"
              style={{ backgroundColor: cell ?? undefined }}
            />
          ))
        )}
      </div>
      <p className="text-[13px] text-zinc-500 text-center font-medium">Drag to draw. Tap to paint. Tiny grids only.</p>
    </div>
  );
}
