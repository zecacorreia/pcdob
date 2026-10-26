import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { HistoryScroll } from "@/components/sections/HistoryScroll";
import { JoinBanner } from "@/components/sections/JoinBanner";
import { Leaderships } from "@/components/sections/Leaderships";
import { partyDocuments } from "@/data/documents";
import { featuredLeaders } from "@/data/leaders";
import { getFederalDeputies } from "@/lib/camara";

export const metadata: Metadata = {
  title: "O Partido",
  description:
    "Fundado em 1922, o Partido Comunista do Brasil é o partido da classe operária e do conjunto dos trabalhadores brasileiros. Conheça nossa história, programa, estatuto e lideranças.",
  alternates: { canonical: "/o-partido" },
};

/** Datas do Art. 1º do Estatuto do PCdoB. */
const MILESTONES = [
  { year: "1922", label: "Fundação", date: "25 de março" },
  { year: "1962", label: "Reorganização", date: "18 de fevereiro" },
  { year: "1985", label: "Legalidade", date: "27 de maio" },
];

/** Textos de base: programa, estatuto e a resolução política mais recente. */
const FOUNDATION_IDS = ["programa", "estatuto", "resolucao-16-congresso"];

export default async function PartyPage() {
  const deputies = await getFederalDeputies();
  const foundations = FOUNDATION_IDS.map((id) => partyDocuments.find((doc) => doc.id === id)).filter(
    (doc): doc is (typeof partyDocuments)[number] => Boolean(doc),
  );

  return (
    <>
      <PageHeader
        eyebrow="O Partido"
        title={["Partido", "Comunista", "do Brasil"]}
        description="O partido político da classe operária e do conjunto dos trabalhadores e trabalhadoras brasileiros, fiel aos interesses do povo e da nação."
      >
        <dl className="mt-14 grid grid-cols-3 gap-4 border-t border-paper/15 pt-8 md:mt-20 md:max-w-3xl">
          {MILESTONES.map((item, index) => (
            <Reveal key={item.year} delay={0.3 + index * 0.08}>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/60">{item.label}</dt>
              <dd className="mt-2 font-display text-4xl font-black text-vermelho [font-stretch:115%] md:text-6xl">
                {item.year}
              </dd>
              <dd className="mt-1 text-xs text-paper/60">{item.date}</dd>
            </Reveal>
          ))}
        </dl>
      </PageHeader>

      <HistoryScroll cta={{ label: "Filie-se", href: "/filie-se" }} />

      {/* ---------- Programa, estatuto, resolução ---------- */}
      <section aria-labelledby="bases-title" className="bg-paper py-24 text-ink md:py-36">
        <div className="container">
          <Reveal>
            <h2 id="bases-title" className="mb-12 font-display text-display-md font-extrabold uppercase [font-stretch:110%] md:mb-16">
              Nossas <span className="text-vermelho">bases</span>
            </h2>
          </Reveal>
          <ul className="grid gap-4 md:grid-cols-3 md:gap-5">
            {foundations.map((doc, index) => (
              <li key={doc.id}>
                <Reveal delay={index * 0.08} className="h-full">
                  <a
                    href={doc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full min-h-[16rem] flex-col justify-between rounded-2xl bg-ink p-6 text-paper transition-colors duration-500 hover:bg-vermelho md:p-8"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ouro transition-colors group-hover:text-paper/80">
                      {doc.category}
                    </span>
                    <span>
                      <span className="block font-display text-2xl font-extrabold uppercase leading-[0.95] [font-stretch:105%] md:text-3xl">
                        {doc.title}
                      </span>
                      <span className="mt-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-paper/70">
                        {doc.format === "PDF" ? "Baixar PDF" : "Ler online"}
                        <span aria-hidden="true" className="transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                          →
                        </span>
                      </span>
                    </span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Leaderships featured={featuredLeaders} deputies={deputies} />
      <JoinBanner />
    </>
  );
}
