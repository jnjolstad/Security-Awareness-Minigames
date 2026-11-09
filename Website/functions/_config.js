const DEFAULT_LOGIN_TTL_MS = 15 * 60 * 1000;
const MIN_LOGIN_TTL_MS = 60 * 1000;
const MAX_LOGIN_TTL_MS = 60 * 60 * 1000;
const DEFAULT_LOGIN_COOLDOWN_MS = 60 * 1000;

function parsePositiveInt(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.floor(n);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function getMinigamesConfig(env = {}) {
  const adminEmailsRaw = String(env.SAM_MINIGAMES_ADMIN_EMAILS || "").trim();
  const adminKey = String(env.SAM_MINIGAMES_ADMIN_KEY || "").trim();
  // No fallback to the admin key: a missing session secret must disable sessions
  // rather than let anyone holding the key sign sessions for any email.
  const sessionSecret = String(env.SAM_MINIGAMES_SESSION_SECRET || "").trim();
  const resendApiKey = String(env.RESEND_API_KEY || "").trim();
  const emailFrom = String(env.SAM_MINIGAMES_EMAIL_FROM || env.ADMIN_MAGICLINK_FROM || "").trim();
  const allowKeyLogin = /^(1|true|yes)$/i.test(String(env.SAM_MINIGAMES_ALLOW_KEY_LOGIN || "").trim());

  return {
    adminEmailsRaw,
    adminKey,
    allowKeyLogin,
    sessionSecret,
    resendApiKey,
    emailFrom,
    adminLoginTtlMs: clamp(parsePositiveInt(env.SAM_MINIGAMES_ADMIN_LOGIN_TTL_MS, DEFAULT_LOGIN_TTL_MS), MIN_LOGIN_TTL_MS, MAX_LOGIN_TTL_MS),
    playerLoginTtlMs: clamp(parsePositiveInt(env.SAM_MINIGAMES_PLAYER_LOGIN_TTL_MS, DEFAULT_LOGIN_TTL_MS), MIN_LOGIN_TTL_MS, MAX_LOGIN_TTL_MS),
    // Sign-in emails per email address and requesting network per hour, so one
    // visitor can't use up an address owner's allowance.
    adminLoginMaxPerHour: clamp(parsePositiveInt(env.SAM_MINIGAMES_ADMIN_LOGIN_MAX_PER_HOUR, 3), 1, 20),
    playerLoginMaxPerHour: clamp(parsePositiveInt(env.SAM_MINIGAMES_PLAYER_LOGIN_MAX_PER_HOUR, 3), 1, 20),
    // Minimum gap between sign-in emails to the same address, from anyone.
    loginCooldownMs: clamp(parsePositiveInt(env.SAM_MINIGAMES_LOGIN_COOLDOWN_MS, DEFAULT_LOGIN_COOLDOWN_MS), 10 * 1000, 10 * 60 * 1000),
    // Registrations rejected as "email already registered" per network per hour.
    // Past this, registration from that network is blocked, which caps how many
    // addresses it can test.
    registerDuplicateMaxPerHour: clamp(parsePositiveInt(env.SAM_MINIGAMES_REGISTER_DUP_MAX_PER_HOUR, 10), 1, 100),
  };
}
