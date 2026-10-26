import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { ScrollHighlightText } from "@/components/motion/ScrollHighlightText";
import { JoinFaq } from "@/components/sections/join/JoinFaq";
import { JoinHero } from "@/components/sections/join/JoinHero";
import { JoinPillars } from "@/components/sections/join/JoinPillars";
import { JoinSteps } from "@/components/sections/join/JoinSteps";

export const metadata: Metadata = {
  title: "Filie-se",
  description:
    "O futuro tem partido. Filie-se ao PCdoB pela plataforma oficial PCdoB Digital e organize-se com quem luta, trabalha, estuda e resiste.",
};

export default function JoinPage() {
  return (
    <>
      <JoinHero />

      {/* Manifesto: as palavras acendem com a rolagem. */}
      <section aria-label="Manifesto" className="bg-paper py-28 text-ink md:py-44">
        <div className="container">
          <ScrollHighlightText
            text="Essa não é só mais uma chamada pra “fazer parte”. É um convite pra se organizar com um projeto de país que coloca o povo no centro."
            highlight={["organizar", "povo"]}
            className="max-w-6xl font-display text-display-md font-extrabold uppercase leading-[1.05] [font-stretch:110%] md:text-display-lg"
          />
        </div>
      </section>

      <JoinPillars />

      {/* Juventude */}
      <section aria-label="Juventude" className="bg-ink py-24 text-paper md:py-36">
        <div className="container">
          <Reveal>
            <blockquote className="max-w-5xl">
              <p className="font-display text-display-md font-extrabold uppercase leading-[1.05] [font-stretch:110%]">
                A juventude sempre esteve na linha de frente da história. Agora, mais do que nunca, precisa ocupar esse
                papel com <span className="text-ouro">coragem, consciência e coletividade.</span>
              </p>
            </blockquote>
          </Reveal>
        </div>
      </section>

      <JoinSteps />
      <JoinFaq />
    </>
  );
}
