import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@nexus360/ui': path.resolve(__dirname, '../../packages/ui/src')
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  optimizeDeps: {
    include: ['@nexus360/ui']
  },
  server: {
    port: 3003,
  },
  publicDir: path.resolve(__dirname, 'public'),
  base: '/'
});
