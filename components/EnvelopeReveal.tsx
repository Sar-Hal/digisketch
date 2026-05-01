"use client";

import { motion } from "framer-motion";

type Props = {
  items: string[];
  message: string;
};

export default function EnvelopeReveal({ items, message }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-4"
    >
      <div className="rounded-[26px] border-2 border-black bg-white/85 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="grid grid-cols-2 gap-3 mx-auto w-fit">
          {items.map((src, i) => (
            <div
              key={i}
              className={`aspect-square w-28 sm:w-32 rounded-xl border-2 border-black bg-gridline p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                i === 2 ? "col-span-2 mx-auto" : ""
              }`}
            >
              <img
                src={src}
                alt={`Sketch ${i + 1}`}
                className="h-full w-full object-cover"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[24px] border-2 border-black bg-white/85 p-5 text-center text-lg message-text shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        {message || "No message attached, just pixels."}
      </div>
    </motion.div>
  );
}
