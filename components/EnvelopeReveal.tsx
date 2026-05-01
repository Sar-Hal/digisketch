"use client";

import { motion } from "framer-motion";
import type { Grid } from "@/lib/types";

/* ─── Inline mini pixel renderer ────────────────────────────────────────── */
function MiniPixelGrid({ grid }: { grid: Grid }) {
  return (
    <div
      className="grid rounded-[8px] border-2 border-black bg-gridline shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${grid[0]?.length ?? 16}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${grid.length ?? 16}, minmax(0, 1fr))`,
        gap: "1px",
        padding: "4px",
        width: "100%",
        aspectRatio: "1 / 1",
      }}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              backgroundColor: cell ?? "#FDFBF7",
              borderRadius: "1px",
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
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-6"
    >
      {/* Sketch gallery card */}
      <div className="overflow-hidden rounded-[26px] border-2 border-black bg-white p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        {/* Safe-zone inner wrapper */}
        <div className="p-2">
          <div className="grid grid-cols-2 gap-10">
            {items.map((grid, i) => (
              <div
                key={i}
                className={`w-full ${i === 2 ? "col-span-2 mx-auto max-w-[50%]" : ""}`}
              >
                <MiniPixelGrid grid={grid} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message card */}
      <div className="rounded-[24px] border-2 border-black bg-white p-10 text-center text-lg message-text shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        {message || "No message attached, just pixels."}
      </div>
    </motion.div>
  );
}
