//frontend/vite.config.ts
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { VitePWA } from "vite-plugin-pwa"
import { templateCompilerOptions } from "@tresjs/core"
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: templateCompilerOptions,
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      strategies: "generateSW", // injectManifest 쓰는 중이면 유지해도 됨
      devOptions: { enabled: true },
      manifest: {
        name: "SW Portal",
        short_name: "SWPortal",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#111827",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  css: { postcss: "./postcss.config.cjs" },
  server: { host: true, port: Number(process.env.WEB_PORT) || 5174 },

})