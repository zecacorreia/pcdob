import type { Variants } from "framer-motion";

/** Curvas compartilhadas — mantêm todas as animações com o mesmo "peso". */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1] as const;

/** Fade + slide-up usado nas entradas acionadas por scroll. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO, delay },
  }),
};

/** Linha de texto que "sobe" de dentro de uma máscara (overflow-hidden). */
export const lineReveal: Variants = {
  hidden: { y: "110%", rotate: 3 },
  visible: (delay: number = 0) => ({
    y: "0%",
    rotate: 0,
    transition: { duration: 1.1, ease: EASE_OUT_EXPO, delay },
  }),
};
