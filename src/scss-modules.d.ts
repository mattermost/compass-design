/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_STORYBOOK_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.svg?react' {
  import type { FC, SVGProps } from 'react';
  const Component: FC<SVGProps<SVGSVGElement>>;
  export default Component;
}
