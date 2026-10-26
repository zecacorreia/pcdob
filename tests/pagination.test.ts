import { describe, expect, it } from "vitest";

import { pageWindow } from "@/components/ui/Pagination";

describe("pageWindow", () => {
  it("mostra todas as páginas quando são poucas", () => {
    expect(pageWindow(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it("usa reticências nas pontas longe da página atual", () => {
    expect(pageWindow(6, 1069)).toEqual([1, "…", 4, 5, 6, 7, 8, "…", 1069]);
  });

  it("não repete a primeira página nem cria reticências desnecessárias", () => {
    expect(pageWindow(1, 1069)).toEqual([1, 2, 3, "…", 1069]);
    expect(pageWindow(4, 10)).toEqual([1, 2, 3, 4, 5, 6, "…", 10]);
  });
});
