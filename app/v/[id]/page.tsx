import Link from "next/link";
import { notFound } from "next/navigation";
import EnvelopeReveal from "@/components/EnvelopeReveal";
import { getNote } from "@/lib/kv";
import type { Grid } from "@/lib/types";
import { createEmptyGrid } from "@/lib/utils";

type NotePageProps = {
  params: Promise<{ id: string }>;
};

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  const data = await getNote(id);

  if (!data) {
    notFound();
  }

  const sketches = (data.sketches ?? []) as Grid[];
  const message = typeof data.message === "string" ? data.message : "";
  const safeSketches = sketches.length
    ? sketches
    : [createEmptyGrid(), createEmptyGrid(), createEmptyGrid()];
  const items = safeSketches;

  return (
    <main className="w-full">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col items-center gap-2 rounded-[32px] bg-white/70 px-6 py-10 text-center shadow-xl shadow-black/5 ring-1 ring-black/5 backdrop-blur-md">
          <span className="rounded-full bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
            DigiSketch
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            A tiny note landed in your inbox.
          </h1>
          <p className="text-base text-zinc-500 sm:text-lg">
            Someone drew some pixels for you.
          </p>
        </header>

        <EnvelopeReveal items={items} message={message} />

        <div className="flex flex-col items-center gap-3 rounded-[32px] bg-white/70 px-6 py-10 text-center shadow-xl shadow-black/5 ring-1 ring-black/5 backdrop-blur-md">
          <p className="text-xl font-bold text-zinc-900">Make your own pixel note</p>
          <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
            Draw three tiny sketches and send a secret message back.
          </p>
          <Link
            href="/create"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5 active:scale-95 sm:w-auto"
          >
            Create yours
          </Link>
        </div>
      </div>
    </main>
  );
}
