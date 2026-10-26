import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  // Resolve o alias "@/..." a partir do tsconfig.json.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    css: false,
    // Maior que o asyncUtilTimeout (5s, em tests/setup.ts): com a máquina
    // carregada, um findBy lento não pode estourar o limite do próprio teste.
    testTimeout: 15_000,
  },
});
