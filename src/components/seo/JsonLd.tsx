/**
 * Dados estruturados (schema.org) para buscadores. `<` é escapado para que
 * nenhum conteúdo vindo do CMS consiga fechar a tag <script>.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
