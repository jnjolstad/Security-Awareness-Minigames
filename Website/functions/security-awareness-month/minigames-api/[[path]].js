// Leaderboard API for /security-awareness-month/minigames.
//
// Players reserve a nickname and get a private key (only its hash is stored).
// A ranked run is opened with /start, which records the server start time.
// /finish receives the click log and re-scores it against the answer key in
// _minigames-key.js, using the server clock, so a browser cannot report its
// own score or time.
//
// Storage is D1 (AUKSJON_DB binding, tables prefixed sam_mg_), which keeps
// the free tier's 1,000 KV writes/day for the escape room.

import { buildAdminSessionCookie, buildAdminSessionToken, clearAdminSessionCookie, getTrustedAdminEmail, isAdminEmail, verifyAdminLogin } from "../../_auth.js";
import { GAMES } from "../_minigames-key.js";

const POINTS = { wrong: 25, hint: 100, missed: 100 };
const LATENCY_GRACE_MS = 1500;
// A complete run needs at least this long per required click/answer. It caps
// what a scripted client can gain over a fast human who knows the answers.
const MIN_MS_PER_ACTION = 700;
const MAX_LOG = 400;
const START_COOLDOWN_MS = 3000;
const RUN_TTL_MS = 30 * 60 * 1000;
const MAX_NEW_PLAYERS_PER_IP_HOUR = 10;
const TOP = 10;
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{1,31}$/;

