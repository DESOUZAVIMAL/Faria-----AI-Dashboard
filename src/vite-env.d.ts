/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_SHEET_ID?: string;
  readonly VITE_SHEET_TAB?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Google Identity Services (loaded via <script> in index.html)
interface Window {
  google?: {
    accounts: {
      oauth2: {
        initTokenClient(config: {
          client_id: string;
          scope: string;
          callback: (resp: { access_token?: string; expires_in?: number; error?: string }) => void;
        }): { requestAccessToken: (opts?: { prompt?: string }) => void };
      };
    };
  };
}
