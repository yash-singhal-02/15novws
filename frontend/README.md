# Campus Pulse frontend

This is a static frontend. Deploy the `frontend` folder as the Vercel project root; no build or install command is needed. Vercel serves `index.html` and proxies `/api/*` to the Render backend through `vercel.json`, so the browser uses the Vercel origin and avoids cross-origin requests.

Run locally from this folder with `node server.js`, then open `http://127.0.0.1:8000`. The Node server proxies API requests; `python -m http.server` does not.

Use the user control at the top right to add each person's UUID once, then switch between the saved users. The selected UUID is sent to the backend for registrations. This is UUID selection, not authentication: anyone who knows a user's UUID can request or create registrations for that user. If Supabase row-level security blocks those calls, configure `SUPABASE_SERVICE_ROLE_KEY` on Render only. A server-role key gives the backend broad database access, so the no-login API should only be used for data you intend to expose to anyone who can reach it.
