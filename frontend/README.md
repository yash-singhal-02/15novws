# Campus Pulse frontend

The frontend calls the Render API directly at `https://one5novws.onrender.com/`. The Flask backend needs to be redeployed with the CORS handler in `../backend/app.py` before browsers can make cross-origin requests.

To serve the frontend locally after the backend redeploys, from this folder run:

```powershell
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). You can also run `node server.js` as a local same-origin proxy if you need to use the frontend before the Render backend has redeployed its CORS change.

Use the top-right user control to save named personas and switch between them. Each UUID only needs to be entered once and is stored in this browser's local storage. The backend does not provide a users-list endpoint, so profiles cannot be discovered automatically. The organizer UUID returned with events can be added with the one-click organizer shortcut.

The backend's `GET /api/me/registrations` and event attendee-list endpoint require authentication according to the supplied API contract. This frontend does not add authentication, so the backend may deny those private requests. Public event browsing and event details work without a user profile; creating a registration sends the selected `user_id` and `event_id` in the API request body.
