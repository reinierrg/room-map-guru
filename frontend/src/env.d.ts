/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Variables de API
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_HOTEL_SEARCH: string
  readonly VITE_API_HOTEL_SEARCH_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}