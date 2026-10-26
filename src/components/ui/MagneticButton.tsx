"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  /** Quanto o botão "segue" o cursor (0 a 1). */
  strength?: number;
  className?: string;
  /** Abre em nova aba (links para outros sites). */
  external?: boolean;
};

const MotionLink = motion.create(Link);

const VARIANTS = {
  primary: { base: "bg-ouro text-ink", fill: "bg-paper" },
  ghost: { base: "border border-paper/30 text-paper", fill: "bg-vermelho" },
} as const;

/**
 * CTA com duas micro-interações:
 * 1. efeito magnético — o botão é atraído pelo cursor;
 * 2. "roll" do texto + preenchimento subindo de baixo no hover.
 */
export function MagneticButton({
  href,
  children,
  variant = "primary",
  strength = 0.35,
  className = "",
  external = false,
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  function handleMove(event: MouseEvent<HTMLAnchorElement>) {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * strength);
    y.set((event.clientY - rect.top - rect.height / 2) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  const styles = VARIANTS[variant];

  return (
    <MotionLink
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x, y }}
      className={`group relative inline-flex h-14 items-center overflow-hidden rounded-full px-8 text-sm font-semibold uppercase tracking-[0.14em] outline-none focus-visible:ring-2 focus-visible:ring-ouro focus-visible:ring-offset-2 focus-visible:ring-offset-ink md:h-16 md:px-10 ${styles.base} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 translate-y-full rounded-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0 ${styles.fill}`}
      />
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden="true"
          className={`absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0 ${variant === "primary" ? "text-vermelho" : "text-paper"}`}
        >
          {children}
        </span>
      </span>
    </MotionLink>
  );
}
