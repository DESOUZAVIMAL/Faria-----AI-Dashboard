# Connecting the Dashboard to your Workspace Studio Google Sheet

Your Workspace Studio flow writes triaged emails into a Google Sheet. This guide
connects that Sheet to the dashboard so it shows **live data** — and so "mark as
read" writes back to the Sheet.

**Method: Google Sign-In + Sheets API.** Faria blocks public Apps Script endpoints,
so instead the dashboard reads the Sheet **directly, using your own Faria login**.
You click *Connect*, sign in with your Faria account, and the dashboard reads your
sheet. Nothing is made public; everything stays inside Faria's domain.

```
Workspace Studio ──(add a row)──▶ Google Sheet ◀──(read + write, as YOU via sign-in)── Dashboard
```

---

## Prerequisite: Sheet headers

Row 1 of your Sheet must be the header row. The dashboard reads columns **by name**,
so order doesn't matter and extra columns are fine. Recognised names:

| Header      | Powers                                                | Required |
|-------------|-------------------------------------------------------|----------|
| `Category`  | Quadrant + colour (4 Eisenhower values)               | ✅ yes   |
| `Summary`   | Card summary text                                     | ✅ yes   |
| `Source`    | Source icon (Gmail, Slack, Zendesk, ManageBac…)       | recommended |
| `Subject`   | Card title                                            | optional |
| `Sender`    | Who sent it                                           | optional |
| `Action`    | Task requested → **also becomes a Tasks-panel card**  | optional |
| `Priority`  | High / Medium / Low for the derived task              | optional |
| `DueDate`   | Deadline                                              | optional |
| `TicketID`  | Zendesk / ClickUp id                                  | optional |
| `Reasoning` | The "AI reasoning" line on each card                  | optional |
| `Timestamp` | When received                                         | optional |
| `Link`      | Enables an **Open** button back to the email          | optional |
| `Status`    | `New` / `Done` — managed by the dashboard write-back  | auto     |

---

## Step 1 — Create a Google OAuth client (one-time, ~5 min)

1. Go to **console.cloud.google.com** (sign in with your Faria account).
2. Create a project (e.g. "Faria Dashboard") — or reuse one.
3. **APIs & Services ▸ Library** → search **Google Sheets API** → **Enable**.
4. **APIs & Services ▸ OAuth consent screen**:
   - User type: **Internal** *(only Faria users — no Google verification needed)*.
   - Fill app name + your email, Save.
5. **APIs & Services ▸ Credentials ▸ Create credentials ▸ OAuth client ID**:
   - Application type: **Web application**.
   - **Authorised JavaScript origins** — add every URL the dashboard runs on:
     - `http://localhost:3000`  *(your local dev — match your actual port)*
     - `https://faria-ai-dashboard.vercel.app`  *(your live site)*
   - **Create**, then copy the **Client ID** (looks like `xx…apps.googleusercontent.com`).

> If your org blocks OAuth client creation, ask IT to allow it or to create an
> Internal Web client for you — that's the only admin-touch point, and it's optional.

## Step 2 — Add the config

`.env.local` already has your `VITE_SHEET_ID`. Just paste the client id:

```
VITE_GOOGLE_CLIENT_ID="xxxxxxxx.apps.googleusercontent.com"
VITE_SHEET_ID="1aKhYfwZlAp47WtJom9XROIxEutx33egUHMZO82bZzII"
VITE_SHEET_TAB="Sheet1"
```

- **Local:** restart the dev server (`npm run dev`).
- **Live (Vercel):** add the same three variables under **Project ▸ Settings ▸
  Environment Variables**, then redeploy.

## Step 3 — Connect & verify

1. Open the dashboard. The Inbox header shows a **Connect Google Sheet** button.
2. Click it → sign in with your Faria account → approve the Sheets permission.
3. The badge flips **Demo → Live** and your real triaged rows appear.
4. Mark an item read → the `Status` column in your Sheet updates to `Done`.
5. **Sync** pulls the latest rows on demand (also auto-refreshes every 60s).

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| No **Connect** button | `VITE_GOOGLE_CLIENT_ID` / `VITE_SHEET_ID` not set, or dev server not restarted. |
| Popup: `redirect_uri_mismatch` / `origin` error | The exact URL/port isn't in **Authorised JavaScript origins**. Add it and wait ~1 min. |
| Popup blocked | Allow popups for the dashboard, click Connect again. |
| `403` / `PERMISSION_DENIED` after sign-in | Google Sheets API not enabled, or you signed in with a non-Faria account that can't open the sheet. |
| Badge stays **Demo** after connecting | Sheet has only a header row, or the tab name ≠ `VITE_SHEET_TAB`. |
| Ugly card titles | Add a `Subject` column to your Studio flow's Sheet output. |

> The old `apps-script/Code.gs` is no longer used by this method — you can leave or
> delete it. It only mattered for the (blocked) public-endpoint approach.
