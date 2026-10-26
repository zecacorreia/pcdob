"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState, type FormEvent } from "react";

import { EASE_OUT_EXPO } from "@/lib/motion";

type Status = { state: "idle" | "loading" | "success" } | { state: "error"; message: string };

/**
 * Formulário de newsletter com consentimento explícito (LGPD) e honeypot
 * anti-robô. Envia para /api/newsletter, que repassa ao provedor.
 */
export function NewsletterForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const emailId = useId();
  const consentId = useId();
  const messageId = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus({ state: "loading" });

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          consent: data.get("consent") === "on",
          company: data.get("company"),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Não foi possível concluir agora.");
      setStatus({ state: "success" });
      form.reset();
    } catch (error) {
      setStatus({ state: "error", message: error instanceof Error ? error.message : "Erro inesperado." });
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status.state === "success" ? (
        <motion.div
          key="success"
          role="status"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="flex items-start gap-4 border-b border-paper/40 pb-6"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ouro text-ink" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
              <path d="m2 8.5 4 4 8-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
            </svg>
          </span>
          <div>
            <p className="font-display text-xl font-extrabold uppercase">Inscrição confirmada!</p>
            <p className="mt-1 text-sm text-paper/80">Você vai receber as notícias do partido no seu e-mail.</p>
            <button
              type="button"
              onClick={() => setStatus({ state: "idle" })}
              className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] underline-offset-4 hover:underline"
            >
              Inscrever outro e-mail
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          noValidate={false}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4 }}
          aria-describedby={status.state === "error" ? messageId : undefined}
        >
          <div className="group relative flex items-center border-b border-paper/40 transition-colors focus-within:border-paper">
            <label htmlFor={emailId} className="sr-only">
              Seu e-mail
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="seu@email.com"
              disabled={status.state === "loading"}
              className="min-w-0 flex-1 bg-transparent py-4 font-display text-xl font-bold text-paper placeholder:text-paper/45 focus:outline-none md:text-3xl"
            />
            <button
              type="submit"
              disabled={status.state === "loading"}
              className="group/btn ml-4 flex h-12 shrink-0 items-center gap-3 rounded-full bg-ouro px-5 text-xs font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-300 hover:bg-paper disabled:opacity-60 md:h-14 md:px-7"
            >
              {status.state === "loading" ? "Enviando…" : "Assinar"}
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-1"
              >
                <path d="M1 8h14M9 2l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
              </svg>
            </button>
          </div>

          {/* Honeypot — invisível para pessoas e leitores de tela. */}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

          <div className="mt-5 flex items-start gap-3">
            <input
              id={consentId}
              name="consent"
              type="checkbox"
              required
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-sm border border-paper/60 bg-transparent bg-center bg-no-repeat transition-colors checked:border-ouro checked:bg-ouro checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2016%2016%22%3E%3Cpath%20d=%22m3%208.5%203.5%203.5L13%204.5%22%20stroke=%22%23110A0A%22%20stroke-width=%222.2%22%20fill=%22none%22/%3E%3C/svg%3E')] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
            />
            <label htmlFor={consentId} className="cursor-pointer text-xs leading-relaxed text-paper/80">
              Aceito receber comunicações do PCdoB por e-mail. Posso cancelar a qualquer momento pelo link em cada
              mensagem.
            </label>
          </div>

          {status.state === "error" && (
            <p id={messageId} role="alert" className="mt-4 text-sm font-semibold text-ouro">
              {status.message}
            </p>
          )}
        </motion.form>
      )}
    </AnimatePresence>
  );
}
