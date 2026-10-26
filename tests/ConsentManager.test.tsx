import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/script", () => ({
  // Renderiza um marcador no lugar do <Script> para o teste ver o que seria carregado.
  default: ({ src, id }: { src?: string; id?: string }) => <span data-testid="script" data-src={src} data-id={id} />,
}));

/** O ID do GA é lido no carregamento do módulo — reimporta com o env de cada teste. */
async function renderManager(gaId: string) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", gaId);
  const { ConsentManager } = await import("@/components/privacy/ConsentManager");
  const consent = await import("@/lib/consent");
  render(<ConsentManager />);
  return consent;
}

describe("ConsentManager", () => {
  it("não mostra banner nem carrega nada sem GA configurado", async () => {
    await renderManager("");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByTestId("script")).not.toBeInTheDocument();
  });

  it("mostra o banner e não carrega o GA antes da escolha", async () => {
    await renderManager("G-TESTE123");
    expect(await screen.findByRole("dialog", { name: "Cookies e privacidade" })).toBeInTheDocument();
    expect(screen.queryByTestId("script")).not.toBeInTheDocument();
  });

  it("ao aceitar, salva a escolha e carrega o GA", async () => {
    const user = userEvent.setup();
    const { readConsent } = await renderManager("G-TESTE123");

    await user.click(await screen.findByRole("button", { name: "Aceitar" }));

    expect(readConsent()?.analytics).toBe(true);
    expect(screen.getAllByTestId("script")[0]).toHaveAttribute(
      "data-src",
      "https://www.googletagmanager.com/gtag/js?id=G-TESTE123",
    );
  });

  it("ao recusar, salva a escolha e não carrega o GA", async () => {
    const user = userEvent.setup();
    const { readConsent } = await renderManager("G-TESTE123");

    await user.click(await screen.findByRole("button", { name: "Recusar" }));

    expect(readConsent()?.analytics).toBe(false);
    expect(screen.queryByTestId("script")).not.toBeInTheDocument();
    expect(window["ga-disable-G-TESTE123"]).toBe(true);
  });

  it("permite personalizar e reabrir as preferências depois", async () => {
    const user = userEvent.setup();
    const { readConsent, openConsentPreferences } = await renderManager("G-TESTE123");

    await user.click(await screen.findByRole("button", { name: "Personalizar" }));
    const toggle = screen.getByRole("switch", { name: "Permitir cookies de estatística" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    await user.click(toggle);
    await user.click(screen.getByRole("button", { name: "Salvar preferências" }));
    expect(readConsent()?.analytics).toBe(true);

    act(() => openConsentPreferences());
    expect(await screen.findByRole("dialog", { name: "Cookies e privacidade" })).toBeInTheDocument();
  });

  it("não mostra o banner para quem já escolheu", async () => {
    const consent = await import("@/lib/consent");
    consent.writeConsent(false);
    await renderManager("G-TESTE123");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
