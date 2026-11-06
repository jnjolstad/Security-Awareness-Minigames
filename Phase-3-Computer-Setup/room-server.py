#!/usr/bin/env python3
import argparse
import json
import secrets
import threading
import time
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


class RoomState:
    def __init__(self, duration_minutes):
        self.lock = threading.Lock()
        self.duration_ms = duration_minutes * 60_000
        self.mode = "ready"
        self.remaining_ms = self.duration_ms
        self.end_ms = 0
        self.revision = 0
        self.reset_revision = 0

    def _remaining(self):
        if self.mode == "running":
            return max(0, self.end_ms - int(time.time() * 1000))
        return self.remaining_ms

    def snapshot(self):
        with self.lock:
            remaining = self._remaining()
            if self.mode == "running" and remaining == 0:
                self.mode = "finished"
                self.remaining_ms = 0
                self.end_ms = 0
                self.revision += 1
            return {
                "mode": self.mode,
                "duration": self.duration_ms,
                "remaining": remaining,
                "end": self.end_ms,
                "revision": self.revision,
                "resetRevision": self.reset_revision,
                "serverTime": int(time.time() * 1000),
            }

    def action(self, name, value=0):
        with self.lock:
            now = int(time.time() * 1000)
            remaining = self._remaining()
            if name == "start":
                if self.mode == "ready":
                    self.remaining_ms = self.duration_ms
                    self.end_ms = now + self.duration_ms
                    self.mode = "running"
            elif name == "pause" and self.mode == "running":
                self.remaining_ms = remaining
                self.end_ms = 0
                self.mode = "paused"
            elif name == "resume" and self.mode == "paused":
                self.end_ms = now + self.remaining_ms
                self.mode = "running"
            elif name == "adjust":
                updated = max(0, remaining + int(value))
                self.remaining_ms = updated
                if self.mode == "running":
                    self.end_ms = now + updated
                elif self.mode == "finished" and updated > 0:
                    self.mode = "paused"
                if updated == 0:
                    self.mode = "finished"
                    self.end_ms = 0
            elif name == "reset":
                self.mode = "ready"
                self.remaining_ms = self.duration_ms
                self.end_ms = 0
                self.reset_revision += 1
            else:
                raise ValueError("Action is not valid in the current timer state.")
            self.revision += 1
        return self.snapshot()


def make_handler(root, state, pin):
    class RoomHandler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(root), **kwargs)

        def log_message(self, format_string, *args):
            print(f"[ROOM] {self.address_string()} - {format_string % args}")

        def send_json(self, body, status=HTTPStatus.OK):
            payload = json.dumps(body).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(payload)

        def do_GET(self):
            path = urlparse(self.path).path
            if path == "/api/room/state":
                self.send_json(state.snapshot())
                return
            if path == "/remote":
                self.path = "/remote.html"
            super().do_GET()

        def do_POST(self):
            if urlparse(self.path).path != "/api/room/action":
                self.send_json({"error": "Not found."}, HTTPStatus.NOT_FOUND)
                return

            try:
                length = int(self.headers.get("Content-Length", "0"))
                body = json.loads(self.rfile.read(length) or b"{}")
            except (ValueError, json.JSONDecodeError):
                self.send_json({"error": "Invalid JSON."}, HTTPStatus.BAD_REQUEST)
                return

            is_local = self.client_address[0] in {"127.0.0.1", "::1"}
            if not is_local and str(body.get("pin", "")) != pin:
                self.send_json({"error": "Incorrect room PIN."}, HTTPStatus.FORBIDDEN)
                return

            try:
                snapshot = state.action(str(body.get("action", "")), body.get("value", 0))
            except (TypeError, ValueError) as error:
                self.send_json({"error": str(error)}, HTTPStatus.CONFLICT)
                return
            self.send_json(snapshot)

    return RoomHandler


def main():
    parser = argparse.ArgumentParser(description="BREACH PROTOCOL local room server")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--duration", type=int, default=45)
    parser.add_argument("--pin")
    args = parser.parse_args()

    root = Path(__file__).resolve().parent / "NIMBUS-Secure-Terminal"
    if not root.is_dir():
        raise SystemExit(f"Terminal folder not found: {root}")

    pin = args.pin or f"{secrets.randbelow(1_000_000):06d}"
    server = ThreadingHTTPServer(("0.0.0.0", args.port), make_handler(root, RoomState(args.duration), pin))
    print(f"ROOM_PIN={pin}", flush=True)
    print(f"ROOM_PORT={args.port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
