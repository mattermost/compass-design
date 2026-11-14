import path from 'path';
import { defineConfig } from 'vitest/config';

// Note: `@mattermost/compass-ui` resolves to its built `dist`; build compass-ui
// before running these tests on a fresh checkout.
export default defineConfig({
  esbuild: { jsx: 'automatic' },
  resolve: {
    alias: [
      {
        find: '@/styles',
        replacement: path.resolve(__dirname, '../compass-ui/src/styles'),
      },
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/breakpoints" as *;\n@use "@/styles/mixins" as *;\n`,
      },
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
