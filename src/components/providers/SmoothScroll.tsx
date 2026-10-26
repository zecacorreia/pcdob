"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Rolagem suave global (Lenis). Desligada para quem prefere menos movimento —
 * nesse caso o scroll nativo do navegador é mantido.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -80 } }}>
      {children}
    </ReactLenis>
  );
}
