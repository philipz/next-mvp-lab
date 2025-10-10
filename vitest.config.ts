import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: [],
    include: ["apps/web/**/*.test.{ts,tsx}"],
    coverage: { reporter: ["text", "html"] }
  }
});
