import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ["2ba4-2a09-bac5-3a5f-137d-00-1f1-20e.ngrok-free.app"]
  }
})
