import Link from "next/link";

import { LogoSymbol } from "@/components/brand/Logo";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink pb-20 pt-32 text-paper">
      <LogoSymbol
        aria-hidden="true"
        className="pointer-events-none absolute -right-[15%] top-1/2 h-auto w-[90vw] -translate-y-1/2 text-vermelho/15 md:w-[55vw]"
      />
      <div className="container relative">
        <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-paper/70">
          <span className="h-px w-10 bg-ouro" aria-hidden="true" />
          Erro 404
        </p>
        <h1 className="font-display text-display-2xl font-black uppercase [font-stretch:115%]">
          Página <span className="block text-ouro">não encontrada</span>
        </h1>
        <p className="mt-8 max-w-md text-lg text-paper/70">
          O endereço pode ter mudado ou a página saiu do ar. Mas a luta continua — siga por aqui:
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <MagneticButton href="/">Página inicial</MagneticButton>
          <MagneticButton href="/noticias" variant="ghost">
            Notícias
          </MagneticButton>
        </div>
        <p className="mt-10 text-sm text-paper/50">
          Procurando conteúdo antigo? Ele continua em{" "}
          <Link href="https://pcdob.org.br" className="underline underline-offset-4 hover:text-ouro">
            pcdob.org.br
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
