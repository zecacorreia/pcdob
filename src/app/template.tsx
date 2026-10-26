"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { EASE_OUT_EXPO } from "@/lib/motion";

/**
 * `template.tsx` é remontado a cada navegação no App Router — o lugar
 * certo para a transição de entrada entre páginas.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.main
      id="conteudo"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.main>
  );
}
