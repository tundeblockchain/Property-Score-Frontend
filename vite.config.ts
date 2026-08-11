import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Route lazy() splits page code. Pull the largest independent vendors
        // out of the shared shell so the entry stays under Vite's 500 kB hint.
        // React and MUI stay together — splitting them creates circular chunks.
        manualChunks(id) {
          if (id.includes('node_modules/firebase') || id.includes('node_modules\\firebase')) {
            return 'vendor-firebase';
          }
          if (id.includes('@tanstack')) {
            return 'vendor-query';
          }
          return undefined;
        },
      },
    },
  },
  server: {
    port: 5173,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    restoreMocks: true,
  },
});
