import { describe, expect, it } from "vitest";

import { pageMetadata, truncate } from "@/lib/seo";

describe("pageMetadata", () => {
  it("define canônico, og:url e textos iguais em OG e no cartão do X", () => {
    const meta = pageMetadata({ title: "Filie-se", description: "Venha.", path: "/filie-se" });

    expect(meta.title).toBe("Filie-se");
    expect(meta.alternates?.canonical).toBe("/filie-se");
    expect(meta.openGraph).toMatchObject({
      url: "/filie-se",
      title: "Filie-se | PCdoB",
      description: "Venha.",
      siteName: "PCdoB",
      locale: "pt_BR",
    });
    expect(meta.twitter).toMatchObject({ title: "Filie-se | PCdoB", description: "Venha." });
  });

  it("repete a imagem de compartilhamento padrão (não é herdada do layout)", () => {
    const meta = pageMetadata({ title: "X", description: "Y", path: "/x" });
    expect(meta.openGraph?.images).toEqual([expect.objectContaining({ url: "/opengraph-image", width: 1200 })]);
    expect(meta.twitter?.images).toEqual(["/opengraph-image"]);
  });
});

describe("truncate", () => {
  it("mantém textos curtos", () => {
    expect(truncate("Curto.", 160)).toBe("Curto.");
  });

  it("corta no último espaço, sem pontuação solta, e respeita o limite", () => {
    const text = "Flávio Bolsonaro tem usado a metáfora do tesouraço para vender a ideia de cortar despesas, mas o estudo do Dieese mostra perda de empregos.";
    const result = truncate(text, 60);
    expect(result.length).toBeLessThanOrEqual(60);
    expect(result).toBe("Flávio Bolsonaro tem usado a metáfora do tesouraço para…");
  });
});
