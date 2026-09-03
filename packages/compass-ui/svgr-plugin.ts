import svgr from 'vite-plugin-svgr';

/** Shared SVGR options so library builds and Storybook prefix clip-path IDs. */
export const compassUiSvgrOptions = {
  svgo: true,
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      },
      'prefixIds',
    ],
  },
} as const;

export function compassUiSvgrPlugin() {
  return svgr({ svgrOptions: { ...compassUiSvgrOptions } });
}
