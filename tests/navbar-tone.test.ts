import { afterEach, describe, expect, it, vi } from "vitest";

import { guessToneForPath, luminanceOf, sampleBackgroundTone } from "@/lib/navbar-tone";

describe("luminanceOf", () => {
  it("lê rgb() e rgba() opacos", () => {
    expect(luminanceOf("rgb(0, 0, 0)")).toBe(0);
    expect(luminanceOf("rgb(255, 255, 255)")).toBeCloseTo(1, 5);
    expect(luminanceOf("rgba(246, 242, 236, 1)")).toBeGreaterThan(0.85); // paper
    expect(luminanceOf("rgb(17, 10, 10)")).toBeLessThan(0.01); // ink
  });

  it("aceita a sintaxe moderna com espaços, barra e porcentagem", () => {
    expect(luminanceOf("rgb(246 242 236 / 1)")).toBeGreaterThan(0.85);
    expect(luminanceOf("rgb(246 242 236 / 100%)")).toBeGreaterThan(0.85);
  });

  it("trata cor transparente (ou quase) como ausente", () => {
    expect(luminanceOf("rgba(0, 0, 0, 0)")).toBeNull();
    expect(luminanceOf("rgb(0 0 0 / 0.3)")).toBeNull();
    expect(luminanceOf("transparent")).toBeNull();
  });

  it("ignora formatos desconhecidos", () => {
    expect(luminanceOf("oklch(0.5 0.1 20)")).toBeNull();
    expect(luminanceOf("")).toBeNull();
  });

  it("o vermelho institucional conta como escuro (texto claro)", () => {
    expect(luminanceOf("rgb(215, 20, 26)")).toBeLessThan(0.4);
  });
});

describe("guessToneForPath", () => {
  it("palpita claro nas páginas de topo claro e escuro nas demais", () => {
    expect(guessToneForPath("/noticias")).toBe("light");
    expect(guessToneForPath("/privacidade")).toBe("light");
    expect(guessToneForPath("/")).toBe("dark");
    expect(guessToneForPath("/filie-se")).toBe("dark");
    expect(guessToneForPath("/noticias/uma-materia")).toBe("dark");
  });
});

describe("sampleBackgroundTone", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  function mount(html: string) {
    document.body.innerHTML = html;
  }

  function stubStack(...elements: Element[]) {
    Object.defineProperty(document, "elementsFromPoint", { configurable: true, value: vi.fn(() => elements) });
  }

  it("sobe pelos pais até achar um fundo claro", () => {
    mount(`<section id="s" style="background-color: rgb(246, 242, 236)"><div><h1 id="t">x</h1></div></section>`);
    stubStack(document.getElementById("t")!);
    expect(sampleBackgroundTone(10, 10, null)).toBe("light");
  });

  it("detecta fundo escuro", () => {
    mount(`<section style="background-color: rgb(17, 10, 10)"><p id="t">x</p></section>`);
    stubStack(document.getElementById("t")!);
    expect(sampleBackgroundTone(10, 10, null)).toBe("dark");
  });

  it("ignora o próprio navbar e lê o que está atrás dele", () => {
    mount(`
      <header id="h" style="background-color: rgb(17, 10, 10)"><nav id="n">menu</nav></header>
      <section style="background-color: rgb(246, 242, 236)"><p id="t">x</p></section>`);
    stubStack(document.getElementById("n")!, document.getElementById("h")!, document.getElementById("t")!);
    expect(sampleBackgroundTone(10, 10, document.getElementById("h"))).toBe("light");
  });

  it("assume escuro quando nada tem fundo definido", () => {
    mount(`<div id="t">x</div>`);
    stubStack(document.getElementById("t")!);
    expect(sampleBackgroundTone(10, 10, null)).toBe("dark");
  });
});
