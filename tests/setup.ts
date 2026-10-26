import "@testing-library/jest-dom/vitest";

import { cleanup, configure } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Imports dinâmicos (ConsentManager) podem passar de 1s com o cache frio.
configure({ asyncUtilTimeout: 5000 });

/*
 * APIs de navegador que o jsdom não implementa e o Framer Motion usa.
 * Protegido por `typeof window` porque alguns testes rodam em ambiente node.
 */
if (typeof window !== "undefined") {
  class MockIntersectionObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }

  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
  window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
  window.scrollTo = () => {};
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

afterEach(() => {
  if (typeof window !== "undefined") {
    cleanup();
    window.localStorage.clear();
  }
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});
