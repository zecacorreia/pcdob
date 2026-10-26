"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useLenis } from "lenis/react";
import { useEffect, useId, useState } from "react";

import { Logo } from "@/components/brand/Logo";
import { EASE_IN_OUT_QUART, EASE_OUT_EXPO } from "@/lib/motion";
import { JOIN_LINK, NAV_LINKS } from "@/lib/navigation";

/**
 * Navbar fixa que se esconde ao rolar para baixo e reaparece ao rolar para
 * cima. O botão "Menu" abre um overlay em tela cheia com links gigantes.
 */
export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const lenis = useLenis();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 160);
    setScrolled(latest > 40);
  });

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

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 text-paper transition-colors duration-500 ${
          scrolled && !open ? "bg-ink/80 backdrop-blur-xl" : "bg-transparent"
        }`}
        animate={{ y: hidden && !open ? "-110%" : "0%" }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      >
        <nav aria-label="Principal" className="container flex h-20 items-center justify-between md:h-24">
          <Link href="/" aria-label="PCdoB — página inicial" className="relative z-10 outline-none focus-visible:opacity-70">
            <Logo className="h-8 w-auto md:h-10" />
          </Link>

          <ul className="hidden items-center gap-10 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <RollLink href={link.href}>{link.label}</RollLink>
              </li>
            ))}
          </ul>

          <div className="relative z-10 flex items-center gap-3">
            <Link
              href={JOIN_LINK.href}
              className="hidden h-11 items-center rounded-full bg-ouro px-6 text-xs font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-300 hover:bg-paper sm:inline-flex"
            >
              {JOIN_LINK.label}
            </Link>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((value) => !value)}
              className="group flex h-11 items-center gap-3 rounded-full border border-paper/25 pl-5 pr-4 text-xs font-bold uppercase tracking-[0.16em] transition-colors duration-300 hover:border-paper"
            >
              <span>{open ? "Fechar" : "Menu"}</span>
              <span aria-hidden="true" className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ease-out-expo ${
                    open ? "top-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ease-out-expo ${
                    open ? "top-1/2 -rotate-45" : "bottom-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && <MenuOverlay id={menuId} onNavigate={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

/** Link com texto que "rola" para cima no hover. */
function RollLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className="group relative block overflow-hidden text-xs font-semibold uppercase tracking-[0.18em]">
      <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">{children}</span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block translate-y-full text-ouro transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
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
