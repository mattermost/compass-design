import path from 'path';
import { defineConfig } from 'vitest/config';

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
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
