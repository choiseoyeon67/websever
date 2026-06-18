import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      // 프런트엔드에서 /api로 시작하는 요청은 백엔드로 토스합니다.
      '/api': {
        target: 'http://localhost:8080', // 스프링 부트 서버 주소
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
