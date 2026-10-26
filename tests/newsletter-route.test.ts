// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/newsletter/route";

function request(body: unknown) {
  return new Request("http://localhost/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/newsletter", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("rejeita JSON inválido", async () => {
    const res = await POST(request("{"));
    expect(res.status).toBe(400);
  });

  it("rejeita e-mail inválido", async () => {
    const res = await POST(request({ email: "nao-e-email", consent: true }));
    expect(res.status).toBe(422);
  });

  it("exige consentimento explícito", async () => {
    const res = await POST(request({ email: "a@b.com", consent: false }));
    expect(res.status).toBe(422);
  });

  it("finge sucesso para robôs (honeypot) sem chamar o provedor", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("NEWSLETTER_WEBHOOK_URL", "https://hooks.example/newsletter");

    const res = await POST(request({ email: "bot@spam.com", consent: true, company: "ACME" }));
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("encaminha ao webhook com e-mail normalizado e registro do consentimento", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("NEWSLETTER_WEBHOOK_URL", "https://hooks.example/newsletter");
    vi.stubEnv("NEWSLETTER_WEBHOOK_TOKEN", "segredo");

    const res = await POST(request({ email: "  Pessoa@Exemplo.COM ", consent: true }));
    expect(res.status).toBe(200);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://hooks.example/newsletter");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer segredo");
    const payload = JSON.parse(init.body as string);
    expect(payload).toMatchObject({ email: "pessoa@exemplo.com", source: "site-footer" });
    expect(new Date(payload.consentAt).toString()).not.toBe("Invalid Date");
  });

  it("responde 502 quando o provedor falha", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
    vi.stubEnv("NEWSLETTER_WEBHOOK_URL", "https://hooks.example/newsletter");
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await POST(request({ email: "a@b.com", consent: true }));
    expect(res.status).toBe(502);
  });

  it("responde 503 em produção sem webhook configurado", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEWSLETTER_WEBHOOK_URL", "");
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await POST(request({ email: "a@b.com", consent: true }));
    expect(res.status).toBe(503);
  });
});
