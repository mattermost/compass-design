import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import path from 'path';
import { collectLibEntries } from './build-entries';
import { compassIconsJsExtensions } from './vite-plugin-compass-icons-ext';
import { compassUiGlobalStyles } from './vite-plugin-global-styles';

const isWatchBuild = process.argv.includes('--watch');
const srcRoot = path.resolve(__dirname, 'src');

export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    compassUiGlobalStyles(),
    compassIconsJsExtensions(),
    dts({
      tsconfigPath: path.resolve(__dirname, 'tsconfig.build.json'),
      include: ['src'],
      exclude: [
        '**/*.stories.tsx',
        'src/styles/entry.scss',
        'src/storybook/**',
      ],
      rollupTypes: false,
      outDir: 'dist',
    }),
  ],
  resolve: {
    alias: {
      '@': srcRoot,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/breakpoints" as *;\n@use "@/styles/mixins" as *;\n`,
      },
    },
  },
  build: {
    emptyOutDir: !isWatchBuild,
    lib: {
      entry: collectLibEntries(),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: (id) => {
        if (id === 'react' || id === 'react-dom' || id === 'react/jsx-runtime') {
          return true;
        }
        if (/^@mattermost\/compass-icons/.test(id)) {
          return true;
        }
        if (id === 'simplebar-react') {
          return true;
        }
        if (/^simplebar-react\//.test(id) && !id.endsWith('.css')) {
          return true;
        }
        return false;
      },
      output: [
        {
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: srcRoot,
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
        },
        {
          format: 'cjs',
          preserveModules: true,
          preserveModulesRoot: srcRoot,
          entryFileNames: '[name].cjs',
          chunkFileNames: '[name].cjs',
          exports: 'named',
        },
      ],
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
});
