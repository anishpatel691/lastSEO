import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/myapp/', // Change this to match your deployment path
  plugins: [react()],
})
