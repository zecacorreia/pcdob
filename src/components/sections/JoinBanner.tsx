import { LogoSymbol } from "@/components/brand/Logo";
import { RevealText } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

/** Faixa de chamada para a filiação, usada no fim das páginas internas. */
export function JoinBanner() {
  return (
    <section aria-labelledby="join-banner-title" className="relative overflow-hidden bg-ink py-24 text-paper md:py-32">
      <LogoSymbol
        aria-hidden="true"
        className="pointer-events-none absolute -right-[10%] top-1/2 h-auto w-[60vw] -translate-y-1/2 text-vermelho/15 md:w-[40vw]"
      />
      <div className="container relative flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <RevealText
          id="join-banner-title"
          lines={["O futuro", "tem partido."]}
          accentLine={1}
          accentClassName="text-ouro"
          className="font-display text-display-lg font-black uppercase [font-stretch:115%]"
        />
        <MagneticButton href="/filie-se">Filie-se</MagneticButton>
      </div>
    </section>
  );
}
