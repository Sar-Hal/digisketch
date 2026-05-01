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
    title: "Sketch 1",
    description: "Draw a tiny memory. Keep it simple and pixel-y.",
  },
  {
    title: "Sketch 2",
    description: "Add a second doodle to keep the story going.",
  },
  {
    title: "Sketch 3",
    description: "Finish with one last tiny sketch.",
  },
  {
    title: "Message",
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

  // State Stability Lockdown: Wrap entire create flow. If shareUrl exists, ONLY render Success UI.
  if (shareUrl) {
    return (
      <main className="min-h-screen py-10">
        <div className="mx-auto flex w-full max-w-md flex-col gap-5 px-4">
          <div className="rounded-[26px] border-2 border-black bg-white p-10 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-5"
            >
              <h1 className="text-4xl">Your note is sealed.</h1>
              <p className="mt-2 text-lg message-text">
                Copy the link below and send it to someone special.
              </p>
              <div className="mt-4">
                <CopyLink url={shareUrl} />
              </div>
              <div className="mt-6 flex flex-col items-center gap-4">
                <a
                  href={shareUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black bg-accent px-8 py-3 text-base shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  Preview note
                </a>
                <button
                  type="button"
                  onClick={resetAll}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black bg-[#E5E0F5] px-8 py-3 text-base shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  Make another
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-10">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5 px-4">
        <section className="rounded-[26px] border-2 border-black bg-white p-14 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <p className="text-sm uppercase tracking-wide">
                  Step {step + 1} of {steps.length}
                </p>
                <h1 className="text-3xl">{currentStep.title}</h1>
                <p className="max-w-sm text-base">{currentStep.description}</p>
              </div>

              {step < 3 ? (
                <div className="flex flex-col gap-8">
                  <div className="px-4 sm:px-6">
                    <Canvas
                      grid={sketches[step]}
                      activeColor={activeColor}
                      onChange={updateGrid}
                    />
                  </div>
                  <div className="flex w-full flex-col items-center gap-8">
                    <div className="flex w-full flex-col items-center gap-4">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wide">
                        <span>Palette:</span>
                        <span
                          className="h-3 w-3 rounded-full border-2 border-black"
                          style={{
                            backgroundColor: activeColor ?? "#ffffff",
                          }}
                        />
                      </div>
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
                      className="w-full max-w-[200px] rounded-full border-2 border-black bg-white px-8 py-3 text-xs uppercase tracking-wide shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    >
                      Clear Canvas
                    </button>
                  </div>
                </div>
              ) : (
                <div className="m-auto mb-10 flex w-full max-w-[90%] flex-col gap-3">
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    maxLength={MAX_MESSAGE_LENGTH}
                    rows={5}
                    placeholder="Type your message here..."
                    className="message-text w-full resize-none rounded-[12px] border-2 border-black bg-white p-4 text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span>Max {MAX_MESSAGE_LENGTH} characters</span>
                    <span className="font-bold">
                      {message.length}/{MAX_MESSAGE_LENGTH}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {error ? (
            <p className="mt-4 rounded-xl border-2 border-black bg-accent/40 px-3 py-2 text-sm">
              {error}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="mb-8 flex flex-wrap justify-center gap-8">
              {steps.map((item, index) => {
                const isActive = index === step;
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setStep(index)}
                    className={`rounded-full border-2 border-black px-4 py-2 text-sm font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                      isActive ? "bg-accent" : "bg-white"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-16 flex w-full flex-col items-center gap-4">
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() =>
                    setStep((prev) => Math.min(steps.length - 1, prev + 1))
                  }
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-black bg-accent px-8 py-3 text-base shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isSubmitting}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-black bg-accent-3 px-8 py-3 text-base shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                >
                  <Send size={16} />
                  {isSubmitting ? "Sending..." : "Send"}
                </button>
              )}
              <button
                type="button"
                onClick={() => setStep((prev) => Math.max(0, prev - 1))}
                disabled={step === 0}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-black bg-white px-8 py-3 text-base shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            </div>
          </div>
        </section>

        <div className="rounded-[22px] border-2 border-black bg-white px-6 pb-20 pt-6 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-2xl">Need a fresh start?</p>
          <p className="mt-2 text-base">
            You can jump back to any sketch step and adjust your drawings.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#E5E0F5] px-8 py-3 text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
