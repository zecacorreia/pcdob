import { NextResponse } from "next/server";

/**
 * Inscrição na newsletter.
 *
 * O provedor (RD Station, Brevo, Mailchimp, n8n...) fica atrás de um webhook
 * configurável — trocar de ferramenta não exige mudar o front-end.
 *
 *   NEWSLETTER_WEBHOOK_URL   URL que recebe { email, consentAt, source } via POST
 *   NEWSLETTER_WEBHOOK_TOKEN (opcional) enviado como Bearer token
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Payload = {
  email?: unknown;
  consent?: unknown;
  /** Honeypot: campo invisível que só robôs preenchem. */
  company?: unknown;
};

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  // Robô: responde sucesso sem fazer nada.
  if (typeof body.company === "string" && body.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 422 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ error: "É preciso concordar com o recebimento de e-mails." }, { status: 422 });
  }

  const webhook = process.env.NEWSLETTER_WEBHOOK_URL;
  if (!webhook) {
    // Em desenvolvimento simulamos sucesso para permitir testar a interface.
    if (process.env.NODE_ENV === "development") {
      console.info("[newsletter] (dev) inscrição simulada:", email);
      return NextResponse.json({ ok: true });
    }
    console.error("[newsletter] NEWSLETTER_WEBHOOK_URL não configurada");
    return NextResponse.json({ error: "Inscrições temporariamente indisponíveis." }, { status: 503 });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.NEWSLETTER_WEBHOOK_TOKEN && {
          Authorization: `Bearer ${process.env.NEWSLETTER_WEBHOOK_TOKEN}`,
        }),
      },
      // Registro do consentimento exigido pela LGPD.
      body: JSON.stringify({ email, consentAt: new Date().toISOString(), source: "site-footer" }),
    });
    if (!res.ok) throw new Error(`Webhook respondeu ${res.status}`);
  } catch (error) {
    console.error("[newsletter] Falha ao encaminhar inscrição:", error);
    return NextResponse.json({ error: "Não foi possível concluir agora. Tente novamente." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
