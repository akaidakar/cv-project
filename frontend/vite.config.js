import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    'import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY': JSON.stringify(process.env.VITE_STRIPE_PUBLISHABLE_KEY),
    'import.meta.env.VITE_API_BASE_URL_LOCAL': JSON.stringify(process.env.VITE_API_BASE_URL_LOCAL),
    'import.meta.env.VITE_API_BASE_URL_DEPLOY': JSON.stringify(process.env.VITE_API_BASE_URL_DEPLOY),
  },
})
