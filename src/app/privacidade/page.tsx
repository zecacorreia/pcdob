import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { CookiePreferencesButton } from "@/components/privacy/CookiePreferencesButton";
import { MEMBERSHIP_URLS } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como o site do PCdoB trata dados pessoais e cookies, de acordo com a LGPD.",
  alternates: { canonical: "/privacidade" },
};

/**
 * Descreve apenas o que ESTE site faz de fato (newsletter, cookies de
 * estatística, preferência de consentimento). Revisar com o jurídico antes
 * de publicar e ao incluir novos tratamentos de dados.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        tone="paper"
        eyebrow="Privacidade"
        title={["Política de", "privacidade"]}
        description="Como este site trata seus dados pessoais e cookies, nos termos da Lei Geral de Proteção de Dados (Lei 13.709/2018)."
      />

      <div className="bg-paper pb-24 text-ink md:pb-36">
        <div className="article-body container max-w-3xl">
          <h2>Quais dados coletamos</h2>
          <ul>
            <li>
              <strong>Newsletter:</strong> o e-mail que você informar ao se inscrever e a data e hora do seu
              consentimento.
            </li>
            <li>
              <strong>Estatísticas de uso (somente se você permitir):</strong> o Google Analytics registra, de forma
              agregada, páginas visitadas, tempo de navegação, tipo de dispositivo e região aproximada.
            </li>
            <li>
              <strong>Sua escolha de cookies:</strong> fica salva apenas no seu navegador, para não perguntarmos de novo
              a cada visita.
            </li>
          </ul>

          <h2>Para que usamos</h2>
          <p>
            O e-mail é usado exclusivamente para enviar a newsletter do partido. As estatísticas servem para melhorar o
            site e entender quais conteúdos interessam mais às pessoas. Não vendemos dados pessoais.
          </p>

          <h2>Filiação partidária</h2>
          <p>
            A filiação não é feita neste site: ela acontece na plataforma oficial{" "}
            <a href={MEMBERSHIP_URLS.join}>PCdoB Digital</a>, que tem suas próprias regras de tratamento de dados.
          </p>

          <h2>Cookies</h2>
          <p>
            Cookies de estatística só são criados depois que você aceita no aviso de cookies. Você pode mudar sua escolha
            a qualquer momento — ao recusar, os cookies de estatística são apagados.
          </p>
          <p>
            <CookiePreferencesButton className="font-medium text-vermelho underline underline-offset-4" />
          </p>

          <h2>Seus direitos</h2>
          <p>
            Pela LGPD, você pode confirmar se tratamos seus dados, acessá-los, corrigi-los, pedir sua eliminação e
            revogar o consentimento. Para cancelar a newsletter, use o link presente em cada mensagem. Para os demais
            pedidos, fale com o partido pelos canais oficiais indicados no rodapé.
          </p>
        </div>
      </div>
    </>
  );
}
