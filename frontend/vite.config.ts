import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Backend (FastAPI) runs on :8000 — проксируем API, чтобы не возиться с CORS.
const BACKEND_URL = process.env.VITE_BACKEND_URL ?? 'http://localhost:8000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/companies': BACKEND_URL,
      '/offers': BACKEND_URL,
      '/streams': BACKEND_URL,
    },
  },
})
