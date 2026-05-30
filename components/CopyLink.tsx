"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type CopyLinkProps = {
  url: string;
};

export default function CopyLink({ url }: CopyLinkProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
      <input
        value={url}
        readOnly
        className="w-full rounded-2xl bg-zinc-50 px-4 py-3.5 text-sm text-zinc-600 shadow-inner ring-1 ring-black/5 focus:outline-none"
      />
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5 active:scale-95 sm:shrink-0"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
