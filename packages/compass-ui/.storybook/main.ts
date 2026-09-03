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
    viteConfig.plugins = [...(viteConfig.plugins ?? []), compassUiSvgrPlugin()];

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
          ? Object.entries(viteConfig.resolve.alias).map(([find, replacement]) => ({
              find,
              replacement,
            }))
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
