"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import { useRef } from "react";

import { LogoSymbol, LogoWordmark } from "@/components/brand/Logo";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { CookiePreferencesButton } from "@/components/privacy/CookiePreferencesButton";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { FOOTER_SITEMAP, SOCIAL_LINKS, type SocialIcon } from "@/lib/navigation";

/**
 * Rodapé em vermelho institucional:
 * newsletter + redes sociais, mapa do site e o lettering gigante "PCdoB",
 * que sobe conforme a página chega ao fim.
 */
export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const lenis = useLenis();

  const { scrollYProgress } = useScroll({ target: footerRef, offset: ["start end", "end end"] });
  const wordmarkY = useTransform(scrollYProgress, [0.4, 1], ["45%", "0%"]);
  const symbolRotate = useTransform(scrollYProgress, [0, 1], [-20, 0]);

  function scrollToTop() {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <footer ref={footerRef} className="relative overflow-hidden bg-vermelho text-paper">
      <div aria-hidden="true" className="bg-grain pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay" />

      <div className="container relative pt-24 md:pt-32">
        {/* ---------- Newsletter + redes ---------- */}
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          {/*
            min-w-0 nos itens do grid: sem ele a coluna nunca encolhe abaixo da largura
            intrínseca do <input> (~250px) e o formulário estoura a tela em celulares.
          */}
          <section id="newsletter" aria-labelledby="newsletter-title" className="min-w-0 lg:col-span-7">
            <Reveal>
              <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-paper/80 md:text-sm">
                <span className="h-px w-10 bg-ouro" aria-hidden="true" />
                Newsletter
              </p>
            </Reveal>
            <RevealText
              id="newsletter-title"
              lines={["Fique por", "dentro da luta"]}
              accentLine={1}
              accentClassName="text-ouro"
              className="font-display text-display-lg font-black uppercase [font-stretch:115%]"
            />
            <Reveal delay={0.15} className="mt-10 max-w-2xl">
              <NewsletterForm />
            </Reveal>
          </section>

          <nav aria-label="Redes sociais" className="min-w-0 lg:col-span-4 lg:col-start-9">
            <Reveal>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-paper/80 md:text-sm">
                Siga o partido
              </p>
            </Reveal>
            <ul className="border-t border-paper/30">
              {SOCIAL_LINKS.map((social, index) => (
                <li key={social.href} className="border-b border-paper/30">
                  <Reveal delay={index * 0.06}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 py-4 outline-none focus-visible:text-ouro md:py-5"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-paper/40 transition-all duration-500 ease-out-expo group-hover:border-ouro group-hover:bg-ouro group-hover:text-ink">
                        <SocialGlyph icon={social.icon} className="h-4 w-4" />
                      </span>
                      <span className="flex-1 transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                        <span className="block font-display text-xl font-extrabold uppercase [font-stretch:105%]">
                          {social.label}
                        </span>
                        <span className="block text-xs text-paper/70">{social.handle}</span>
                      </span>
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                        className="h-4 w-4 -rotate-45 opacity-60 transition-all duration-500 ease-out-expo group-hover:rotate-0 group-hover:text-ouro group-hover:opacity-100"
                      >
                        <path d="M1 8h14M9 2l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                      </svg>
                    </a>
                  </Reveal>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ---------- Mapa do site ---------- */}
        <div className="mt-24 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-paper/30 pt-12 md:mt-32 md:grid-cols-4">
          {FOOTER_SITEMAP.map((group, index) => (
            <Reveal key={group.title} delay={index * 0.06}>
              <nav aria-label={group.title}>
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-paper/60">{group.title}</p>
                <ul className="space-y-3">
                  {group.links.map((link) => {
                    const external = link.href.startsWith("http");
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                          className="group relative inline-block overflow-hidden text-base font-medium md:text-lg"
                        >
                          <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">
                            {link.label}
                          </span>
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 block translate-y-full text-ouro transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
                          >
                            {link.label}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </Reveal>
          ))}

          <Reveal delay={0.2} className="flex md:justify-end">
            <button
              type="button"
              onClick={scrollToTop}
              className="group flex h-fit items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em]"
            >
              Voltar ao topo
              <span className="grid h-14 w-14 place-items-center rounded-full border border-paper/40 transition-all duration-500 ease-out-expo group-hover:border-ouro group-hover:bg-ouro group-hover:text-ink">
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="h-4 w-4 -rotate-90 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1"
                >
                  <path d="M1 8h14M9 2l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                </svg>
              </span>
            </button>
          </Reveal>
        </div>
      </div>

      {/* ---------- Lettering gigante ---------- */}
      <div aria-hidden="true" className="relative mt-20 overflow-hidden md:mt-28">
        <motion.div
          className="container flex items-end gap-[2vw] text-ink"
          style={reduceMotion ? undefined : { y: wordmarkY }}
        >
          <motion.span
            className="w-[24%] shrink-0 text-ouro"
            style={reduceMotion ? undefined : { rotate: symbolRotate }}
          >
            <LogoSymbol className="h-auto w-full" />
          </motion.span>
          <LogoWordmark className="h-auto w-full" />
        </motion.div>
      </div>

      {/* ---------- Barra final ---------- */}
      <div className="relative bg-ink">
        <div className="container flex flex-col gap-3 py-6 text-xs text-paper/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} PCdoB — Partido Comunista do Brasil</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacidade" className="transition-colors hover:text-ouro">
              Política de privacidade
            </Link>
            <CookiePreferencesButton className="transition-colors hover:text-ouro" />
            <p>Fundado em 25 de março de 1922</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */

/** Ícones simplificados das redes (traço/preenchimento em currentColor). */
function SocialGlyph({ icon, className }: { icon: SocialIcon; className?: string }) {
  switch (icon) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
          <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.17h1.7L7.4 4.74H5.58l11.09 14.43Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
          <path d="M16.6 2h-3.4v13.4a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.1a6.3 6.3 0 1 0 5.4 6.3V8.6a7.9 7.9 0 0 0 4.6 1.5V6.7a4.6 4.6 0 0 1-4.6-4.7Z" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
          <path d="M13.5 21v-7.5h2.53l.38-2.94H13.5V8.69c0-.85.24-1.43 1.46-1.43h1.56V4.63A21 21 0 0 0 14.25 4.5c-2.25 0-3.79 1.37-3.79 3.9v2.16H7.92v2.94h2.54V21h3.04Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
          <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
        </svg>
      );
  }
}
