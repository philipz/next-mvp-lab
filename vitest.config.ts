import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: [],
    include: ["apps/web/**/*.test.{ts,tsx}"],
    passWithNoTests: true
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "apps/web")
    }
  }
});
