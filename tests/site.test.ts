import { describe, expect, it } from "vitest";

import { resolveSiteUrl } from "@/lib/site";

describe("resolveSiteUrl", () => {
  it("prioriza a URL definida manualmente e remove a barra final", () => {
    expect(
      resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://www.pcdob.org.br/", VERCEL_URL: "pcdob-abc.vercel.app" }),
    ).toBe("https://www.pcdob.org.br");
  });

  it("usa o domínio de produção da Vercel em produção", () => {
    expect(
      resolveSiteUrl({
        VERCEL_ENV: "production",
        VERCEL_PROJECT_PRODUCTION_URL: "pcdob.vercel.app",
        VERCEL_URL: "pcdob-git-main-abc.vercel.app",
      }),
    ).toBe("https://pcdob.vercel.app");
  });

  it("usa a URL do próprio deploy nos previews da Vercel", () => {
    expect(
      resolveSiteUrl({
        VERCEL_ENV: "preview",
        VERCEL_PROJECT_PRODUCTION_URL: "pcdob.vercel.app",
        VERCEL_URL: "pcdob-git-feature-abc.vercel.app",
      }),
    ).toBe("https://pcdob-git-feature-abc.vercel.app");
  });

  it("aceita o domínio público da Railway", () => {
    expect(resolveSiteUrl({ RAILWAY_PUBLIC_DOMAIN: "pcdob.up.railway.app" })).toBe("https://pcdob.up.railway.app");
  });

  it("cai no domínio oficial sem nenhuma variável", () => {
    expect(resolveSiteUrl({})).toBe("https://pcdob.org.br");
  });
});
