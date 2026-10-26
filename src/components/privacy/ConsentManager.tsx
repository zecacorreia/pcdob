"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

import { CookieBanner } from "@/components/privacy/CookieBanner";
import { ANALYTICS_ENABLED, GA_MEASUREMENT_ID, clearAnalyticsCookies } from "@/lib/analytics";
import { OPEN_CONSENT_EVENT, readConsent, writeConsent, type ConsentState } from "@/lib/consent";

declare global {
  interface Window {
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

/**
 * Orquestra consentimento + analytics: mostra o banner enquanto não houver
 * escolha, carrega o GA só com consentimento e o desliga se for revogado.
 */
export function ConsentManager() {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [bannerOpen, setBannerOpen] = useState(false);
  // A key remonta o banner ao reabrir, para refletir a escolha atual.
  const [bannerKey, setBannerKey] = useState(0);

  useEffect(() => {
    if (!ANALYTICS_ENABLED) return;
    const saved = readConsent();
    setConsent(saved);
    if (!saved) setBannerOpen(true);

    const reopen = () => {
      setBannerKey((key) => key + 1);
      setBannerOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  function handleChoice(analytics: boolean) {
    const revoked = consent?.analytics === true && !analytics;
    const next = writeConsent(analytics);
    setConsent(next);
    setBannerOpen(false);

    window[`ga-disable-${GA_MEASUREMENT_ID}`] = !analytics;
    if (revoked) clearAnalyticsCookies();
  }

  if (!ANALYTICS_ENABLED) return null;

  return (
    <>
      <CookieBanner key={bannerKey} open={bannerOpen} initialAnalytics={consent?.analytics} onChoice={handleChoice} />

      {consent?.analytics && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
window['ga-disable-${GA_MEASUREMENT_ID}']=false;
gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`}
          </Script>
        </>
      )}
    </>
  );
}
