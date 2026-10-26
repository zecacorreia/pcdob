"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { Logo } from "@/components/brand/Logo";
import { EASE_IN_OUT_QUART, EASE_OUT_EXPO } from "@/lib/motion";
import { guessToneForPath, sampleBackgroundTone, type NavTone } from "@/lib/navbar-tone";
import { JOIN_LINK, NAV_LINKS } from "@/lib/navigation";

/** Altura (em px) onde lemos o fundo: o meio do navbar (80px no celular, 96px no desktop). */
const SAMPLE_Y = 40;

/**
 * Navbar fixa que se esconde ao rolar para baixo e reaparece ao rolar para
 * cima. Adapta as cores ao fundo que está atrás dela (escuro ou claro) e o
 * botão "Menu" abre um overlay em tela cheia com links gigantes.
 */
export function Navbar() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [tone, setTone] = useState<NavTone>(() => guessToneForPath(pathname));
  const headerRef = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const menuId = useId();
  const lenis = useLenis();
  const { scrollY } = useScroll();

  /** Lê o fundo sob o navbar (no máximo uma vez por quadro). */
  const sampleTone = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      setTone(sampleBackgroundTone(window.innerWidth / 2, SAMPLE_Y, headerRef.current));
    });
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 160);
    setScrolled(latest > 40);
    sampleTone();
  });

  // Ao trocar de página: palpite imediato e leituras reais depois que o conteúdo
  // novo monta e termina a transição de entrada (template.tsx).
  useEffect(() => {
    setTone(guessToneForPath(pathname));
    const timers = [0, 150, 700].map((delay) => window.setTimeout(sampleTone, delay));
    window.addEventListener("resize", sampleTone);
    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("resize", sampleTone);
      cancelAnimationFrame(frame.current);
    };
  }, [pathname, sampleTone]);

  // Trava o scroll e escuta ESC enquanto o menu estiver aberto.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  // Com o menu aberto o fundo é o vermelho do overlay: sempre texto claro.
  const light = tone === "light" && !open;
  const bar = scrolled && !open ? (light ? "bg-paper/80 backdrop-blur-xl shadow-[0_1px_0_rgb(17_10_10/0.08)]" : "bg-ink/80 backdrop-blur-xl") : "bg-transparent";

  return (
    <>
      <motion.header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${light ? "text-ink" : "text-paper"} ${bar}`}
        animate={{ y: hidden && !open ? "-110%" : "0%" }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      >
        <nav aria-label="Principal" className="container flex h-20 items-center justify-between md:h-24">
          <Link href="/" aria-label="PCdoB — página inicial" className="relative z-10 outline-none focus-visible:opacity-70">
            {/* O amarelo do símbolo some sobre fundo claro: lá ele usa o vermelho institucional. */}
            <Logo className="h-8 w-auto md:h-10" symbolColor={light ? "#D7141A" : "#FFFF00"} />
          </Link>

          <ul className="hidden items-center gap-10 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <RollLink href={link.href} light={light}>
                  {link.label}
                </RollLink>
              </li>
            ))}
          </ul>

          <div className="relative z-10 flex items-center gap-3">
            <Link
              href={JOIN_LINK.href}
              className={`hidden h-11 items-center rounded-full bg-ouro px-6 text-xs font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-300 sm:inline-flex ${
                light ? "hover:bg-ink hover:text-paper" : "hover:bg-paper"
              }`}
            >
              {JOIN_LINK.label}
            </Link>
            <MenuButton open={open} light={light} controls={menuId} onToggle={() => setOpen((value) => !value)} />
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && <MenuOverlay id={menuId} onNavigate={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

/**
 * Botão "Menu": rótulo que rola ("Menu" → "Fechar") + disco com um hambúrguer
 * de três linhas. A linha do meio é mais curta e se alonga no hover; ao abrir,
 * as linhas de cima e de baixo giram e formam um X. Alvo de toque de 48px.
 */
function MenuButton({
  open,
  light,
  controls,
  onToggle,
}: {
  open: boolean;
  light: boolean;
  controls: string;
  onToggle: () => void;
}) {
  const line = "absolute left-0 h-0.5 rounded-full bg-current transition-[transform,width,opacity] duration-500 ease-out-expo";

  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      onClick={onToggle}
      className={`group flex h-12 items-center gap-3 rounded-full border pl-5 pr-1.5 text-xs font-bold uppercase tracking-[0.16em] outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ouro ${
        light ? "border-ink/25 hover:border-ink" : "border-paper/25 hover:border-paper"
      }`}
    >
      {/* Os dois rótulos ocupam a mesma célula do grid: a largura é a do maior ("Fechar"). */}
      <span className="grid h-[1.25em] overflow-hidden leading-[1.25]">
        <span className={`col-start-1 row-start-1 transition-transform duration-500 ease-out-expo ${open ? "-translate-y-full" : ""}`}>
          Menu
        </span>
        <span
          aria-hidden="true"
          className={`col-start-1 row-start-1 transition-transform duration-500 ease-out-expo ${open ? "translate-y-0" : "translate-y-full"}`}
        >
          Fechar
        </span>
      </span>

      <span
        aria-hidden="true"
        className={`grid h-9 w-9 place-items-center rounded-full transition-colors duration-300 group-hover:bg-ouro group-hover:text-ink ${
          light ? "bg-ink text-paper" : "bg-paper text-ink"
        }`}
      >
        <span className="relative block h-3.5 w-[18px]">
          <span className={`${line} top-0 w-full ${open ? "translate-y-[6px] rotate-45" : ""}`} />
          <span
            className={`${line} left-auto right-0 top-1/2 -translate-y-1/2 ${open ? "w-0 opacity-0" : "w-2/3 group-hover:w-full"}`}
          />
          <span className={`${line} bottom-0 w-full ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
        </span>
      </span>
    </button>
  );
}

