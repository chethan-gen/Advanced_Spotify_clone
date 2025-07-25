declare global {
  interface Window {
    refreshToken?: () => Promise<string | null>;
  }
}

export {};
