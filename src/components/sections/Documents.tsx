"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useDeferredValue, useId, useMemo, useState } from "react";

import { Reveal, RevealText } from "@/components/motion/Reveal";
import { DOCUMENT_CATEGORIES, partyDocuments, type DocumentCategory, type PartyDocument } from "@/data/documents";
import { EASE_OUT_EXPO } from "@/lib/motion";

type DocumentsProps = {
  documents?: PartyDocument[];
};

type Filter = "Todos" | DocumentCategory;

const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" });
const sizeFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

/** "2025-11-24" → { month: "nov", year: "2025" } — determinístico (UTC). */
function splitDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return {
    month: monthFormatter.format(new Date(Date.UTC(year, month - 1, day))).replace(".", ""),
    year: String(year),
  };
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${sizeFormatter.format(bytes / (1024 * 1024))} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** Remove acentos para a busca casar "resolucao" com "Resolução". */
function normalize(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/**
 * Biblioteca minimalista de documentos: coluna fixa com título, filtros e
 * busca; à direita, uma lista tipográfica onde cada linha é um link.
 */
export function Documents({ documents = partyDocuments }: DocumentsProps) {
  const [filter, setFilter] = useState<Filter>("Todos");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const searchId = useId();

  const sorted = useMemo(() => [...documents].sort((a, b) => b.date.localeCompare(a.date)), [documents]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { Todos: documents.length };
    for (const doc of documents) result[doc.category] = (result[doc.category] ?? 0) + 1;
    return result;
  }, [documents]);

  const visible = sorted.filter(
    (doc) =>
      (filter === "Todos" || doc.category === filter) &&
      (!deferredQuery || normalize(`${doc.title} ${doc.category}`).includes(normalize(deferredQuery))),
  );

  const filters: Filter[] = ["Todos", ...DOCUMENT_CATEGORIES.filter((category) => counts[category])];

  return (
    // overflow-x-clip: a faixa vermelha do hover passa das bordas da linha; `clip`
    // (e não `hidden`) recorta sem quebrar o `sticky` da coluna da esquerda.
    <section id="documentos" aria-labelledby="documents-title" className="overflow-x-clip bg-ink py-24 text-paper md:py-36">
      <div className="container grid gap-14 lg:grid-cols-12 lg:gap-10">
        {/* ---------- Coluna fixa ---------- */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-paper/60 md:text-sm">
                <span className="h-px w-10 bg-ouro" aria-hidden="true" />
                Documentos
              </p>
            </Reveal>
            <RevealText
              id="documents-title"
              lines={["Resoluções", "e textos"]}
              accentLine={1}
              accentClassName="text-ouro"
              // A partir de lg o título fica numa coluna de 4/12: "RESOLUÇÕES" ocupa
              // ~8.3em, então o tamanho acompanha a largura dessa coluna.
              className="font-display text-display-lg font-black uppercase [font-stretch:115%] lg:text-[clamp(2rem,3.4vw,3.5rem)]"
            />
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-paper/65">
                Programa, estatuto e as posições oficiais do partido — para ler, baixar e compartilhar.
              </p>
            </Reveal>

            <Reveal delay={0.25} className="mt-10 space-y-6">
              {/* Busca */}
              <div className="relative">
                <label htmlFor={searchId} className="sr-only">
                  Buscar documento
                </label>
                <input
                  id={searchId}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar documento"
                  className="peer w-full border-b border-paper/20 bg-transparent py-3 pr-8 text-base text-paper placeholder:text-paper/40 focus:border-ouro focus:outline-none [&::-webkit-search-cancel-button]:hidden"
                />
                <SearchIcon className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-paper/40 transition-colors peer-focus:text-ouro" />
              </div>

              {/* Filtros */}
              <div role="group" aria-label="Filtrar por tipo" className="flex flex-wrap gap-2">
                {filters.map((item) => {
                  const active = item === filter;
                  return (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilter(item)}
                      className={`relative rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ${
                        active ? "border-paper text-ink" : "border-paper/20 text-paper/70 hover:border-paper hover:text-paper"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="document-filter"
                          className="absolute inset-0 rounded-full bg-paper"
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      )}
                      <span className="relative">
                        {item} <span className="tabular-nums opacity-50">{counts[item]}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>

        {/* ---------- Lista ---------- */}
        <div className="lg:col-span-8">
          <p aria-live="polite" className="sr-only">
            {visible.length} documento{visible.length === 1 ? "" : "s"} encontrado{visible.length === 1 ? "" : "s"}
          </p>

          <ul className="border-t border-paper/15">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((doc, index) => (
                <motion.li
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24, transition: { duration: 0.25 } }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: Math.min(index, 6) * 0.05 }}
                  className="border-b border-paper/15"
                >
                  <DocumentRow doc={doc} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {visible.length === 0 && (
            <div className="py-16 text-center">
              <p className="font-display text-2xl font-extrabold uppercase">Nada por aqui</p>
              <p className="mt-2 text-sm text-paper/60">Tente outro termo ou limpe os filtros.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilter("Todos");
                }}
                className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-ouro underline-offset-4 hover:underline"
              >
                Limpar busca
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Linha da lista. No hover/foco: faixa vermelha varre da esquerda,
 * o título avança e o ícone circular vira um botão amarelo.
 */
function DocumentRow({ doc }: { doc: PartyDocument }) {
  const { month, year } = splitDate(doc.date);
  const isPdf = doc.format === "PDF";
  const meta = isPdf && doc.size ? `PDF · ${formatSize(doc.size)}` : "Ler online";

  return (
    <a
      href={doc.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${doc.title} — ${isPdf ? "baixar PDF" : "ler online"}${doc.size ? `, ${formatSize(doc.size)}` : ""}`}
      className="group relative grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 py-6 outline-none md:grid-cols-[5rem_1fr_auto_auto] md:gap-8 md:py-8"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 -left-5 -right-5 origin-left scale-x-0 bg-vermelho transition-transform duration-700 ease-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100 md:-left-6 md:-right-6"
      />

      {/* Data */}
      <span aria-hidden="true" className="relative flex flex-col text-xs font-semibold uppercase tabular-nums tracking-[0.15em] text-paper/50 transition-colors duration-500 group-hover:text-paper/80">
        <span>{month}</span>
        <span className="text-paper/80 group-hover:text-paper">{year}</span>
      </span>

      {/* Título */}
      <span className="relative min-w-0 transition-transform duration-700 ease-out-expo group-hover:translate-x-2 md:group-hover:translate-x-4">
        <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-ouro transition-colors duration-500 group-hover:text-paper/80">
          {doc.category}
        </span>
        <span className="block font-display text-xl font-extrabold uppercase leading-[1] [font-stretch:105%] md:text-3xl">
          {doc.title}
        </span>
        {doc.description && (
          <span className="mt-2 block text-sm text-paper/60 group-hover:text-paper/80">{doc.description}</span>
        )}
        {/* No mobile o formato fica abaixo do título. */}
        <span className="mt-2 block text-xs font-medium uppercase tracking-[0.15em] text-paper/50 md:hidden">{meta}</span>
      </span>

      {/* Formato */}
      <span
        aria-hidden="true"
        className="relative hidden whitespace-nowrap text-xs font-medium uppercase tracking-[0.15em] text-paper/50 transition-colors duration-500 group-hover:text-paper md:block"
      >
        {meta}
      </span>

      {/* Ação */}
      <span
        aria-hidden="true"
        className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-paper/25 transition-colors duration-500 group-hover:border-ouro group-hover:bg-ouro group-hover:text-ink md:h-14 md:w-14"
      >
        {isPdf ? (
          // Seta que "cai" e reaparece por cima — sugere download.
          <span className="relative block h-4 w-4 overflow-hidden">
            <DownloadIcon className="absolute inset-0 h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-y-full" />
            <DownloadIcon className="absolute inset-0 h-4 w-4 -translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
          </span>
        ) : (
          <ArrowIcon className="h-4 w-4 -rotate-45 transition-transform duration-500 ease-out-expo group-hover:rotate-0" />
        )}
      </span>
    </a>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M8 1v12M2.5 7.5 8 13l5.5-5.5M1 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M1 8h14M9 2l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="m11 11 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}
