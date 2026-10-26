"use client";

import { useState } from "react";

type ShareLinksProps = {
  url: string;
  title: string;
};

/** Compartilhamento por links simples (sem scripts de terceiros) + copiar link. */
export function ShareLinks({ url, title }: ShareLinksProps) {
  const [copied, setCopied] = useState(false);
  const text = encodeURIComponent(`${title} ${url}`);
  const encodedUrl = encodeURIComponent(url);

  const targets = [
    { label: "WhatsApp", href: `https://wa.me/?text=${text}` },
    { label: "X", href: `https://x.com/intent/post?text=${text}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "Telegram", href: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(title)}` },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sem permissão de área de transferência: não há o que fazer.
    }
  }

  const chip =
    "rounded-full border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-300 hover:border-vermelho hover:bg-vermelho hover:text-paper";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">Compartilhe</span>
      {targets.map((target) => (
        <a key={target.label} href={target.href} target="_blank" rel="noopener noreferrer" className={chip}>
          {target.label}
        </a>
      ))}
      <button type="button" onClick={copy} className={chip} aria-live="polite">
        {copied ? "Link copiado!" : "Copiar link"}
      </button>
    </div>
  );
}
