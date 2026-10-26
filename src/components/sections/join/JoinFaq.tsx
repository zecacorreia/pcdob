"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { joinFaq } from "@/data/join";
import { EASE_OUT_EXPO } from "@/lib/motion";

/** Perguntas frequentes em acordeão (uma aberta por vez). */
export function JoinFaq() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section aria-labelledby="faq-title" className="bg-paper pb-24 text-ink md:pb-36">
      <div className="container grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <h2 id="faq-title" className="font-display text-display-md font-extrabold uppercase [font-stretch:110%]">
            Dúvidas <span className="text-vermelho">frequentes</span>
          </h2>
        </Reveal>

        <ul className="border-t border-ink/15 lg:col-span-7">
          {joinFaq.map((item, index) => {
            const isOpen = open === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;
            return (
              <li key={item.question} className="border-b border-ink/15">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-8"
                  >
                    <span className="text-lg font-semibold transition-colors duration-300 group-hover:text-vermelho md:text-xl">
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                        isOpen ? "border-vermelho bg-vermelho text-paper" : "border-ink/20 group-hover:border-vermelho"
                      }`}
                    >
                      <span className="absolute h-px w-3.5 bg-current" />
                      <span
                        className={`absolute h-3.5 w-px bg-current transition-transform duration-500 ease-out-expo ${
                          isOpen ? "rotate-90 scale-y-0" : ""
                        }`}
                      />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-8 text-base leading-relaxed text-ink/70">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
