import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Smart Edu-Hub",
        short_name: "EduHub",
        description: "Smart Educational Community Platform",
        theme_color: "#38b2ac",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/smart-edu-hub-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/smart-edu-hub-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,html,css,ico,png,svg,woff2,webp}"],
        navigateFallback: "/index.html",
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "supabase-storage",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: { enable: true },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
