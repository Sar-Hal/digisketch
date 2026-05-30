"use client";

import { motion } from "framer-motion";
import type { Grid } from "@/lib/types";

/* ─── Inline mini pixel renderer ────────────────────────────────────────── */
function MiniPixelGrid({ grid }: { grid: Grid }) {
  return (
    <div
      className="grid w-full overflow-hidden rounded-2xl bg-zinc-100 p-2 shadow-inner ring-1 ring-black/5"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${grid[0]?.length ?? 16}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${grid.length ?? 16}, minmax(0, 1fr))`,
        gap: "1px",
        aspectRatio: "1 / 1",
      }}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className="rounded-[1px] shadow-sm transition-colors duration-200"
            style={{
              backgroundColor: cell ?? "#ffffff",
            }}
          />
        ))
      )}
    </div>
  );
}

/* ─── Props ──────────────────────────────────────────────────────────────── */
type Props = {
  items: Grid[];
  message: string;
};

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function EnvelopeReveal({ items, message }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-6"
    >
      {/* Sketch gallery card */}
      <div className="overflow-hidden rounded-[32px] bg-white/80 p-6 shadow-xl shadow-black/5 ring-1 ring-black/5 backdrop-blur-md sm:p-10">
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {items.map((grid, i) => (
            <div
              key={i}
              className={`w-full ${i === 2 ? "col-span-2 mx-auto max-w-[60%]" : ""}`}
            >
              <MiniPixelGrid grid={grid} />
            </div>
          ))}
        </div>
      </div>

      {/* Message card */}
      <div className="message-text rounded-[28px] bg-white p-8 text-center text-lg leading-relaxed text-zinc-700 shadow-lg shadow-black/5 ring-1 ring-black/5">
        {message || "No message attached, just pixels."}
      </div>
    </motion.div>
  );
}
