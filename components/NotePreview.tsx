"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Grid } from "@/lib/types";
import { GRID_SIZE } from "@/lib/constants";
import { createEmptyGrid } from "@/lib/utils";

type NotePreviewProps = {
  sketches: Grid[];
  message: string;
};

export default function NotePreview({ sketches, message }: NotePreviewProps) {
  const [index, setIndex] = useState(0);
  const safeSketches = sketches.length
    ? sketches
    : [createEmptyGrid(), createEmptyGrid(), createEmptyGrid()];
  const total = safeSketches.length;
  const active = safeSketches[index] ?? safeSketches[0];

  const goPrev = () => setIndex((prev) => (prev - 1 + total) % total);
  const goNext = () => setIndex((prev) => (prev + 1) % total);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={goPrev}
          className="rounded-full border-2 border-black bg-white p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          aria-label="Previous sketch"
        >
          <ChevronLeft size={18} />
        </button>
        <p className="text-lg">Sketch {index + 1} of {total}</p>
        <button
          type="button"
          onClick={goNext}
          className="rounded-full border-2 border-black bg-white p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          aria-label="Next sketch"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {active ? <PixelGrid grid={active} /> : null}
        </motion.div>
      </AnimatePresence>

      <div className="rounded-[20px] border-2 border-black bg-white p-5 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {message || "No message attached, just pixels."}
      </div>
    </motion.div>
  );
}

type PixelGridProps = {
  grid: Grid;
};

function PixelGrid({ grid }: PixelGridProps) {
  return (
    <div className="mx-auto grid w-full max-w-[360px] grid-cols-[repeat(16,minmax(0,1fr))] grid-rows-[repeat(16,minmax(0,1fr))] gap-[1px] rounded-[12px] border-2 border-black bg-gridline p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const delay = (rowIndex * GRID_SIZE + colIndex) * 8;
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`aspect-square w-full rounded-[2px] bg-paper ${
                cell ? "pixel-reveal" : ""
              }`}
              style={{
                backgroundColor: cell ?? undefined,
                animationDelay: `${delay}ms`,
              }}
            />
          );
        })
      )}
    </div>
  );
}
