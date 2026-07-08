/*
  Google Sheet ↔ Dashboard bridge — Google Sign-In + Sheets API (client-side OAuth).

  Faria blocks public Apps Script endpoints, so instead of a shared script URL the
  dashboard reads the Sheet directly using the signed-in user's own Google account:

    1. Google Identity Services (loaded in index.html) issues a short-lived OAuth
       access token scoped to the Sheets API — after the user clicks "Connect".
    2. We call the Sheets REST API with that token to read rows and write status.

  Everything stays inside Faria's domain: each person only reaches sheets their own
  account can open, nothing is made public.

  Configure via Vite env vars (all public — the client id is not a secret):
    VITE_GOOGLE_CLIENT_ID  — OAuth 2.0 Web client id from Google Cloud (consent = Internal)
    VITE_SHEET_ID          — the spreadsheet id (from its URL: /d/<THIS>/edit)
    VITE_SHEET_TAB         — tab/sheet name (optional, default "Sheet1")
*/

const CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim();
const SHEET_ID = (import.meta.env.VITE_SHEET_ID as string | undefined)?.trim();
const SHEET_TAB = (import.meta.env.VITE_SHEET_TAB as string | undefined)?.trim() || "Sheet1";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

export function isSheetConfigured(): boolean {
  return !!CLIENT_ID && !!SHEET_ID;
}

export interface SheetRow {
  _row: number;
  [key: string]: string | number;
}

// ── OAuth token handling ────────────────────────────────────────────────────
type TokenClient = { requestAccessToken: (opts?: { prompt?: string }) => void };

let tokenClient: TokenClient | null = null;
let accessToken: string | null = null;
let tokenExpiry = 0;
let authWaiters: { resolve: () => void; reject: (e: Error) => void }[] = [];

export function isConnected(): boolean {
  return !!accessToken && Date.now() < tokenExpiry;
}

/** Wait for the GIS script (added in index.html) to finish loading. */
function waitForGis(): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      if (window.google?.accounts?.oauth2) return resolve();
      if (Date.now() - start > 10_000) return reject(new Error("Google Identity Services failed to load"));
      setTimeout(tick, 100);
    };
    tick();
  });
}

function initTokenClient(): void {
  tokenClient = window.google!.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID as string,
    scope: SCOPE,
    callback: (resp: { access_token?: string; expires_in?: number; error?: string }) => {
      const waiters = authWaiters;
      authWaiters = [];
      if (resp.error || !resp.access_token) {
        waiters.forEach((w) => w.reject(new Error(resp.error || "Authorization failed")));
        return;
      }
      accessToken = resp.access_token;
      tokenExpiry = Date.now() + (Number(resp.expires_in || 3600) - 60) * 1000;
      waiters.forEach((w) => w.resolve());
    },
  });
}

/**
 * Trigger the Google sign-in / consent popup and resolve once we hold a token.
 * `prompt: ""` lets Google skip the dialog silently when consent already exists.
 */
export async function connect(interactive = true): Promise<void> {
  if (!isSheetConfigured()) throw new Error("Sheet not configured");
  if (isConnected()) return;
  await waitForGis();
  if (!tokenClient) initTokenClient();

  await new Promise<void>((resolve, reject) => {
    authWaiters.push({ resolve, reject });
    tokenClient!.requestAccessToken({ prompt: interactive ? "" : "none" });
  });
}

async function ensureToken(): Promise<string> {
  if (isConnected()) return accessToken as string;
  await connect(true);
  if (!accessToken) throw new Error("Not authorized");
  return accessToken;
}

// ── Sheets REST API ─────────────────────────────────────────────────────────
const API = "https://sheets.googleapis.com/v4/spreadsheets";

function colLetter(index: number): string {
  // 0 → A, 25 → Z, 26 → AA …
  let s = "";
  let n = index;
  do {
    s = String.fromCharCode((n % 26) + 65) + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return s;
}

let headerCache: string[] = [];

/** Read every data row, keyed by the header row. Returns [] when not configured. */
export async function fetchSheetRows(): Promise<SheetRow[]> {
  if (!isSheetConfigured()) return [];
  const token = await ensureToken();
  const range = encodeURIComponent(SHEET_TAB);
  const res = await fetch(`${API}/${SHEET_ID}/values/${range}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Sheets read failed (${res.status})`);
  const data = (await res.json()) as { values?: (string | number)[][] };
  const values = data.values || [];
  if (values.length < 2) return [];

  const headers = values[0].map((h) => String(h).trim());
  headerCache = headers;
  const rows: SheetRow[] = [];
  for (let i = 1; i < values.length; i++) {
    const raw = values[i];
    if (!raw || !raw.some((c) => String(c).trim() !== "")) continue;
    const obj: SheetRow = { _row: i + 1 }; // 1-based sheet row number
    headers.forEach((h, c) => {
      if (h) obj[h] = raw[c] ?? "";
    });
    rows.push(obj);
  }
  return rows;
}

/** Write a status value back to one row's Status column (creating it if absent). */
export async function pushStatus(row: number, status: string): Promise<void> {
  if (!isSheetConfigured() || !row) return;
  try {
    const token = await ensureToken();
    let statusIdx = headerCache.indexOf("Status");
    if (statusIdx === -1) {
      statusIdx = headerCache.length;
      // Create the Status header first.
      await fetch(
        `${API}/${SHEET_ID}/values/${encodeURIComponent(`${SHEET_TAB}!${colLetter(statusIdx)}1`)}?valueInputOption=RAW`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ values: [["Status"]] }),
        }
      );
      headerCache.push("Status");
    }
    const cell = `${SHEET_TAB}!${colLetter(statusIdx)}${row}`;
    await fetch(`${API}/${SHEET_ID}/values/${encodeURIComponent(cell)}?valueInputOption=RAW`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ values: [[status]] }),
    });
  } catch (err) {
    console.warn("[sheetService] status write-back failed (non-fatal):", err);
  }
}
