import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  /** Monta o href de uma página (ex.: n => `/noticias?pagina=${n}`). */
  hrefFor: (page: number) => string;
};

/**
 * Janela de páginas ao redor da atual: 1 … 4 5 [6] 7 8 … 1069.
 * Exportada para teste.
 */
export function pageWindow(page: number, totalPages: number, radius = 2): (number | "…")[] {
  const pages = new Set<number>([1, totalPages]);
  for (let n = page - radius; n <= page + radius; n++) {
    if (n >= 1 && n <= totalPages) pages.add(n);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  sorted.forEach((n, index) => {
    if (index > 0 && n - sorted[index - 1] > 1) result.push("…");
    result.push(n);
  });
  return result;
}

const base =
  "grid h-11 min-w-11 place-items-center rounded-full px-3 text-sm font-semibold tabular-nums transition-colors duration-300";

/** Paginação acessível baseada em links (funciona sem JavaScript). */
export function Pagination({ page, totalPages, hrefFor }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Paginação" className="container flex flex-wrap items-center justify-center gap-2 pb-24 md:pb-36">
      {page > 1 && (
        <Link href={hrefFor(page - 1)} rel="prev" className={`${base} border border-ink/20 hover:border-vermelho hover:text-vermelho`}>
          <span aria-hidden="true">←</span>
          <span className="sr-only">Página anterior</span>
        </Link>
      )}

      {pageWindow(page, totalPages).map((item, index) =>
        item === "…" ? (
          <span key={`gap-${index}`} aria-hidden="true" className="px-1 text-ink/40">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-current={item === page ? "page" : undefined}
            aria-label={`Página ${item}`}
            className={`${base} ${item === page ? "bg-ink text-paper" : "hover:bg-ink/5 hover:text-vermelho"}`}
          >
            {item}
          </Link>
        ),
      )}

      {page < totalPages && (
        <Link href={hrefFor(page + 1)} rel="next" className={`${base} border border-ink/20 hover:border-vermelho hover:text-vermelho`}>
          <span aria-hidden="true">→</span>
          <span className="sr-only">Próxima página</span>
        </Link>
      )}
    </nav>
  );
}
