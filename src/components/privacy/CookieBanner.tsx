"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";

import { EASE_OUT_EXPO } from "@/lib/motion";

type CookieBannerProps = {
  open: boolean;
  /** Valor atual (ao reabrir as preferências). */
  initialAnalytics?: boolean;
  onChoice: (analytics: boolean) => void;
};

/**
 * Banner de consentimento. "Recusar" e "Aceitar" têm o mesmo peso visual
 * (sem padrão enganoso) e há uma opção de personalizar por categoria.
 */
export function CookieBanner({ open, initialAnalytics = false, onChoice }: CookieBannerProps) {
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const titleId = useId();
  const descriptionId = useId();

  const button =
    "h-11 flex-1 rounded-full px-5 text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-300";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          initial={{ y: "120%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "120%", opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          className="fixed inset-x-3 bottom-3 z-[70] rounded-2xl border border-paper/10 bg-ink p-5 text-paper shadow-2xl shadow-ink/50 md:inset-x-auto md:bottom-6 md:left-6 md:w-[26rem] md:p-6"
        >
          <p id={titleId} className="font-display text-lg font-extrabold uppercase [font-stretch:105%]">
            Cookies e privacidade
          </p>
          <p id={descriptionId} className="mt-2 text-sm leading-relaxed text-paper/70">
            Usamos cookies de estatística para entender como o site é usado — só se você permitir. Saiba mais na{" "}
            <Link href="/privacidade" className="text-ouro underline underline-offset-4">
              Política de Privacidade
            </Link>
            .
          </p>

          <AnimatePresence initial={false}>
            {customizing && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                className="overflow-hidden"
              >
                <ul className="mt-4 divide-y divide-paper/10 border-y border-paper/10">
                  <li className="flex items-center justify-between gap-4 py-3">
                    <span>
                      <span className="block text-sm font-semibold">Necessários</span>
                      <span className="block text-xs text-paper/60">Guardam sua escolha de privacidade.</span>
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-paper/50">Sempre ativos</span>
                  </li>
                  <li className="flex items-center justify-between gap-4 py-3">
                    <span>
                      <span className="block text-sm font-semibold">Estatísticas</span>
                      <span className="block text-xs text-paper/60">Google Analytics: páginas visitadas, de forma agregada.</span>
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={analytics}
                      aria-label="Permitir cookies de estatística"
                      onClick={() => setAnalytics((value) => !value)}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
                        analytics ? "bg-ouro" : "bg-paper/20"
                      }`}
                    >
                      <span
                        className={`absolute left-0 top-0.5 h-5 w-5 rounded-full transition-transform duration-300 ease-out-expo ${
                          analytics ? "translate-x-[1.375rem] bg-ink" : "translate-x-0.5 bg-paper"
                        }`}
                      />
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-5 flex gap-2">
            {customizing ? (
              <button type="button" onClick={() => onChoice(analytics)} className={`${button} bg-ouro text-ink hover:bg-paper`}>
                Salvar preferências
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onChoice(false)}
                  className={`${button} border border-paper/30 hover:border-paper`}
                >
                  Recusar
                </button>
                <button type="button" onClick={() => onChoice(true)} className={`${button} bg-ouro text-ink hover:bg-paper`}>
                  Aceitar
                </button>
              </>
            )}
          </div>
          {!customizing && (
            <button
              type="button"
              onClick={() => setCustomizing(true)}
              className="mt-3 w-full text-center text-xs font-semibold uppercase tracking-[0.18em] text-paper/60 underline-offset-4 hover:text-paper hover:underline"
            >
              Personalizar
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
