import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Documents } from "@/components/sections/Documents";
import type { PartyDocument } from "@/data/documents";

const docs: PartyDocument[] = [
  { id: "a", title: "Resolução Política", category: "Resoluções", date: "2025-11-24", href: "https://x/a.pdf", format: "PDF", size: 1_302_484 },
  { id: "b", title: "Estatuto do PCdoB", category: "Programa e Estatuto", date: "2022-08-22", href: "https://x/b", format: "Página" },
  { id: "c", title: "Guia eleitoral", category: "Eleições 2026", date: "2026-08-15", href: "https://x/c.pdf", format: "PDF", size: 9_387_463 },
];

/** Links das linhas de documento (identificados pelo aria-label "Título — ação"). */
function rows() {
  return screen.queryAllByRole("link").filter((link) => link.getAttribute("aria-label")?.includes(" — "));
}

describe("Documents", () => {
  it("lista do mais recente para o mais antigo, com formato e tamanho", () => {
    render(<Documents documents={docs} />);
    const labels = rows().map((link) => link.getAttribute("aria-label"));
    expect(labels).toEqual([
      "Guia eleitoral — baixar PDF, 9 MB",
      "Resolução Política — baixar PDF, 1,2 MB",
      "Estatuto do PCdoB — ler online",
    ]);
  });

  it("filtra por categoria", async () => {
    const user = userEvent.setup();
    render(<Documents documents={docs} />);

    await user.click(screen.getByRole("button", { name: /Resoluções/ }));

    expect(screen.getByRole("button", { name: /Resoluções/ })).toHaveAttribute("aria-pressed", "true");
    expect(await screen.findByText("1 documento encontrado")).toBeInTheDocument();
  });

  it("busca ignorando acentos e mostra estado vazio", async () => {
    const user = userEvent.setup();
    render(<Documents documents={docs} />);
    const search = screen.getByLabelText("Buscar documento");

    await user.type(search, "resolucao");
    expect(await screen.findByText("1 documento encontrado")).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "inexistente");
    expect(await screen.findByText("Nada por aqui")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Limpar busca" }));
    expect(await screen.findByText("3 documentos encontrados")).toBeInTheDocument();
  });
});
