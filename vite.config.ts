import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The demo is a GitHub project page at /mellows-flows/, so built assets must
  // resolve against that sub-path. The dev server keeps serving from the root.
  base: process.env.NODE_ENV === 'production' ? '/mellows-flows/' : '/',
  // Honour PORT so a second dev server can run alongside the default 5173 one.
  server: { port: Number(process.env.PORT) || 5173 },
})
