import Link from "next/link";
import { notFound } from "next/navigation";
import EnvelopeReveal from "@/components/EnvelopeReveal";
import { getSupabaseServer, NOTES_TABLE } from "@/lib/supabase-server";
import type { Grid } from "@/lib/types";
import { createEmptyGrid } from "@/lib/utils";

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
  const items = safeSketches;

  return (
    <main className="w-full">
      <div className="flex w-full flex-col space-y-6">
        <header className="rounded-[26px] border-2 border-black bg-white p-10 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm uppercase tracking-wide">DigiSketch</p>
          <h1 className="mt-2 text-4xl">
            A tiny note just landed in your inbox.
          </h1>
          <p className="mt-2 text-lg">
            A friend drew some pixels for you.
          </p>
        </header>

        <EnvelopeReveal items={items} message={message} />

        <div className="rounded-[24px] border-2 border-black bg-white p-10 pb-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xl font-bold">Make your own pixel note</p>
          <p className="mt-2 text-base message-text">
            Draw three tiny sketches and send a secret message back.
          </p>
          <Link
            href="/create"
            className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border-2 border-black bg-accent px-8 py-3 text-base shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            Make your own
          </Link>
        </div>
      </div>
    </main>
  );
}
