import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Force production Railway URL during build, but allow localhost for local development.
  const apiUrl = mode === 'production' 
    ? 'https://roomify-project-production.up.railway.app' 
    : (env.VITE_API_URL || 'http://localhost:5000');

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl)
    }
  }
})