import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Geliştirme proxy'si: tarayıcı /api/... isteklerini 5173'e atar, Vite bunları
    // arka planda backend'e (8080) iletir. Böylece tarayıcı tek bir site görür ve
    // CORS hiç devreye girmez. Üretimde aynı işi Nginx yapar (bkz. nginx.conf).
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
