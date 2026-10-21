import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Default settings work on Vercel's auto-detected Vite framework preset.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
