import { describe, expect, it } from "vitest";

import { CONSENT_STORAGE_KEY, CONSENT_VERSION, readConsent, writeConsent } from "@/lib/consent";

describe("consentimento de cookies", () => {
  it("não há consentimento antes da primeira escolha", () => {
    expect(readConsent()).toBeNull();
  });

  it("grava e lê a escolha com data do registro", () => {
    const now = new Date("2026-10-26T12:00:00Z");
    writeConsent(true, undefined, now);
    expect(readConsent()).toEqual({ version: CONSENT_VERSION, analytics: true, updatedAt: now.toISOString() });
  });

  it("ignora escolhas de uma versão anterior da política", () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ version: 0, analytics: true, updatedAt: "x" }));
    expect(readConsent()).toBeNull();
  });

  it("ignora conteúdo corrompido", () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "{nao é json");
    expect(readConsent()).toBeNull();
  });
});
