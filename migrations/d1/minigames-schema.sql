CREATE TABLE IF NOT EXISTS sam_mg_players (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_key TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  email_key TEXT,
  is_anonymous INTEGER NOT NULL DEFAULT 1,
  admin_force_public INTEGER NOT NULL DEFAULT 0,
  key_hash TEXT NOT NULL,
  ip_hash TEXT,
  created_at INTEGER NOT NULL,
  group_id TEXT
);

CREATE INDEX IF NOT EXISTS sam_mg_players_ip ON sam_mg_players (ip_hash, created_at);
CREATE INDEX IF NOT EXISTS sam_mg_players_group ON sam_mg_players (group_id);
CREATE UNIQUE INDEX IF NOT EXISTS sam_mg_players_email_key ON sam_mg_players (email_key);

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
  force_full_names INTEGER NOT NULL DEFAULT 0,
  
  access_code TEXT,
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

CREATE TABLE IF NOT EXISTS sam_mg_admin_login_tokens (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER
);

CREATE INDEX IF NOT EXISTS sam_mg_admin_login_tokens_exp ON sam_mg_admin_login_tokens (expires_at, used_at);

CREATE TABLE IF NOT EXISTS sam_mg_player_login_tokens (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER
);

CREATE INDEX IF NOT EXISTS sam_mg_player_login_tokens_player ON sam_mg_player_login_tokens (player_id, created_at);

CREATE TABLE IF NOT EXISTS sam_mg_rate_limits (
  k TEXT PRIMARY KEY,
  n INTEGER NOT NULL,
  exp INTEGER NOT NULL
);

-- Groups created before access codes existed need one before their links work:
-- UPDATE sam_mg_groups SET access_code = lower(hex(randomblob(8))) WHERE access_code IS NULL OR access_code = '';
