import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  server: {
    // 프록시 설정: 프론트엔드(5173)로 오는 특정 요청을 백엔드(8070)로 전달
    proxy: {
      // 1. API 요청
      '/api': {
        target: 'http://localhost:8070',
        changeOrigin: true,
      },
      // 2. OAuth2 로그인 시작 요청 (백엔드로 전달)
      // 주의: /oauth2/redirect (프론트 페이지)는 건드리지 않기 위해 경로를 구체화함
      '/oauth2/authorization': {
        target: 'http://localhost:8070',
        changeOrigin: true,
      },
      // 3. 구글 로그인 콜백 (백엔드로 전달)
      '/login/oauth2': {
        target: 'http://localhost:8070',
        changeOrigin: true,
      }
    }
  }
})
