import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ConsentManager } from "@/components/privacy/ConsentManager";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE, absoluteUrl } from "@/lib/site";

import "./globals.css";

/** Display: Archivo com eixo de largura (wdth) para manchetes expandidas. */
const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.legalName}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
  },
  twitter: { card: "summary_large_image", site: "@pcdob_oficial" },
};

export const viewport: Viewport = {
  themeColor: "#110A0A",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
      <body>
        <SmoothScroll>
          <a
            href="#conteudo"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ouro focus:px-5 focus:py-3 focus:text-ink"
          >
            Pular para o conteúdo
          </a>
          <Navbar />
          {children}
          <Footer />
          <ConsentManager />
        </SmoothScroll>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "PoliticalParty",
            name: SITE.legalName,
            alternateName: SITE.name,
            url: SITE.url,
            logo: absoluteUrl("/brand/pcdob-logo.svg"),
            foundingDate: SITE.foundingDate,
            sameAs: SITE.sameAs,
          }}
        />
      </body>
    </html>
  );
}
