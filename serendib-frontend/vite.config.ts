import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// GitHub Pages serves this project from /Ceylon-Trail/.
// Local development continues to use the root path.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/Ceylon-Trail/" : "/",
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
