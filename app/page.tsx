import Link from "next/link";
import { ArrowRight, Brush, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-16">
        <header className="relative overflow-hidden rounded-[32px] border-2 border-black bg-white/80 p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="absolute -top-20 -right-10 h-44 w-44 rounded-full bg-accent/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-accent-2/40 blur-3xl" />
          <div className="relative flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-1 text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles size={16} />
              Tiny pixel notes, big feelings
            </span>
            <div className="flex flex-col gap-4">
              <h1 className="text-5xl leading-tight sm:text-6xl">
                DigiSketch is a pocket-sized canvas for anonymous notes.
              </h1>
              <p className="max-w-2xl text-lg">
                Draw three mini sketches, add a short message, and send a
                single, shareable link. No logins, no feeds, just tiny moments.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-black bg-accent px-6 py-3 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5"
              >
                Create a Note
                <ArrowRight size={18} />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black bg-white px-6 py-3 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                See how it works
              </a>
            </div>
          </div>
        </header>

        <section id="how" className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Sketch three moments",
              body: "Each grid is only 16x16 pixels. Keep it sweet, simple, and tiny.",
            },
            {
              title: "Add a short note",
              body: "Write up to 280 characters. Say just enough, leave the rest to imagination.",
            },
            {
              title: "Share the link",
              body: "We generate one anonymous URL so you can send it anywhere.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 rounded-[24px] border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <Brush size={20} />
              <h2 className="text-2xl">{item.title}</h2>
              <p className="text-base">{item.body}</p>
            </div>
          ))}
        </section>

        <section className="flex flex-col items-center gap-6 rounded-[28px] border-2 border-black bg-white/80 px-8 py-10 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-3xl">Ready to send something tiny?</p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-accent-3 px-6 py-3 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Start sketching
            <ArrowRight size={18} />
          </Link>
        </section>
      </div>
    </main>
  );
}
