import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from postgrest import APIError
from supabase import Client, create_client

load_dotenv()

app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    allowed_origins = {origin.strip() for origin in os.environ.get("CORS_ALLOWED_ORIGINS", "*").split(",")}
    request_origin = request.headers.get("Origin")
    if "*" in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = "*"
    elif request_origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = request_origin
        response.headers.add("Vary", "Origin")
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
    response.headers["Access-Control-Max-Age"] = "600"
    return response

supabase: Client = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_PUBLISHABLE_KEY"],
)


def current_user():
    """Return the authenticated Supabase user, or None for an invalid token."""
    authorization = request.headers.get("Authorization", "")
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None
    try:
        return supabase.auth.get_user(token).user
    except Exception:
        return None


def require_user():
    user = current_user()
    if user is None:
        return None, (jsonify({"error": "Authentication required"}), 401)
    return user, None


@app.post("/api/auth/login")
def login():
    payload = request.get_json(silent=True) or {}
    email = str(payload.get("email", "")).strip()
    password = payload.get("password", "")
    if not email or not isinstance(password, str) or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        result = supabase.auth.sign_in_with_password({"email": email, "password": password})
        if not result.session or not result.user:
            return jsonify({"error": "Sign-in did not return a session"}), 401
        return jsonify({
            "access_token": result.session.access_token,
            "refresh_token": result.session.refresh_token,
            "expires_at": result.session.expires_at,
            "user": {"id": result.user.id, "email": result.user.email},
        }), 200
    except Exception:
        # Avoid returning provider details that could reveal account state.
        return jsonify({"error": "Invalid email or password"}), 401


@app.post("/api/auth/refresh")
def refresh_auth():
    payload = request.get_json(silent=True) or {}
    refresh_token = payload.get("refresh_token", "")
    if not isinstance(refresh_token, str) or not refresh_token:
        return jsonify({"error": "Refresh token is required"}), 400
    try:
        result = supabase.auth.refresh_session(refresh_token)
        if not result.session or not result.user:
            return jsonify({"error": "Session could not be refreshed"}), 401
        return jsonify({
            "access_token": result.session.access_token,
            "refresh_token": result.session.refresh_token,
            "expires_at": result.session.expires_at,
            "user": {"id": result.user.id, "email": result.user.email},
        }), 200
    except Exception:
        return jsonify({"error": "Session expired. Sign in again."}), 401


@app.get("/health")
def health():
    return jsonify({"status": "ok"}), 200


@app.get("/")
def index():
    return jsonify({
        "name": "Events API",
        "endpoints": {
            "GET /api/events": "Browse events",
            "GET /api/events/<id>": "Get event details",
            "POST /api/auth/login": "Sign in with a Supabase email and password",
            "POST /api/auth/refresh": "Refresh a Supabase session",
            "POST /api/registrations": "Create a registration (authentication required)",
            "GET /api/me/registrations": "List the current user's registrations (authentication required)",
            "GET /api/events/<id>/registrations": "List attendees (organizer authentication required)",
        },
    }), 200


@app.get("/api/events")
def list_events():
    try:
        result = supabase.table("events").select("*").execute()
        return jsonify(result.data), 200
    except APIError as error:
        return jsonify({"error": error.message}), 500


@app.get("/api/events/<event_id>")
def get_event(event_id):
    try:
        result = (
            supabase.table("events")
            .select("*")
            .eq("id", event_id)
            .limit(1)
            .execute()
        )
        if not result.data:
            return jsonify({"error": "Event not found"}), 404
        return jsonify(result.data[0]), 200
    except APIError as error:
        return jsonify({"error": error.message}), 500


@app.post("/api/registrations")
def create_registration():
    user, auth_error = require_user()
    if auth_error:
        return auth_error

    payload = request.get_json(silent=True) or {}
    event_id = payload.get("event_id")
    if not event_id:
        return jsonify({"error": "event_id is required"}), 400

    # The authenticated identity is authoritative; never accept a client-supplied user_id.
    registration = {**payload, "event_id": event_id, "user_id": user.id}
    registration.pop("id", None)
    try:
        result = (
            supabase.table("registrations")
            .insert(registration)
            .execute()
        )
        created = result.data[0] if result.data else registration
        return jsonify(created), 201
    except APIError as error:
        if error.code == "23505":
            return jsonify({"error": "Already registered for this event"}), 409
        if error.code == "23503":
            return jsonify({"error": "Event not found"}), 404
        return jsonify({"error": error.message}), 400


@app.get("/api/me/registrations")
def my_registrations():
    user, auth_error = require_user()
    if auth_error:
        return auth_error
    try:
        result = (
            supabase.table("registrations")
            .select("*")
            .eq("user_id", user.id)
            .execute()
        )
        return jsonify(result.data), 200
    except APIError as error:
        return jsonify({"error": error.message}), 500


@app.get("/api/events/<event_id>/registrations")
def event_registrations(event_id):
    user, auth_error = require_user()
    if auth_error:
        return auth_error
    try:
        event_result = (
            supabase.table("events")
            .select("*")
            .eq("id", event_id)
            .limit(1)
            .execute()
        )
        if not event_result.data:
            return jsonify({"error": "Event not found"}), 404

        event = event_result.data[0]
        # Event ownership is represented by organizer_id (or user_id in simpler schemas).
        if event.get("organizer_id", event.get("user_id")) != user.id:
            return jsonify({"error": "Organizer access required"}), 403

        result = (
            supabase.table("registrations")
            .select("*")
            .eq("event_id", event_id)
            .execute()
        )
        return jsonify(result.data), 200
    except APIError as error:
        return jsonify({"error": error.message}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "5000")), debug=False)
