import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import { VitePWA } from "vite-plugin-pwa";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      VueRouter({
      }),
      vue(),
      VitePWA({
          registerType: "autoUpdate",
          devOptions: {
              enabled: true,
          },
          manifest: {
              short_name: '날요',
              name: "날요 - 출퇴근길 날씨요정",
              start_url: "/",
              background_color: "#ffffff",
              theme_color: "#1E293B",
              display: "standalone",
              description: "우산을 챙길까 말까, 출퇴근길 날씨가 어떤지 궁금하지 않으신가요? 우리집, 회사의 날씨를 빠르고 정확하게 알아보세요.",
              icons: [
                  {
                      src: "/android-chrome-192x192.png",
                      type: "image/png",
                      sizes: "192x192",
                  },
                  {
                      src: "/android-chrome-192x192.png",
                      type: "image/png",
                      sizes: "192x192",
                      purpose: "maskable",
                  },
                  {
                      src: "/android-chrome-512x512.png",
                      type: "image/png",
                      sizes: "512x512",
                  },
                  {
                      src: "/android-chrome-512x512.png",
                      type: "image/png",
                      sizes: "512x512",
                      purpose: "maskable",
                  },
              ],
          },})
  ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
})
