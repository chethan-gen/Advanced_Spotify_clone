/// <reference types="vite/client" />

declare global {
  interface Window {
    refreshToken?: () => Promise<string | null>;
  }
}
