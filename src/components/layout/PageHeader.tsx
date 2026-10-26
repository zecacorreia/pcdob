import type { ReactNode } from "react";

import { Reveal, RevealText } from "@/components/motion/Reveal";

type PageHeaderProps = {
  eyebrow: string;
  /** Cada item é uma linha do título (h1). */
  title: string[];
  accentLine?: number;
  description?: ReactNode;
  tone?: "ink" | "paper";
  children?: ReactNode;
};

/** Cabeçalho padrão das páginas internas — mesma linguagem do Hero da home. */
export function PageHeader({
  eyebrow,
  title,
  accentLine = title.length - 1,
  description,
  tone = "ink",
  children,
}: PageHeaderProps) {
  const dark = tone === "ink";

  return (
    <header className={`${dark ? "bg-ink text-paper" : "bg-paper text-ink"} pb-16 pt-36 md:pb-24 md:pt-48`}>
      <div className="container">
        <Reveal>
          <p
            className={`mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] md:text-sm ${
              dark ? "text-paper/70" : "text-vermelho"
            }`}
          >
            <span className={`h-px w-10 ${dark ? "bg-ouro" : "bg-vermelho"}`} aria-hidden="true" />
            {eyebrow}
          </p>
        </Reveal>
        <RevealText
          as="h1"
          lines={title}
          accentLine={accentLine}
          accentClassName={dark ? "text-ouro" : "text-vermelho"}
          className="font-display text-display-xl font-black uppercase [font-stretch:115%]"
        />
        {description && (
          <Reveal delay={0.2} className="mt-8 max-w-xl">
            <p className={`text-base leading-relaxed md:text-lg ${dark ? "text-paper/70" : "text-ink/70"}`}>
              {description}
            </p>
          </Reveal>
        )}
        {children}
      </div>
    </header>
  );
}
