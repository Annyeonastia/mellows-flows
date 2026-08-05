import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Netlify serves the site from the root. Set DEPLOY_BASE=/mellows-flows/ to
  // build for a GitHub project page instead.
  base: process.env.DEPLOY_BASE || '/',
  // Honour PORT so a second dev server can run alongside the default 5173 one.
  server: { port: Number(process.env.PORT) || 5173 },
})
