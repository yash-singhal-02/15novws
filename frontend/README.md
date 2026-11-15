# Campus Pulse frontend

This is a static frontend. Deploy the `frontend` folder as the Vercel project root; no build command or install command is needed. Vercel serves `index.html` and uses `vercel.json` to proxy `/api/*` requests to the Render backend at `https://one5novws.onrender.com`. The browser therefore calls the Vercel origin, avoiding cross-origin browser requests and CORS preflight issues.

For local development, run this folder's same-origin API proxy:

```powershell
node server.js
```

Then open [http://127.0.0.1:8000](http://127.0.0.1:8000). `python -m http.server` serves the files but does not proxy API requests.

Use the top-right user control to save named personas and switch between them. Each UUID is stored in this browser's local storage. The backend does not provide a users-list endpoint, so profiles cannot be discovered automatically. The organizer UUID returned with events can be added with the organizer shortcut.

The backend's `GET /api/me/registrations` and event attendee-list endpoint require authentication. This frontend does not implement Supabase sign-in or send a bearer token, so the backend will deny those private requests. Creating a registration also requires authentication on the backend; entering a user UUID alone does not authenticate the request.
