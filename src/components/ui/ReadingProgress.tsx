"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Barra fina no topo que acompanha o progresso de leitura da página. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.3 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-ouro"
      style={{ scaleX }}
    />
  );
}