const NAME_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N} ._-]{1,19}$/u;
const BLOCKED_TERMS = [
  // Slurs/harassment (English + Norwegian), checked on normalized text.
  "fuck", "shit", "cunt", "nigg", "fag", "rape",
  "faen", "helvete", "hore", "fitte", "kuk", "neger",
  // Protected words to reduce impersonation/confusion.
  "admin", "moderator", "northwind",
];
const LEET = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b", "@": "a", "$": "s", "!": "i" };

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS sam_mg_players (
     id TEXT PRIMARY KEY, name TEXT NOT NULL, name_key TEXT NOT NULL UNIQUE,
     key_hash TEXT NOT NULL, ip_hash TEXT, created_at INTEGER NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS sam_mg_players_ip ON sam_mg_players (ip_hash, created_at)`,
  `CREATE TABLE IF NOT EXISTS sam_mg_runs (
     id TEXT PRIMARY KEY, player_id TEXT NOT NULL, game TEXT NOT NULL, started_at INTEGER NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS sam_mg_runs_player ON sam_mg_runs (player_id, started_at)`,
  `CREATE TABLE IF NOT EXISTS sam_mg_best (
     player_id TEXT NOT NULL, game TEXT NOT NULL, score INTEGER NOT NULL, duration_ms INTEGER NOT NULL,
     wrong INTEGER NOT NULL, hints INTEGER NOT NULL, found INTEGER NOT NULL,
     attempts INTEGER NOT NULL, achieved_at INTEGER NOT NULL, first_score INTEGER,
     PRIMARY KEY (player_id, game))`,
  `CREATE INDEX IF NOT EXISTS sam_mg_best_rank ON sam_mg_best (game, score DESC, duration_ms, achieved_at)`,
  `CREATE TABLE IF NOT EXISTS sam_mg_groups (
     id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
     active INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL, created_by TEXT)` ,
  `CREATE TABLE IF NOT EXISTS sam_mg_group_admins (
     group_id TEXT NOT NULL, email TEXT NOT NULL, created_at INTEGER NOT NULL,
     PRIMARY KEY (group_id, email))`,
  `CREATE TABLE IF NOT EXISTS sam_mg_group_games (
     group_id TEXT NOT NULL, game TEXT NOT NULL, enabled INTEGER NOT NULL DEFAULT 1,
     updated_at INTEGER NOT NULL, updated_by TEXT,
     PRIMARY KEY (group_id, game))`,
  `CREATE INDEX IF NOT EXISTS sam_mg_group_games_group ON sam_mg_group_games (group_id, enabled)`,
];
const GAME_IDS = Object.keys(GAMES);

let schemaReady = false;

// Only a finished flag is cached. A pending promise shared across requests can
// hang forever on Workers, since I/O can't complete in another request's context.
async function ensureSchema(db) {
  if (schemaReady) return;
  await db.batch(SCHEMA.map((sql) => db.prepare(sql)));
  // Tables created before the first-try column existed get it added once.
  try {
    await db.prepare("ALTER TABLE sam_mg_best ADD COLUMN first_score INTEGER").run();
  } catch (err) {
    if (!/duplicate column/i.test(String(err && (err.cause?.message || err.message)))) throw err;
  }
  try {
    await db.prepare("ALTER TABLE sam_mg_players ADD COLUMN group_id TEXT").run();
  } catch (err) {
    if (!/duplicate column/i.test(String(err && (err.cause?.message || err.message)))) throw err;
  }
  await db.prepare("CREATE INDEX IF NOT EXISTS sam_mg_players_group ON sam_mg_players (group_id)").run();
  schemaReady = true;
}

// Seeded shuffle, identical to Board.order in minigames/board.js. Chain answers
// are shown in this order per run, and the log records the position clicked.
export function order(seed, label, n) {
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

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

const fail = (status, error) => json({ error }, status);

async function sha256(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

function randomHex(bytes) {
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes)), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function authPlayer(request, db) {
  const id = request.headers.get("x-player") || "";
  const key = request.headers.get("x-player-key") || "";
  if (!/^[0-9a-f]{24}$/.test(id) || !/^[0-9a-f]{64}$/.test(key)) return null;
  const row = await db.prepare("SELECT id, name, key_hash, group_id FROM sam_mg_players WHERE id = ?").bind(id).first();
  if (!row || !safeEqual(row.key_hash, await sha256(key))) return null;
  return row;
}

function cleanName(raw) {
  const name = String(raw || "").normalize("NFKC").replace(/\s+/g, " ").trim();
  if (!NAME_PATTERN.test(name)) return { error: "Nickname must be 2–20 letters, numbers, spaces, dots, dashes or underscores." };
  const folded = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[0134578@$!]/g, (c) => LEET[c] || c)
    .replace(/[^a-z0-9]/g, "");
  if (BLOCKED_TERMS.some((term) => folded.includes(term))) return { error: "Please pick a different nickname." };
  return { name, key: name.toLowerCase().replace(/[\s._-]/g, "") };
}

function normalizeSlug(raw) {
  const slug = String(raw || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return SLUG_PATTERN.test(slug) ? slug : "";
}

async function resolveGroupBySlug(db, slug, includeInactive = false) {
  const clean = normalizeSlug(slug);
  if (!clean) return null;
  const row = await db.prepare("SELECT id, slug, name, active FROM sam_mg_groups WHERE slug = ?").bind(clean).first();
  if (!row || (!includeInactive && !row.active)) return null;
  return row;
}

async function enabledGamesForGroup(db, groupId) {
  const rows = await db.prepare("SELECT game, enabled FROM sam_mg_group_games WHERE group_id = ?").bind(groupId).all();
  const map = new Map((rows.results || []).map((r) => [r.game, !!r.enabled]));
  return GAME_IDS.filter((game) => map.has(game) ? map.get(game) : true);
}

async function actorContext(request, env, db) {
  const emailRaw = await getTrustedAdminEmail(request, env);
  const email = String(emailRaw || "").trim().toLowerCase();
  const globalAdmin = !!email && isAdminEmail(email, env);
  const managed = email
    ? await db.prepare("SELECT group_id FROM sam_mg_group_admins WHERE email = ?").bind(email).all()
    : { results: [] };
  const groupIds = new Set((managed.results || []).map((r) => r.group_id));
  return { email, globalAdmin, groupIds, admin: globalAdmin || groupIds.size > 0 };
}

function canManageGroup(actor, groupId) {
  return !!(actor && (actor.globalAdmin || actor.groupIds.has(groupId)));
}

async function createPlayer(request, db) {
  const body = await readJson(request);
  const clean = cleanName(body && body.name);
  if (clean.error) return fail(400, clean.error);
  let groupId = null;
  const groupSlug = normalizeSlug(body && body.group);
  if (groupSlug) {
    const group = await resolveGroupBySlug(db, groupSlug);
    if (!group) return fail(404, "Unknown group.");
    groupId = group.id;
  }
  const ipHash = (await sha256("sam-mg:" + (request.headers.get("cf-connecting-ip") || "unknown"))).slice(0, 32);
  const hourAgo = Date.now() - 3600_000;
  const recent = await db.prepare("SELECT COUNT(*) AS n FROM sam_mg_players WHERE ip_hash = ? AND created_at > ?").bind(ipHash, hourAgo).first();
  if (recent && recent.n >= MAX_NEW_PLAYERS_PER_IP_HOUR) return fail(429, "Too many new nicknames from this network. Try again later.");
  const id = randomHex(12);
  const key = randomHex(32);
  try {
    await db.prepare("INSERT INTO sam_mg_players (id, name, name_key, key_hash, ip_hash, created_at, group_id) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .bind(id, clean.name, clean.key, await sha256(key), ipHash, Date.now(), groupId).run();
  } catch (err) {
    if (String(err && err.message).includes("UNIQUE")) return fail(409, "That nickname is taken. Try another.");
    throw err;
  }
  return json({ id, key, name: clean.name });
}

async function startRun(request, db) {
  const player = await authPlayer(request, db);
  if (!player) return fail(401, "Unknown player. Pick your nickname again.");
  const body = await readJson(request);
  const game = body && GAMES[body.game] ? body.game : null;
  if (!game) return fail(400, "This game isn't ranked.");
  if (player.group_id) {
    const allowed = await enabledGamesForGroup(db, player.group_id);
    if (!allowed.includes(game)) return fail(403, "This game isn't enabled for your group.");
  }
  const now = Date.now();
  const last = await db.prepare("SELECT started_at FROM sam_mg_runs WHERE player_id = ? ORDER BY started_at DESC LIMIT 1").bind(player.id).first();
  if (last && now - last.started_at < START_COOLDOWN_MS) return fail(429, "Slow down a little and try again.");
  const runId = randomHex(16);
  await db.batch([
    db.prepare("DELETE FROM sam_mg_runs WHERE player_id = ? AND started_at < ?").bind(player.id, now - RUN_TTL_MS),
    db.prepare("INSERT INTO sam_mg_runs (id, player_id, game, started_at) VALUES (?, ?, ?, ?)").bind(runId, player.id, game, now),
  ]);
  return json({ runId });
}

// Mirrors the scoring in minigames/engine.js exactly.
export function scoreRun(key, log, elapsedMs, seed = "") {
  if (!Array.isArray(log) || log.length > MAX_LOG) return { error: "Invalid run." };
  const risks = new Set(key.risks);
  const found = new Set();
  let wrong = 0;
  let hints = 0;
  let step = 0;
  let inChain = false;
  let prev = -Infinity;
  for (const e of log) {
    if (!e || typeof e !== "object" || !Number.isInteger(e.t) || e.t < 0) return { error: "Invalid run." };
    if (e.t < prev || e.t > elapsedMs + LATENCY_GRACE_MS) return { error: "Run rejected: timing doesn't add up." };
    prev = e.t;
    if (e.k === "c" && !inChain) {
      const id = typeof e.v === "string" ? e.v : "";
      if (risks.has(id)) found.add(id);
      else wrong += 1;
    } else if (e.k === "h" && !inChain) {
      if (found.size >= risks.size) return { error: "Invalid run." };
      hints += 1;
    } else if (e.k === "a") {
      if (!inChain) {
        if (found.size < key.minToContinue) return { error: "Invalid run." };
        inChain = true;
      }
      if (step >= key.chain.length || !Number.isInteger(e.v) || e.v < 0 || e.v >= key.options[step]) return { error: "Invalid run." };
      if (order(seed, "chain" + step, key.options[step])[e.v] === key.chain[step]) step += 1;
      else wrong += 1;
    } else {
      return { error: "Invalid run." };
    }
  }
  const limitMs = key.timeLimit * 1000;
  const lastT = log.length ? log[log.length - 1].t : 0;
  const complete = step === key.chain.length;
  // The client starts its clock after /start responds, so the server's elapsed
  // time is never shorter than the player's. Up to LATENCY_GRACE_MS of it is
  // forgiven as network time for the /finish request.
  let durationMs = Math.min(elapsedMs, Math.max(lastT, elapsedMs - LATENCY_GRACE_MS));
  if (!complete) {
    if (elapsedMs < limitMs) return { error: "The run isn't finished yet." };
    durationMs = limitMs;
  } else if (elapsedMs < MIN_MS_PER_ACTION * (risks.size + key.chain.length)) {
    return { error: "Run rejected: faster than humanly possible." };
  }
  const timeUp = durationMs >= limitMs;
  const missed = risks.size - found.size;
  const breakdown = {
    time: timeUp ? 0 : key.timeLimit - Math.floor(durationMs / 1000),
    wrong: -wrong * POINTS.wrong,
    hints: -hints * POINTS.hint,
    missed: -missed * POINTS.missed,
  };
  const score = Math.max(0, breakdown.time + breakdown.wrong + breakdown.hints + breakdown.missed);
  return { score, breakdown, timeUp, durationMs: Math.min(durationMs, limitMs), wrong, hints, found: found.size };
}

async function finishRun(request, db) {
  const player = await authPlayer(request, db);
  if (!player) return fail(401, "Unknown player.");
  const body = await readJson(request);
  const runId = body && typeof body.runId === "string" && /^[0-9a-f]{32}$/.test(body.runId) ? body.runId : null;
  if (!runId) return fail(400, "Invalid run.");
  const run = await db.prepare("SELECT id, player_id, game, started_at FROM sam_mg_runs WHERE id = ?").bind(runId).first();
  if (!run || run.player_id !== player.id) return fail(404, "Run not found or already submitted.");
  const key = GAMES[run.game];
  const now = Date.now();
  const elapsed = now - run.started_at;
  if (!key || elapsed > RUN_TTL_MS) {
    await db.prepare("DELETE FROM sam_mg_runs WHERE id = ?").bind(runId).run();
    return fail(410, "This run expired.");
  }
  const result = scoreRun(key, body.log, elapsed, runId);
  if (result.error) {
    if (!result.error.includes("isn't finished")) await db.prepare("DELETE FROM sam_mg_runs WHERE id = ?").bind(runId).run();
    return fail(400, result.error);
  }
  const previous = await db.prepare("SELECT score, duration_ms FROM sam_mg_best WHERE player_id = ? AND game = ?").bind(player.id, run.game).first();
  const personalBest = !previous || result.score > previous.score || (result.score === previous.score && result.durationMs < previous.duration_ms);
  // The run row is deleted in the same batch, so a run can only be scored once.
  const [deleted] = await db.batch([
    db.prepare("DELETE FROM sam_mg_runs WHERE id = ?").bind(runId),
    db.prepare(`INSERT INTO sam_mg_best (player_id, game, score, duration_ms, wrong, hints, found, attempts, achieved_at, first_score)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 1, ?8, ?3)
      ON CONFLICT (player_id, game) DO UPDATE SET
        attempts = attempts + 1,
        score = CASE WHEN excluded.score > score OR (excluded.score = score AND excluded.duration_ms < duration_ms) THEN excluded.score ELSE score END,
        wrong = CASE WHEN excluded.score > score OR (excluded.score = score AND excluded.duration_ms < duration_ms) THEN excluded.wrong ELSE wrong END,
        hints = CASE WHEN excluded.score > score OR (excluded.score = score AND excluded.duration_ms < duration_ms) THEN excluded.hints ELSE hints END,
        found = CASE WHEN excluded.score > score OR (excluded.score = score AND excluded.duration_ms < duration_ms) THEN excluded.found ELSE found END,
        achieved_at = CASE WHEN excluded.score > score OR (excluded.score = score AND excluded.duration_ms < duration_ms) THEN excluded.achieved_at ELSE achieved_at END,
        duration_ms = CASE WHEN excluded.score > score OR (excluded.score = score AND excluded.duration_ms < duration_ms) THEN excluded.duration_ms ELSE duration_ms END`)
      .bind(player.id, run.game, result.score, result.durationMs, result.wrong, result.hints, result.found, now),
  ]);
  if (!deleted.meta || deleted.meta.changes !== 1) return fail(409, "Run already submitted.");
  const board = await gameBoard(db, run.game, player.id);
  return json({
    ...result,
    personalBest,
    best: personalBest ? result.score : previous.score,
    rank: board.me ? board.me.rank : null,
    total: board.total,
    next: board.next,
    board: { entries: board.entries, total: board.total },
  });
}

function shape(rows, playerId, overall) {
  const entries = rows.map((r) => ({
    rank: r.rk,
    name: r.name,
    playerId: r.player_id,
    score: r.score,
    durationMs: r.duration_ms,
    firstScore: r.first_score ?? null,
    games: overall ? r.games : undefined,
    mine: r.player_id === playerId,
  }));
  const total = rows.length ? rows[0].total : 0;
  const me = entries.find((e) => e.mine) || null;
  const above = me && entries.find((e) => e.rank === me.rank - 1);
  const next = above ? { name: above.name, gap: above.score - me.score + 1 } : null;
  return { entries, total, me, next };
}

// Top of the board, the player's own row and the row they are chasing.
const visible = (p) => `(rk <= ${TOP} OR rk = (SELECT rk FROM r WHERE player_id = ${p}) OR rk = (SELECT rk FROM r WHERE player_id = ${p}) - 1)`;

async function gameBoard(db, game, playerId, groupId = null) {
  const groupClause = groupId ? "AND p.group_id = ?3" : "";
  const binds = groupId ? [game, playerId || "", groupId] : [game, playerId || ""];
  const { results } = await db.prepare(`
    WITH r AS (
      SELECT player_id, score, duration_ms, first_score,
        ROW_NUMBER() OVER (ORDER BY score DESC, duration_ms ASC, achieved_at ASC) AS rk
      FROM sam_mg_best WHERE game = ?1)
    SELECT r.*, p.name, (SELECT COUNT(*) FROM r) AS total
    FROM r JOIN sam_mg_players p ON p.id = r.player_id
    WHERE ${visible("?2")} ${groupClause} ORDER BY rk`).bind(...binds).all();
  return shape(results, playerId, false);
}

async function overallBoard(db, playerId, groupId = null, games = GAME_IDS) {
  if (!games.length) return { entries: [], total: 0, me: null, next: null, gameCount: 0 };
  const marks = games.map((_, i) => `?${i + 2}`).join(", ");
  const groupClause = groupId ? "AND p.group_id = ?" + (games.length + 2) : "";
  const params = groupId ? [playerId || "", ...games, groupId] : [playerId || "", ...games];
  const { results } = await db.prepare(`
    WITH t AS (
      SELECT player_id, SUM(score) AS score, SUM(duration_ms) AS duration_ms, SUM(first_score) AS first_score, COUNT(*) AS games, MAX(achieved_at) AS last
      FROM sam_mg_best WHERE game IN (${marks}) GROUP BY player_id),
    r AS (SELECT t.*, ROW_NUMBER() OVER (ORDER BY score DESC, duration_ms ASC, last ASC) AS rk FROM t)
    SELECT r.*, p.name, (SELECT COUNT(*) FROM r) AS total
    FROM r JOIN sam_mg_players p ON p.id = r.player_id
    WHERE ${visible("?1")} ${groupClause} ORDER BY rk`).bind(...params).all();
  return { ...shape(results, playerId, true), gameCount: games.length };
}

async function getBoard(url, db) {
  const game = url.searchParams.get("game") || "overall";
  const playerId = url.searchParams.get("player") || "";
  const groupSlug = url.searchParams.get("group") || "";
  if (playerId && !/^[0-9a-f]{24}$/.test(playerId)) return fail(400, "Invalid player.");
  let group = null;
  let enabledGames = GAME_IDS;
  if (groupSlug) {
    group = await resolveGroupBySlug(db, groupSlug);
    if (!group) return fail(404, "Unknown group.");
    enabledGames = await enabledGamesForGroup(db, group.id);
  }
  if (game === "overall") return json({ ...(await overallBoard(db, playerId, group && group.id, enabledGames)), group: group ? group.slug : null });
  if (!GAMES[game]) return fail(404, "Unknown game.");
  if (group && !enabledGames.includes(game)) return fail(403, "This game isn't enabled for this group.");
  return json({ ...(await gameBoard(db, game, playerId, group && group.id)), gameCount: enabledGames.length, group: group ? group.slug : null });
}

async function getAdmin(request, env, db) {
  const actor = await actorContext(request, env, db);
  const groups = actor.groupIds.size
    ? (await db.prepare(`SELECT id, slug, name FROM sam_mg_groups WHERE id IN (${Array.from(actor.groupIds).map((_, i) => `?${i + 1}`).join(", ")})`)
      .bind(...Array.from(actor.groupIds)).all()).results || []
    : [];
  return json({
    admin: actor.admin,
    globalAdmin: actor.globalAdmin,
    email: actor.email || null,
    groups,
  });
}

async function listGroups(request, env, db) {
  const actor = await actorContext(request, env, db);
  if (!actor.admin) return fail(403, "Admin access required.");
  const params = [];
  let where = "";
  if (!actor.globalAdmin) {
    const ids = Array.from(actor.groupIds);
    if (!ids.length) return json({ groups: [] });
    where = `WHERE g.id IN (${ids.map((_, i) => `?${i + 1}`).join(", ")})`;
    params.push(...ids);
  }
  const groups = (await db.prepare(`
    SELECT g.id, g.slug, g.name, g.active,
      (SELECT COUNT(*) FROM sam_mg_players p WHERE p.group_id = g.id) AS members
    FROM sam_mg_groups g
    ${where}
    ORDER BY g.name ASC`).bind(...params).all()).results || [];
  for (const group of groups) {
    const admins = await db.prepare("SELECT email FROM sam_mg_group_admins WHERE group_id = ? ORDER BY email ASC").bind(group.id).all();
    const gameRows = await db.prepare("SELECT game, enabled FROM sam_mg_group_games WHERE group_id = ?").bind(group.id).all();
    const map = new Map((gameRows.results || []).map((r) => [r.game, !!r.enabled]));
    group.admins = (admins.results || []).map((r) => r.email);
    group.games = Object.fromEntries(GAME_IDS.map((id) => [id, map.has(id) ? map.get(id) : true]));
  }
  return json({ groups, globalAdmin: actor.globalAdmin });
}

async function createGroup(request, env, db) {
  const actor = await actorContext(request, env, db);
  if (!actor.globalAdmin) return fail(403, "Global admin access required.");
  const body = await readJson(request);
  const name = String(body && body.name || "").trim().replace(/\s+/g, " ");
  if (name.length < 2 || name.length > 60) return fail(400, "Group name must be 2-60 characters.");
  const slug = normalizeSlug((body && body.slug) || name);
  if (!slug) return fail(400, "Invalid group slug.");
  const id = randomHex(12);
  const now = Date.now();
  try {
    const batch = [
      db.prepare("INSERT INTO sam_mg_groups (id, slug, name, active, created_at, created_by) VALUES (?, ?, ?, 1, ?, ?)")
        .bind(id, slug, name, now, actor.email || null),
      ...GAME_IDS.map((game) =>
        db.prepare("INSERT INTO sam_mg_group_games (group_id, game, enabled, updated_at, updated_by) VALUES (?, ?, 1, ?, ?)")
          .bind(id, game, now, actor.email || null),
      ),
    ];
    await db.batch(batch);
  } catch (err) {
    if (String(err && err.message).includes("UNIQUE")) return fail(409, "That group slug already exists.");
    throw err;
  }
  return json({ id, slug, name, active: 1 }, 201);
}

async function updateGroup(request, env, db) {
  const actor = await actorContext(request, env, db);
  if (!actor.globalAdmin) return fail(403, "Global admin access required.");
  const body = await readJson(request);
  const groupId = String(body && body.groupId || "");
  if (!/^[0-9a-f]{24}$/.test(groupId)) return fail(400, "Invalid group.");
  const updates = [];
  const args = [];
  if (body && Object.prototype.hasOwnProperty.call(body, "name")) {
    const name = String(body.name || "").trim().replace(/\s+/g, " ");
    if (name.length < 2 || name.length > 60) return fail(400, "Group name must be 2-60 characters.");
    updates.push("name = ?");
    args.push(name);
  }
  if (body && Object.prototype.hasOwnProperty.call(body, "active")) {
    updates.push("active = ?");
    args.push(body.active ? 1 : 0);
  }
  if (!updates.length) return fail(400, "Nothing to update.");
  const result = await db.prepare(`UPDATE sam_mg_groups SET ${updates.join(", ")} WHERE id = ?`).bind(...args, groupId).run();
  if (!result.meta || result.meta.changes !== 1) return fail(404, "Group not found.");
  return json({ ok: true });
}

async function setGroupAdmin(request, env, db, remove = false) {
  const actor = await actorContext(request, env, db);
  if (!actor.globalAdmin) return fail(403, "Global admin access required.");
  const body = await readJson(request);
  const groupId = String(body && body.groupId || "");
  const email = String(body && body.email || "").trim().toLowerCase();
  if (!/^[0-9a-f]{24}$/.test(groupId)) return fail(400, "Invalid group.");
  if (!email || !email.includes("@")) return fail(400, "Invalid email.");
  if (remove) {
    await db.prepare("DELETE FROM sam_mg_group_admins WHERE group_id = ? AND email = ?").bind(groupId, email).run();
  } else {
    await db.prepare("INSERT OR IGNORE INTO sam_mg_group_admins (group_id, email, created_at) VALUES (?, ?, ?)")
      .bind(groupId, email, Date.now()).run();
  }
  return json({ ok: true });
}

async function setGroupGames(request, env, db) {
  const actor = await actorContext(request, env, db);
  if (!actor.admin) return fail(403, "Admin access required.");
  const body = await readJson(request);
  const groupId = String(body && body.groupId || "");
  if (!/^[0-9a-f]{24}$/.test(groupId)) return fail(400, "Invalid group.");
  if (!canManageGroup(actor, groupId)) return fail(403, "You can't manage this group.");
  const selected = new Set(Array.isArray(body && body.games) ? body.games.filter((g) => !!GAMES[g]) : []);
  const now = Date.now();
  await db.batch(GAME_IDS.map((game) =>
    db.prepare(`INSERT INTO sam_mg_group_games (group_id, game, enabled, updated_at, updated_by)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT (group_id, game) DO UPDATE SET enabled = excluded.enabled, updated_at = excluded.updated_at, updated_by = excluded.updated_by`)
      .bind(groupId, game, selected.has(game) ? 1 : 0, now, actor.email || null),
  ));
  return json({ ok: true });
}

async function assignPlayerGroup(request, env, db) {
  const actor = await actorContext(request, env, db);
  if (!actor.globalAdmin) return fail(403, "Global admin access required.");
  const body = await readJson(request);
  const playerId = String(body && body.playerId || "");
  const groupId = body && body.groupId ? String(body.groupId) : null;
  if (!/^[0-9a-f]{24}$/.test(playerId)) return fail(400, "Invalid player.");
  if (groupId && !/^[0-9a-f]{24}$/.test(groupId)) return fail(400, "Invalid group.");
  const result = await db.prepare("UPDATE sam_mg_players SET group_id = ? WHERE id = ?").bind(groupId, playerId).run();
  if (!result.meta || result.meta.changes !== 1) return fail(404, "Player not found.");
  return json({ ok: true });
}

async function getGroupConfig(url, db) {
  const slug = url.searchParams.get("slug") || "";
  const group = await resolveGroupBySlug(db, slug);
  if (!group) return fail(404, "Unknown group.");
  return json({ slug: group.slug, name: group.name, games: await enabledGamesForGroup(db, group.id) });
}

async function joinGroup(request, db) {
  const player = await authPlayer(request, db);
  if (!player) return fail(401, "Unknown player.");
  const body = await readJson(request);
  const group = await resolveGroupBySlug(db, body && body.group);
  if (!group) return fail(404, "Unknown group.");
  await db.prepare("UPDATE sam_mg_players SET group_id = ? WHERE id = ?").bind(group.id, player.id).run();
  return json({ ok: true, group: group.slug });
}

async function removePlayer(request, env, url, db) {
  const actor = await actorContext(request, env, db);
  if (!actor.globalAdmin) return fail(403, "Global admin access required.");
  const id = url.searchParams.get("id") || "";
  if (!/^[0-9a-f]{24}$/.test(id)) return fail(400, "Invalid player.");
  await db.batch([
    db.prepare("DELETE FROM sam_mg_best WHERE player_id = ?").bind(id),
    db.prepare("DELETE FROM sam_mg_runs WHERE player_id = ?").bind(id),
    db.prepare("DELETE FROM sam_mg_players WHERE id = ?").bind(id),
  ]);
  return json({ ok: true });
}

async function loginAdmin(request, env) {
  const body = await readJson(request);
  const email = String(body && body.email || "");
  const key = String(body && body.key || "");
  if (!verifyAdminLogin(email, key, env)) return fail(403, "Invalid admin credentials.");
  const cookie = await buildAdminSessionCookie(email, env);
  const token = await buildAdminSessionToken(email, env);
  if (!cookie) return fail(503, "Admin session is not configured.");
  return new Response(JSON.stringify({ ok: true, token }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "set-cookie": cookie,
    },
  });
}

async function logoutAdmin() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "set-cookie": clearAdminSessionCookie(),
    },
  });
}

export async function onRequest(context) {
  const { request, env, params } = context;
  const db = env.AUKSJON_DB
    || env.securityawarenessmonth_minigames
    || env.SECURITYAWARENESSMONTH_MINIGAMES
    || env.MINIGAMES_DB;
  if (!db) return fail(503, "Leaderboard unavailable.");
  const route = "/" + [].concat(params.path || []).join("/");
  const url = new URL(request.url);
  const method = request.method;
  try {
    await ensureSchema(db);
    if (route === "/board" && method === "GET") return await getBoard(url, db);
    if (route === "/auth/login" && method === "POST") return await loginAdmin(request, env);
    if (route === "/auth/logout" && method === "POST") return await logoutAdmin();
    if (route === "/group" && method === "GET") return await getGroupConfig(url, db);
    if (route === "/group/join" && method === "POST") return await joinGroup(request, db);
    if (route === "/player" && method === "POST") return await createPlayer(request, db);
    if (route === "/player" && method === "DELETE") return await removePlayer(request, env, url, db);
    if (route === "/group/player" && method === "POST") return await assignPlayerGroup(request, env, db);
    if (route === "/start" && method === "POST") return await startRun(request, db);
    if (route === "/finish" && method === "POST") return await finishRun(request, db);
    if (route === "/admin" && method === "GET") return await getAdmin(request, env, db);
    if (route === "/groups" && method === "GET") return await listGroups(request, env, db);
    if (route === "/groups" && method === "POST") return await createGroup(request, env, db);
    if (route === "/groups" && method === "PATCH") return await updateGroup(request, env, db);
    if (route === "/groups/admin" && method === "POST") return await setGroupAdmin(request, env, db);
    if (route === "/groups/admin" && method === "DELETE") return await setGroupAdmin(request, env, db, true);
    if (route === "/groups/games" && method === "POST") return await setGroupGames(request, env, db);
    return fail(404, "Not found.");
  } catch (err) {
    console.error("minigames-api", err);
    return fail(500, "Something went wrong.");
  }
}
