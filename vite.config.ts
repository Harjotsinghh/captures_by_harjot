import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    visualizer({
      open: false,
      filename: "stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  base: "/",
  build: {
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("leaflet") || id.includes("react-leaflet")) {
              return "leaflet";
            }
            if (id.includes("framer-motion")) {
              return "motion";
            }
            if (id.includes("three") || id.includes("vanta")) {
              return "visuals";
            }
            if (id.includes("lottie-react") || id.includes("lottie-web")) {
              return "lottie";
            }
            if (id.includes("react-photo-album") || id.includes("yet-another-react-lightbox") || id.includes("lightgallery")) {
              return "gallery-utils";
            }
            return "vendor";
          }
        },
      },
    },
  },
});
