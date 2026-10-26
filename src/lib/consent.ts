/**
 * Consentimento de cookies (LGPD). A escolha fica salva no navegador; nenhum
 * cookie de estatística é criado antes de a pessoa aceitar.
 */

export const CONSENT_STORAGE_KEY = "pcdob-consent";
/** Suba a versão quando os usos de cookies mudarem: o banner volta a aparecer. */
export const CONSENT_VERSION = 1;
/** Evento global para reabrir o banner (link "Preferências de cookies"). */
export const OPEN_CONSENT_EVENT = "pcdob:open-consent";

export type ConsentState = {
  version: number;
  analytics: boolean;
  /** ISO 8601 — registro de quando a escolha foi feita. */
  updatedAt: string;
};

function getStorage(storage?: Storage): Storage | null {
  if (storage) return storage;
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null; // modo privado / armazenamento bloqueado
  }
}

/** Lê a escolha salva; `null` se não houver escolha válida para a versão atual. */
export function readConsent(storage?: Storage): ConsentState | null {
  try {
    const raw = getStorage(storage)?.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (parsed.version !== CONSENT_VERSION || typeof parsed.analytics !== "boolean") return null;
    return parsed as ConsentState;
  } catch {
    return null;
  }
}

export function writeConsent(analytics: boolean, storage?: Storage, now = new Date()): ConsentState {
  const state: ConsentState = { version: CONSENT_VERSION, analytics, updatedAt: now.toISOString() };
  try {
    getStorage(storage)?.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Sem armazenamento: a escolha vale só para esta visita.
  }
  return state;
}

export function openConsentPreferences() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
