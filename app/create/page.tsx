"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import Canvas from "@/components/Canvas";
import Palette from "@/components/Palette";
import CopyLink from "@/components/CopyLink";
import { MAX_MESSAGE_LENGTH, PALETTE } from "@/lib/constants";
import { createEmptyGrid } from "@/lib/utils";
import type { Grid } from "@/lib/types";

const steps = [
  {
    title: "First Sketch",
    description: "Draw a tiny memory. Keep it simple and pixel-y.",
  },
  {
    title: "Second Sketch",
    description: "Add a second doodle to keep the story going.",
  },
  {
    title: "Final Sketch",
    description: "Finish with one last tiny sketch.",
  },
  {
    title: "Add a Message",
    description: "Write a short note to go with your sketches.",
  },
];

export default function CreatePage() {
  const [step, setStep] = useState(0);
  const [sketches, setSketches] = useState<Grid[]>(() => [
    createEmptyGrid(),
    createEmptyGrid(),
    createEmptyGrid(),
  ]);
  const [activeColor, setActiveColor] = useState<string | null>(PALETTE[0]);
  const [message, setMessage] = useState("");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = steps[step];

  const updateGrid = (updater: (grid: Grid) => Grid) => {
    setSketches((prev) =>
      prev.map((item, index) => (index === step ? updater(item) : item))
    );
  };

  const handleClear = () => {
    updateGrid(() => createEmptyGrid());
  };

  const handleSend = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sketches,
          message,
          theme: "light",
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Failed to save your note.");
      }

      const url = `${window.location.origin}/v/${payload.id}`;
      setShareUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAll = () => {
    setShareUrl(null);
    setStep(0);
    setMessage("");
    setSketches([createEmptyGrid(), createEmptyGrid(), createEmptyGrid()]);
    setActiveColor(PALETTE[0]);
  };

  if (shareUrl) {
    return (
      <div className="flex w-full flex-col gap-5">
        <div className="rounded-[32px] bg-white/70 p-8 text-center shadow-xl shadow-black/5 ring-1 ring-black/5 backdrop-blur-md sm:p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-6"
          >
            <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">Your note is sealed.</h1>
            <p className="text-base text-zinc-500 sm:text-lg">
              Copy the link below and send it to someone special.
            </p>
            <div className="mt-2">
              <CopyLink url={shareUrl} />
            </div>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href={shareUrl}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5 active:scale-95 sm:w-auto"
              >
                Preview note
              </a>
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-medium text-zinc-700 shadow-sm ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 active:scale-95 sm:w-auto"
              >
                Make another
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="flex flex-col overflow-hidden rounded-[32px] bg-white/70 shadow-xl shadow-black/5 ring-1 ring-black/5 backdrop-blur-md">
        
        {/* Progress Bar */}
        <div className="flex w-full gap-1 p-6 pb-0 sm:p-8 sm:pb-0">
          {steps.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                idx <= step ? "bg-accent" : "bg-zinc-200"
              }`} 
            />
          ))}
        </div>

        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Step {step + 1} of {steps.length}
                </span>
                <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">{currentStep.title}</h1>
                <p className="max-w-sm text-sm text-zinc-500 sm:text-base">{currentStep.description}</p>
              </div>

              {step < 3 ? (
                <div className="flex flex-col gap-8">
                  <div className="mx-auto w-full max-w-[280px]">
                    <Canvas
                      grid={sketches[step]}
                      activeColor={activeColor}
                      onChange={updateGrid}
                    />
                  </div>
                  <div className="flex w-full flex-col items-center gap-6">
                    <div className="flex w-full flex-col items-center gap-3">
                      <div className="flex w-full justify-center">
                        <Palette
                          colors={PALETTE}
                          activeColor={activeColor}
                          onSelect={setActiveColor}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-sm font-medium text-zinc-400 underline-offset-4 hover:text-zinc-600 hover:underline"
                    >
                      Clear Canvas
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mx-auto flex w-full max-w-[320px] flex-col gap-2">
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    maxLength={MAX_MESSAGE_LENGTH}
                    rows={5}
                    placeholder="Type your message here..."
                    className="message-text w-full resize-none rounded-2xl bg-zinc-50 p-4 text-base text-zinc-700 shadow-inner ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <div className="flex items-center justify-between px-1 text-xs text-zinc-400">
                    <span>Max {MAX_MESSAGE_LENGTH} characters</span>
                    <span className={`font-medium ${message.length === MAX_MESSAGE_LENGTH ? 'text-red-400' : ''}`}>
                      {message.length}/{MAX_MESSAGE_LENGTH}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {error ? (
            <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
              {error}
            </p>
          ) : null}

          {/* Navigation Controls */}
          <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row-reverse sm:justify-between">
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 py-3.5 text-base font-medium text-white shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5 active:scale-95 sm:w-auto"
              >
                Next
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-base font-medium text-white shadow-lg shadow-accent/20 transition-transform hover:-translate-y-0.5 disabled:opacity-50 active:scale-95 sm:w-auto"
              >
                <Send size={16} />
                {isSubmitting ? "Sending..." : "Send Note"}
              </button>
            )}
            
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => Math.max(0, prev - 1))}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-medium text-zinc-700 shadow-sm ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 active:scale-95 sm:w-auto"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            ) : (
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-medium text-zinc-700 shadow-sm ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 active:scale-95 sm:w-auto"
              >
                <ArrowLeft size={16} />
                Home
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
