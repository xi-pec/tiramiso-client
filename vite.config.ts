import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: "/",
    server: {
      port: 3000,
      proxy: mode === "development" ? {
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        "/static": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
      } : undefined,
    },

    plugins: [react(), tsconfigPaths(), tailwindcss()],
  };
});