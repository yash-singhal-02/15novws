# Campus Pulse frontend

This is a static frontend. Deploy the `frontend` folder as the Vercel project root; no build command or install command is needed. Vercel serves `index.html` and uses `vercel.json` to proxy `/api/*` requests to the Render backend at `https://one5novws.onrender.com`. The browser therefore calls the Vercel origin, avoiding cross-origin browser requests and CORS preflight issues.

For local development, run this folder's same-origin API proxy:

```powershell
node server.js
```

Then open [http://127.0.0.1:8000](http://127.0.0.1:8000). `python -m http.server` serves the files but does not proxy API requests.

Sign in from the top-right user control with an existing Supabase email and password. The frontend stores the short-lived session in this browser and sends its bearer token to protected API endpoints. The backend refreshes expired sessions. UUID entry is not authentication; registrations are associated with the signed-in Supabase user. The backend must be redeployed with the `/api/auth/login` and `/api/auth/refresh` routes before this sign-in flow is available.

The backend's `GET /api/me/registrations` and event attendee-list endpoint require authentication. Attendee lists are additionally limited to the event's organizer. New Supabase accounts must be created/configured in Supabase; this frontend only signs in existing accounts.
