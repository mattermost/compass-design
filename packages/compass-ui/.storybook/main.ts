import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { compassUiSvgrPlugin } from '../svgr-plugin';

const repoSrc = path.resolve(__dirname, '../../../src');

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(viteConfig) {
    // CI sets STORYBOOK_BASE_PATH=/compass-design/storybook/ for GitHub Pages.
    viteConfig.base = process.env.STORYBOOK_BASE_PATH ?? '/';

    viteConfig.plugins = [...(viteConfig.plugins ?? []), compassUiSvgrPlugin()];

    // Storybook icon selects import the full compass-icons set. Without this,
    // Vite emits hundreds of tiny chunks per story and GitHub Pages loads fail
    // with "Failed to fetch dynamically imported module".
    viteConfig.build ??= {};
    viteConfig.build.rollupOptions ??= {};
    const { output } = viteConfig.build.rollupOptions;
    const outputs = output == null ? [{}] : Array.isArray(output) ? output : [output];
    if (output == null) {
      viteConfig.build.rollupOptions.output = outputs[0];
    }
    for (const out of outputs) {
      const previous = out.manualChunks;
      out.manualChunks = (id, ...rest) => {
        if (
          id.includes(`${path.sep}compass-icons${path.sep}`) ||
          id.includes('@mattermost/compass-icons')
        ) {
          return 'compass-icons';
        }
        if (typeof previous === 'function') {
          return previous(id, ...rest);
        }
        return undefined;
      };
    }

    viteConfig.resolve ??= {};
    const compassSrc = path.resolve(__dirname, '../src');
    viteConfig.resolve.alias = [
      { find: '@/guidelines', replacement: path.join(repoSrc, 'guidelines') },
      { find: '@/styles', replacement: path.join(repoSrc, 'styles') },
      { find: '@/assets', replacement: path.join(repoSrc, 'assets') },
      { find: '@/contexts', replacement: path.join(repoSrc, 'contexts') },
      {
        find: '@mattermost/compass-ui/illustrations',
        replacement: path.join(compassSrc, 'illustrations'),
      },
      { find: '@', replacement: compassSrc },
      ...(Array.isArray(viteConfig.resolve.alias)
        ? viteConfig.resolve.alias
        : viteConfig.resolve.alias
          ? Object.entries(viteConfig.resolve.alias).map(
              ([find, replacement]) => ({
                find,
                replacement,
              }),
            )
          : []),
    ];
    viteConfig.css ??= {};
    viteConfig.css.preprocessorOptions = {
      scss: {
        additionalData: `@use "@/styles/breakpoints" as *;\n@use "@/styles/mixins" as *;\n`,
      },
    };
    return viteConfig;
  },
};

export default config;
