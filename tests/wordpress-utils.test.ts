import { describe, expect, it } from "vitest";

import {
  decodeEntities,
  normalizeArticle,
  normalizePost,
  parsePageParam,
  sanitizeArticleHtml,
  type WPPost,
} from "@/lib/wordpress-utils";

const basePost: WPPost = {
  id: 1,
  slug: "uma-materia",
  date: "2026-10-22T20:37:56",
  modified: "2026-10-23T10:00:00",
  link: "https://pcdob.org.br/2026/10/uma-materia/",
  title: { rendered: "Lula &#8211; vitória &amp; democracia" },
  excerpt: { rendered: "<p>Resumo &hellip;</p>" },
  content: { rendered: "<p>Corpo</p>" },
  _embedded: {
    "wp:featuredmedia": [{ source_url: "https://pcdob.org.br/wp-content/uploads/foto.png", alt_text: "" }],
    "wp:term": [
      [{ taxonomy: "category", name: "Sem categoria" }, { taxonomy: "category", name: "Notícias" }],
      [{ taxonomy: "post_tag", name: "Eleições" }],
      [{ taxonomy: "autor", name: "Priscila Lobregatte" }],
    ],
  },
};

describe("decodeEntities", () => {
  it("decodifica entidades numéricas, hexadecimais e nomeadas", () => {
    expect(decodeEntities("A &#8211; B &#x2014; C &amp; D &hellip;")).toBe("A – B — C & D …");
  });

  it("mantém entidades desconhecidas intactas", () => {
    expect(decodeEntities("&naoexiste;")).toBe("&naoexiste;");
  });
});

describe("normalizePost", () => {
  it("normaliza título, resumo, categoria, imagem e rota interna", () => {
    const item = normalizePost(basePost);
    expect(item.title).toBe("Lula – vitória & democracia");
    expect(item.excerpt).toBe("Resumo …");
    expect(item.category).toBe("Notícias");
    expect(item.href).toBe("/noticias/uma-materia");
    // Sem alt no WP, usa o título como texto alternativo.
    expect(item.image).toEqual({ src: "https://pcdob.org.br/wp-content/uploads/foto.png", alt: item.title });
  });

  it('usa "Notícias" quando só há "Sem categoria" e omite imagem ausente', () => {
    const item = normalizePost({
      ...basePost,
      _embedded: { "wp:term": [[{ taxonomy: "category", name: "Sem categoria" }]] },
    });
    expect(item.category).toBe("Notícias");
    expect(item.image).toBeUndefined();
  });
});

describe("normalizeArticle", () => {
  it("inclui autor (taxonomia autor), data de edição e link de origem", () => {
    const article = normalizeArticle(basePost);
    expect(article.author).toBe("Priscila Lobregatte");
    expect(article.modified).toBe("2026-10-23T10:00:00");
    expect(article.sourceUrl).toBe(basePost.link);
    expect(article.contentHtml).toBe("<p>Corpo</p>");
  });
});

describe("sanitizeArticleHtml", () => {
  it("remove scripts, handlers de evento e estilos inline", () => {
    const html = sanitizeArticleHtml('<p style="color:red" onclick="alert(1)">Oi</p><script>alert(1)</script>');
    expect(html).toBe("<p>Oi</p>");
  });

  it("permite embeds do YouTube e bloqueia iframes de outros hosts", () => {
    expect(sanitizeArticleHtml('<iframe src="https://www.youtube.com/embed/abc"></iframe>')).toContain("youtube.com/embed/abc");
    expect(sanitizeArticleHtml('<iframe src="https://malicioso.example/x"></iframe>')).not.toContain("malicioso");
  });

  it("abre links externos em nova aba com rel seguro", () => {
    const html = sanitizeArticleHtml('<a href="https://www.dieese.org.br">Dieese</a><a href="https://pcdob.org.br/x">PCdoB</a>');
    expect(html).toContain('<a href="https://www.dieese.org.br" target="_blank" rel="noopener noreferrer">');
    expect(html).toContain('<a href="https://pcdob.org.br/x">');
  });

  it("bloqueia links javascript:", () => {
    expect(sanitizeArticleHtml('<a href="javascript:alert(1)">x</a>')).toBe("<a>x</a>");
  });
});

describe("parsePageParam", () => {
  it.each([
    [undefined, 1],
    ["3", 3],
    [["4", "5"], 4],
    ["0", 1],
    ["-2", 1],
    ["abc", 1],
  ] as const)("converte %j em %i", (input, expected) => {
    expect(parsePageParam(input as string | string[] | undefined)).toBe(expected);
  });
});
