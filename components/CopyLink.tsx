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
        className="w-full rounded-xl border-2 border-black bg-white px-4 py-2 text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
      />
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black bg-accent px-4 py-2 text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
