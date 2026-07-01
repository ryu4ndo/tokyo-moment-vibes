import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const API_PORT = process.env.PORT || 3001

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${API_PORT}`,
        changeOrigin: true,
      },
    },
  },
})
