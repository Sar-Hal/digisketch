import Link from "next/link";
import { notFound } from "next/navigation";
import ImageTrail from "@/components/ImageTrail";
import { getSupabaseServer, NOTES_TABLE } from "@/lib/supabase-server";
import type { Grid } from "@/lib/types";
import { createEmptyGrid, gridToDataUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

type NotePageProps = {
  params: Promise<{ id: string }>;
};

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from(NOTES_TABLE)
    .select("id, sketches, message")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const sketches = (data.sketches ?? []) as Grid[];
  const message = typeof data.message === "string" ? data.message : "";
  const safeSketches = sketches.length
    ? sketches
    : [createEmptyGrid(), createEmptyGrid(), createEmptyGrid()];
  const items = safeSketches.map((grid) => gridToDataUrl(grid));

  return (
    <main className="min-h-screen px-5 py-12 sm:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="rounded-[26px] border-2 border-black bg-white/85 p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm uppercase tracking-wide">DigiSketch</p>
          <h1 className="mt-2 text-4xl">
            A tiny note just landed in your inbox.
          </h1>
          <p className="mt-2 text-lg">
            Move your cursor (or swipe) to reveal the sketches. They stay once
            they appear.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[26px] border-2 border-black bg-white/85 p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="relative h-[300px] overflow-hidden rounded-[22px] border-2 border-black bg-[radial-gradient(circle_at_top,_#fff4e4,_#fde9f0,_#fdfbf7)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:h-[380px]">
              <ImageTrail items={items} variant={2} className="h-full w-full" />
              <div className="pointer-events-none absolute bottom-4 right-4 rounded-full border-2 border-black bg-white/90 px-3 py-1 text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                Sketch trail
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-[24px] border-2 border-black bg-white/85 p-6 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {message || "No message attached, just pixels."}
            </div>
            <div className="rounded-[24px] border-2 border-black bg-white/85 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-xl">Make your own pixel note</p>
              <p className="mt-2 text-base">
                Draw three tiny sketches and send a secret message back.
              </p>
              <Link
                href="/create"
                className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border-2 border-black bg-accent px-5 py-2 text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Make your own
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
