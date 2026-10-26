import type { Config } from "tailwindcss";

/**
 * Design tokens do PCdoB.
 *
 * - `vermelho` é a cor institucional e carrega a maior parte da identidade.
 * - `ouro` vem do símbolo do logo (#FFFF00); use a versão `DEFAULT`, mais
 *   quente, em superfícies grandes e reserve `ouro.logo` para a marca.
 * - `verde` é um acento pontual (selos, estados de sucesso, detalhes) —
 *   nunca como cor de fundo dominante.
 * - `ink` e `paper` são os neutros "premium": preto quente e off-white,
 *   no lugar de #000/#FFF puros.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  future: {
    // Evita estados de hover "presos" em telas de toque.
    hoverOnlyWhenSupported: true,
  },
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem", xl: "3rem" },
      screens: { "2xl": "1600px" },
    },
    extend: {
      colors: {
        vermelho: {
          50: "#FFF1F1",
          100: "#FFDFE0",
          200: "#FFC5C6",
          300: "#FF9C9E",
          400: "#FF6366",
          500: "#F83337",
          600: "#D7141A",
          700: "#B30D12",
          800: "#940F13",
          900: "#7A1316",
          950: "#430406",
          DEFAULT: "#D7141A",
        },
        ouro: {
          soft: "#FFE866",
          DEFAULT: "#FFD400",
          logo: "#FFFF00",
        },
        verde: {
          light: "#2BB673",
          DEFAULT: "#00873E",
          dark: "#005C2A",
        },
        ink: {
          700: "#2A1D1D",
          800: "#1C1212",
          DEFAULT: "#110A0A",
        },
        paper: {
          dim: "#E9E2D8",
          DEFAULT: "#F6F2EC",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Escala fluida para a tipografia "bold" das manchetes.
        // Limitado também pela altura (svh) para a manchete do Hero caber
        // junto com os CTAs em telas baixas.
        "display-2xl": ["clamp(3.25rem, min(11vw, 15svh), 13rem)", { lineHeight: "0.82", letterSpacing: "-0.04em" }],
        // Mínimo de 2.25rem: com 3rem, palavras longas ("PRIVACIDADE", "COMUNISTA")
        // não cabiam em celulares de 375px. Acima de ~400px vale o 9vw.
        "display-xl": ["clamp(2.25rem, 9vw, 9rem)", { lineHeight: "0.86", letterSpacing: "-0.035em" }],
        // Em celulares acompanha 8vw (30px em 375, 31px em 390/393, 34px em 430): a linha mais
        // longa ("dentro da luta", ~10.3em) cabe nos 350px úteis de um iPhone 14. De ~525px a
        // ~765px fica em 42px e depois volta à escala original de 5.5vw, limitada a 5.5rem.
        "display-lg": [
          "clamp(1.875rem, 8vw, min(5.5rem, max(2.625rem, 5.5vw)))",
          { lineHeight: "0.9", letterSpacing: "-0.03em" },
        ],
        "display-md": ["clamp(1.75rem, 3vw, 3rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-quart": "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "scroll-line": {
          "0%": { transform: "scaleY(0)", transformOrigin: "top" },
          "50%": { transform: "scaleY(1)", transformOrigin: "top" },
          "51%": { transform: "scaleY(1)", transformOrigin: "bottom" },
          "100%": { transform: "scaleY(0)", transformOrigin: "bottom" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "scroll-line": "scroll-line 2.4s cubic-bezier(0.76, 0, 0.24, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
