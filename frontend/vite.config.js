import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Hardcode the production API URL to ensure the live site connects to the backend.
    // This overrides any .env variables or missing environment settings on Vercel.
    'import.meta.env.VITE_API_URL': JSON.stringify('https://roomify-project-production.up.railway.app')
  }
})