import Link from "next/link";
import { ArrowRight, Brush, MessageSquare, Share2, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="w-full">
      <div className="flex w-full flex-col gap-6 sm:gap-8">
        {/* Hero */}
        <header className="relative flex flex-col items-center gap-6 overflow-hidden rounded-[32px] bg-white/70 px-6 pb-10 pt-12 shadow-xl shadow-black/5 ring-1 ring-black/5 backdrop-blur-md sm:px-10">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-zinc-600 shadow-sm ring-1 ring-black/5">
            <Sparkles size={14} className="text-accent" />
            Tiny pixel notes, big feelings
          </span>

          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="mx-auto max-w-[340px] text-4xl font-bold tracking-tight text-zinc-900 sm:max-w-[380px] sm:text-5xl">
              A pocket-sized canvas for anonymous notes.
            </h1>
            <p className="max-w-xs text-base leading-relaxed text-zinc-500 sm:text-lg">
              Draw three mini sketches, add a short message, and send a single, shareable link. No logins, no feeds.
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-3 pt-2">
            <Link
              href="/create"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5 active:scale-95 sm:w-auto"
            >
              Create a Note
              <ArrowRight size={16} />
            </Link>
            <a
              href="#how"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-medium text-zinc-700 shadow-sm ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 active:scale-95 sm:w-auto"
            >
              See how it works
            </a>
          </div>


        </header>

        {/* How it works */}
        <section id="how" className="relative flex flex-col gap-8 rounded-[32px] bg-white/70 px-6 py-10 shadow-xl shadow-black/5 ring-1 ring-black/5 backdrop-blur-md sm:px-10">
          {/* Vertical Tree Line */}
          <div className="absolute left-[43px] top-[72px] bottom-[72px] w-0.5 bg-zinc-200 sm:left-[59px]" />

          <div className="mb-2 text-center">
            <h2 className="text-2xl font-bold text-zinc-900">How it works</h2>
          </div>

          {[
            {
              icon: <Brush size={20} className="text-accent" />,
              title: "Sketch three moments",
              body: "Each grid is only 16×16 pixels. Keep it sweet, simple, and tiny.",
              bg: "bg-accent/10",
            },
            {
              icon: <MessageSquare size={20} className="text-accent-2" />,
              title: "Add a short note",
              body: "Write up to 280 characters. Say just enough, leave the rest to imagination.",
              bg: "bg-accent-2/10",
            },
            {
              icon: <Share2 size={20} className="text-accent-3" />,
              title: "Share the link",
              body: "We generate one anonymous URL so you can send it anywhere.",
              bg: "bg-accent-3/10",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="relative flex items-start gap-5"
            >
              <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.bg} ring-4 ring-white`}>
                {item.icon}
              </div>
              <div className="flex flex-col gap-1.5 pt-1.5">
                <h3 className="text-lg font-bold text-zinc-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Bottom CTA */}
        <section className="flex flex-col items-center gap-5 rounded-[28px] bg-white/70 px-6 py-10 text-center shadow-lg shadow-black/5 ring-1 ring-black/5 backdrop-blur-sm">
          <p className="text-xl font-medium text-zinc-900">Ready to send something tiny?</p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5 active:scale-95"
          >
            Start sketching
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </main>
  );
}
