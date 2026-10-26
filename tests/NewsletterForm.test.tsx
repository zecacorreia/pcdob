import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NewsletterForm } from "@/components/ui/NewsletterForm";

describe("NewsletterForm", () => {
  it("envia e-mail + consentimento e mostra a confirmação", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ ok: true }));
    const user = userEvent.setup();
    render(<NewsletterForm />);

    await user.type(screen.getByLabelText("Seu e-mail"), "pessoa@exemplo.com");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /assinar/i }));

    expect(await screen.findByText("Inscrição confirmada!")).toBeInTheDocument();
    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(body).toMatchObject({ email: "pessoa@exemplo.com", consent: true });
  });

  it("mostra a mensagem de erro devolvida pela API", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({ error: "Inscrições temporariamente indisponíveis." }, { status: 503 }),
    );
    const user = userEvent.setup();
    render(<NewsletterForm />);

    await user.type(screen.getByLabelText("Seu e-mail"), "pessoa@exemplo.com");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /assinar/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Inscrições temporariamente indisponíveis.");
  });

  it("não envia sem marcar o consentimento (validação nativa)", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const user = userEvent.setup();
    render(<NewsletterForm />);

    await user.type(screen.getByLabelText("Seu e-mail"), "pessoa@exemplo.com");
    await user.click(screen.getByRole("button", { name: /assinar/i }));

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
