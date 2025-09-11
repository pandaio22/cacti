import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // Include test files
    include: [
      "src/**/*.{test,spec}.{js,ts}",
      "src/**/test/**/*.{js,ts}",
      "src/**/tests/**/*.{js,ts}",
    ],
    // Exclude files
    exclude: ["node_modules", "dist", "build"],
    // Test timeout
    testTimeout: 30000,
    // Global setup/teardown
    globals: true,
    // Coverage settings (optional)
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules",
        "dist",
        "build",
        "**/*.d.ts",
        "**/*.config.*",
        "**/test/**",
        "**/tests/**",
      ],
    },
  },
  // Resolve configuration for better module resolution
  resolve: {
    alias: {
      // Add any aliases you might need
      "@": "./src",
    },
  },
});
