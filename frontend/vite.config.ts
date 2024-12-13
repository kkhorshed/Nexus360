import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Fixed port for the frontend platform
  },
  resolve: {
    alias: {
      '@nexus360/ui': path.resolve(__dirname, '../packages/ui/src'),
      '@nexus360/api-client': path.resolve(__dirname, '../packages/api-client/src'),
    },
  },
});
