import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    exclude: ['**/node_modules/**', '**/e2e/**'],
    include: ['tests/**/*.test.js']
  }
})
