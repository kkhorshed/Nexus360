import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@nexus360/ui': path.resolve(__dirname, '../../packages/ui/src')
    }
  },
  server: {
    port: 3003
  }
});
