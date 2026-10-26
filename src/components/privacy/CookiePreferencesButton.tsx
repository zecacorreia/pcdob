"use client";

import { ANALYTICS_ENABLED } from "@/lib/analytics";
import { openConsentPreferences } from "@/lib/consent";

/** Reabre o banner de cookies. Some quando não há analytics configurado. */
export function CookiePreferencesButton({ className }: { className?: string }) {
  if (!ANALYTICS_ENABLED) return null;

  return (
    <button type="button" onClick={openConsentPreferences} className={className}>
      Preferências de cookies
    </button>
  );
}
