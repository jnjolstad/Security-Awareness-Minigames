"use strict";

window.Board = (() => {
  const API = window.MINIGAMES.api;
  const PLAYER_KEY = "minigames:player";
  const ADMIN_KEY = "minigames:admin-key";
  const ADMIN_EMAIL = "minigames:admin-email";
  const MEDALS = ["🥇", "🥈", "🥉"];
  const GROUP_SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{1,31}$/;

  function group() {
    const slug = new URLSearchParams(location.search).get("group") || "";
    return GROUP_SLUG_PATTERN.test(slug) ? slug : "";
  }

  function player() {
    try {
      const p = JSON.parse(localStorage.getItem(PLAYER_KEY));
      return p && p.id && p.key && p.name ? p : null;
    } catch {
      return null;
    }
  }

  function forget() {
    try { localStorage.removeItem(PLAYER_KEY); } catch { /* storage unavailable */ }
  }

  function adminCreds() {
    try {
      const key = String(sessionStorage.getItem(ADMIN_KEY) || "").trim();
      const email = String(sessionStorage.getItem(ADMIN_EMAIL) || "").trim().toLowerCase();
      return key && email ? { key, email } : null;
    } catch {
      return null;
    }
  }

  function setAdminCreds(email, key) {
    try {
      sessionStorage.setItem(ADMIN_EMAIL, String(email || "").trim().toLowerCase());
      sessionStorage.setItem(ADMIN_KEY, String(key || "").trim());
    } catch { /* storage unavailable */ }
  }

  function clearAdminCreds() {
    try {
      sessionStorage.removeItem(ADMIN_EMAIL);
      sessionStorage.removeItem(ADMIN_KEY);
    } catch { /* storage unavailable */ }
  }

  async function call(path, { method = "GET", body } = {}) {
    const p = player();
    const headers = { "content-type": "application/json" };
    if (p) { headers["x-player"] = p.id; headers["x-player-key"] = p.key; }
    const admin = adminCreds();
    if (admin) {
      headers.authorization = `Bearer ${admin.key}`;
      headers["x-admin-email"] = admin.email;
    }
    const res = await fetch(API + path, { method, headers, body: body ? JSON.stringify(body) : undefined, credentials: "same-origin" });
    let data = {};
    try { data = await res.json(); } catch { /* empty body */ }
    if (res.status === 401 && p) forget();
    if (!res.ok) throw Object.assign(new Error(data.error || `Request failed (${res.status})`), { status: res.status });
    return data;
  }

  async function register(name) {
    const data = await call("/player", { method: "POST", body: { name, group: group() || undefined } });
    localStorage.setItem(PLAYER_KEY, JSON.stringify(data));
    return data;
  }

  const start = (game) => call("/start", { method: "POST", body: { game, group: group() || undefined } });
  const finish = (runId, log) => call("/finish", { method: "POST", body: { runId, log } });
  const get = (game) => {
    const p = player();
    const q = [`game=${encodeURIComponent(game)}`];
    if (p) q.push(`player=${encodeURIComponent(p.id)}`);
    const g = group();
    if (g) q.push(`group=${encodeURIComponent(g)}`);
    return call(`/board?${q.join("&")}`);
  };
  const joinGroup = (slug) => call("/group/join", { method: "POST", body: { group: slug } });

  // Seeded shuffle shared with the server (minigames-api/[[path]].js). Both
  // must produce the same order for a given seed, label and length.
  function order(seed, label, n) {
    let h = 2166136261;
    for (const ch of `${seed}:${label}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
    const next = () => {
      h = (h + 0x6d2b79f5) >>> 0;
      let t = h;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const a = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function seconds(ms) {
    const s = Math.round(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }

  // Rows are built with textContent so player names can never inject markup.
  function table(data, { overall = false, onRemove } = {}) {
    const wrap = document.createElement("div");
    wrap.className = "lb";
    if (!data.entries.length) {
      const p = document.createElement("p");
      p.className = "muted";
      p.textContent = "No scores yet. Be the first.";
      wrap.append(p);
      return wrap;
    }
    const t = document.createElement("table");
    t.className = "lb-table";
    const head = t.createTHead().insertRow();
    for (const [h, title] of [["#"], ["Player"], [overall ? "Games" : "Time"], ["1st try", "Score on the very first attempt, before any practice"], ["Best"]]) {
      const th = document.createElement("th");
      th.textContent = h;
      if (title) th.title = title;
      head.append(th);
    }
    if (onRemove) head.append(document.createElement("th"));
    const body = t.createTBody();
    let prev = 0;
    for (const e of data.entries) {
      if (prev && e.rank > prev + 1) {
        const gap = body.insertRow();
        gap.className = "gap";
        const td = gap.insertCell();
        td.colSpan = onRemove ? 6 : 5;
        td.textContent = "⋯";
      }
      prev = e.rank;
      const row = body.insertRow();
      if (e.mine) row.className = "mine";
      row.insertCell().textContent = e.rank <= 3 ? MEDALS[e.rank - 1] : e.rank;
      row.insertCell().textContent = e.name + (e.mine ? "  (you)" : "");
      row.insertCell().textContent = overall ? `${e.games} / ${data.gameCount}` : seconds(e.durationMs);
      const first = row.insertCell();
      first.className = "first";
      first.textContent = e.firstScore ?? "–";
      row.insertCell().textContent = e.score;
      if (onRemove) {
        const btn = document.createElement("button");
        btn.className = "quiet small";
        btn.textContent = "Remove";
        btn.addEventListener("click", () => onRemove(e));
        row.insertCell().append(btn);
      }
    }
    wrap.append(t);
    const foot = document.createElement("p");
    foot.className = "lb-foot muted";
    foot.textContent = `${data.total} player${data.total === 1 ? "" : "s"} on this board.`;
    wrap.append(foot);
    return wrap;
  }

  return { player, forget, register, start, finish, get, joinGroup, group, table, seconds, call, order, adminCreds, setAdminCreds, clearAdminCreds };
})();
