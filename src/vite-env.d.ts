// Tells TypeScript which settings exist in .env, so typos in
// import.meta.env.VITE_... names are caught while you type.

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_APP_SHARE_TITLE: string;
  readonly VITE_THEME_COLOR: string;
  readonly VITE_MAPTILER_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
