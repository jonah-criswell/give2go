
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: "autoUpdate",
    manifest: {
      name: "Give2Go App",
      short_name: "Give2Go",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#1976d2",
      icons: [
        {
          src: "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/icon-512x512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    }
  })]
});

