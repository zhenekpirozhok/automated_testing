import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    dir: "./test/unit",
    coverage: {
      provider: "v8", // Используем c8 для покрытия
      reporter: ["text", "html", "json"], // Указываем форматы отчёта: текст, HTML, JSON
      reportsDirectory: "./coverage", // Папка, куда будут сохраняться отчёты о покрытии
    },
  },
});