/** Link com texto que "rola" para cima no hover. */
function RollLink({ href, light, children }: { href: string; light: boolean; children: string }) {
  return (
    <Link href={href} className="group relative block overflow-hidden text-xs font-semibold uppercase tracking-[0.18em]">
      <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">{children}</span>
      <span
        aria-hidden="true"
        className={`absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0 ${
          light ? "text-vermelho" : "text-ouro"
        }`}
      >
        {children}
      </span>
    </Link>
  );
}

function MenuOverlay({ id, onNavigate }: { id: string; onNavigate: () => void }) {
  const links = [...NAV_LINKS, JOIN_LINK];

  return (
    <motion.div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-40 flex flex-col justify-end bg-vermelho text-paper"
      // Revela em círculo a partir do botão de menu (canto superior direito).
      initial={{ clipPath: "circle(0% at 92% 3rem)" }}
      animate={{ clipPath: "circle(150% at 92% 3rem)" }}
      exit={{ clipPath: "circle(0% at 92% 3rem)" }}
      transition={{ duration: 0.9, ease: EASE_IN_OUT_QUART }}
    >
      <div className="container pb-12 pt-32 md:pb-16">
        <ul className="flex flex-col">
          {links.map((link, index) => (
            <li key={link.href} className="overflow-hidden border-b border-paper/20">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: "0%", transition: { duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.25 + index * 0.06 } }}
                exit={{ y: "100%", transition: { duration: 0.4, ease: EASE_IN_OUT_QUART } }}
              >
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  className="group flex items-baseline justify-between py-3 font-display text-display-lg font-black uppercase [font-stretch:115%] md:py-4"
                >
                  <span className="transition-transform duration-500 ease-out-expo group-hover:translate-x-4 group-hover:text-ouro">
                    {link.label}
                  </span>
                  <span className="text-sm font-semibold tracking-[0.2em] text-paper/60">0{index + 1}</span>
                </Link>
              </motion.div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
