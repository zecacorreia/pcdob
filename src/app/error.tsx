"use client";

import { useEffect } from "react";

import { MagneticButton } from "@/components/ui/MagneticButton";

/** Erro inesperado numa página — oferece tentar de novo sem recarregar tudo. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[100svh] items-center bg-ink pb-20 pt-32 text-paper">
      <div className="container">
        <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-paper/70">
          <span className="h-px w-10 bg-ouro" aria-hidden="true" />
          Algo deu errado
        </p>
        <h1 className="font-display text-display-xl font-black uppercase [font-stretch:115%]">
          Tivemos um <span className="block text-vermelho">problema</span>
        </h1>
        <p className="mt-8 max-w-md text-lg text-paper/70">
          Não foi possível carregar esta página agora. Tente novamente em instantes.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="h-14 rounded-full bg-ouro px-8 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-paper md:h-16 md:px-10"
          >
            Tentar novamente
          </button>
          <MagneticButton href="/" variant="ghost">
            Página inicial
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
