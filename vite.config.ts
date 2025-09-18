import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
    force: false
  },
  server: {
    fs: {
      strict: false
    }
  }
})
