import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // 相對路徑：部署到 GitHub Pages 子路徑或任何靜態空間都能直接用
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon-192.png", "icons/icon-512.png"],
      manifest: {
        name: "單字小森林｜A1 Movers 背單字遊戲",
        short_name: "單字小森林",
        description: "劍橋英檢 A1 Movers 背單字遊戲：答對題目賺能量，把荒地種成茂密森林！",
        lang: "zh-TW",
        display: "standalone",
        orientation: "portrait",
        start_url: "./",
        background_color: "#F6EFDF",
        theme_color: "#4C9F50",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: {
        // 離線快取：HTML/JS/CSS/圖示與 Google Fonts
        globPatterns: ["**/*.{js,css,html,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ]
});
