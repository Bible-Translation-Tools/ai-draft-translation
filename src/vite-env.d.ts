/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_API_ENDPOINT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
