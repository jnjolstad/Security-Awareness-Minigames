CREATE TABLE IF NOT EXISTS sam_mg_players (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_key TEXT NOT NULL UNIQUE,
  key_hash TEXT NOT NULL,
  ip_hash TEXT,
  created_at INTEGER NOT NULL,
  group_id TEXT
);

CREATE INDEX IF NOT EXISTS sam_mg_players_ip ON sam_mg_players (ip_hash, created_at);
CREATE INDEX IF NOT EXISTS sam_mg_players_group ON sam_mg_players (group_id);

CREATE TABLE IF NOT EXISTS sam_mg_runs (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL,
  game TEXT NOT NULL,
  started_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS sam_mg_runs_player ON sam_mg_runs (player_id, started_at);

CREATE TABLE IF NOT EXISTS sam_mg_best (
  player_id TEXT NOT NULL,
  game TEXT NOT NULL,
  score INTEGER NOT NULL,
  duration_ms INTEGER NOT NULL,
  wrong INTEGER NOT NULL,
  hints INTEGER NOT NULL,
  found INTEGER NOT NULL,
  attempts INTEGER NOT NULL,
  achieved_at INTEGER NOT NULL,
  first_score INTEGER,
  PRIMARY KEY (player_id, game)
);

CREATE INDEX IF NOT EXISTS sam_mg_best_rank ON sam_mg_best (game, score DESC, duration_ms, achieved_at);

CREATE TABLE IF NOT EXISTS sam_mg_groups (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  created_by TEXT
);

CREATE TABLE IF NOT EXISTS sam_mg_group_admins (
  group_id TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (group_id, email)
);

CREATE TABLE IF NOT EXISTS sam_mg_group_games (
  group_id TEXT NOT NULL,
  game TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  updated_at INTEGER NOT NULL,
  updated_by TEXT,
  PRIMARY KEY (group_id, game)
);

CREATE INDEX IF NOT EXISTS sam_mg_group_games_group ON sam_mg_group_games (group_id, enabled);
