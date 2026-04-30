import Link from "next/link";
import { notFound } from "next/navigation";
import NotePreview from "@/components/NotePreview";
import { getSupabaseServer, NOTES_TABLE } from "@/lib/supabase-server";
import type { Grid } from "@/lib/types";

export const dynamic = "force-dynamic";

type NotePageProps = {
  params: { id: string };
};

export default async function NotePage({ params }: NotePageProps) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from(NOTES_TABLE)
    .select("id, sketches, message")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    notFound();
  }

  const sketches = (data.sketches ?? []) as Grid[];
  const message = typeof data.message === "string" ? data.message : "";

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <div className="rounded-[28px] border-2 border-black bg-white/80 p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <NotePreview sketches={sketches} message={message} />
        </div>
        <Link
          href="/create"
          className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-black bg-accent px-5 py-2 text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          Make your own
        </Link>
      </div>
    </main>
  );
}
