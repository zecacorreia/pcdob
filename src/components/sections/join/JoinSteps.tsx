"use client";

import { motion } from "framer-motion";

import { Reveal, RevealText } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { joinSteps } from "@/data/join";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { MEMBERSHIP_URLS } from "@/lib/navigation";

/** Passo a passo da filiação — linhas numeradas com número gigante. */
export function JoinSteps() {
  return (
    <section id="como-se-filiar" aria-labelledby="steps-title" className="bg-paper py-24 text-ink md:py-36">
      <div className="container grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-vermelho md:text-sm">
                <span className="h-px w-10 bg-vermelho" aria-hidden="true" />
                Como se filiar
              </p>
            </Reveal>
            <RevealText
              id="steps-title"
              lines={["Três passos", "pra entrar", "na luta"]}
              accentLine={2}
              className="font-display text-display-lg font-black uppercase [font-stretch:115%]"
            />
            <Reveal delay={0.2} className="mt-10">
              <MagneticButton href={MEMBERSHIP_URLS.join} external>
                Começar agora
              </MagneticButton>
            </Reveal>
          </div>
        </div>

        <ol className="border-t border-ink/15 lg:col-span-7">
          {joinSteps.map((step, index) => (
            <motion.li
              key={step.title}
              className="group grid grid-cols-[auto_1fr] items-start gap-6 border-b border-ink/15 py-10 md:gap-10 md:py-14"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: index * 0.08 }}
            >
              <span
                aria-hidden="true"
                className="text-outline font-display text-6xl font-black leading-[0.8] text-vermelho transition-colors duration-500 [font-stretch:115%] group-hover:[-webkit-text-fill-color:currentColor] md:text-8xl"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="font-display text-2xl font-extrabold uppercase leading-[0.95] [font-stretch:105%] md:text-4xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-ink/70 md:text-lg">{step.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
