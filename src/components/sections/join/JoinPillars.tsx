"use client";

import { motion } from "framer-motion";

import { RevealText } from "@/components/motion/Reveal";
import { joinPillars } from "@/data/join";
import { EASE_OUT_EXPO } from "@/lib/motion";

/**
 * "Um partido com lado. Com projeto. Com povo." — três colunas com a
 * palavra-chave gigante em contorno que se preenche no hover.
 */
export function JoinPillars() {
  return (
    <section aria-labelledby="pillars-title" className="bg-vermelho py-24 text-paper md:py-36">
      <div className="container">
        <RevealText
          id="pillars-title"
          lines={["Um partido com lado.", "Com projeto.", "Com povo."]}
          accentLine={2}
          accentClassName="text-ouro"
          className="mb-16 font-display text-display-lg font-black uppercase [font-stretch:115%] md:mb-24"
        />

        <ul className="grid border-t border-paper/30 lg:grid-cols-3">
          {joinPillars.map((pillar, index) => (
            <motion.li
              key={pillar.word}
              className="group relative overflow-hidden border-b border-paper/30 py-10 lg:border-b-0 lg:border-r lg:px-8 lg:py-14 lg:last:border-r-0 lg:first:pl-0"
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: index * 0.1 }}
            >
              <span className="text-xs font-semibold tabular-nums tracking-[0.2em] text-paper/60">0{index + 1}</span>
              <p
                aria-hidden="true"
                // Em 3 colunas a palavra mais longa ("PROJETO") precisa caber em ~1/3 da tela.
                className="text-outline mt-6 font-display text-[clamp(2.75rem,10vw,5rem)] font-black lg:text-[clamp(2.5rem,3.8vw,5rem)] uppercase leading-[0.85] text-paper transition-colors duration-500 [font-stretch:115%] group-hover:[-webkit-text-fill-color:currentColor]"
              >
                {pillar.word}
              </p>
              <h3 className="mt-8 font-display text-xl font-extrabold uppercase [font-stretch:105%]">{pillar.title}</h3>
              <p className="mt-3 max-w-xs text-base leading-relaxed text-paper/80">{pillar.text}</p>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-ouro transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
              />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
