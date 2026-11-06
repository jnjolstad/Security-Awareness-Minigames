const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_ADMIN_EMAILS = ["joar@njolstad.no"];
const ADMIN_KEY_MIN_LEN = 24;

function normalizeEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  return EMAIL_PATTERN.test(email) ? email : "";
}

function readConfiguredAdmins(env) {
  const configured = String(
    (env && (env.SAM_MINIGAMES_ADMIN_EMAILS || env.ADMIN_EMAILS)) || "",
  );
  const admins = new Set(
    configured
      .split(",")
      .map((v) => normalizeEmail(v))
      .filter(Boolean),
  );
  if (admins.size === 0) {
    for (const email of DEFAULT_ADMIN_EMAILS) {
      const clean = normalizeEmail(email);
      if (clean) admins.add(clean);
    }
  }
  return admins;
}

export function isAdminEmail(email, env) {
  const clean = normalizeEmail(email);
  if (!clean) return false;
  return readConfiguredAdmins(env).has(clean);
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function extractBearerToken(authHeader) {
  const raw = String(authHeader || "");
  const m = raw.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : "";
}

export async function getTrustedAdminEmail(request, env) {
  const configuredKey = String(env?.SAM_MINIGAMES_ADMIN_KEY || "").trim();
  if (configuredKey.length < ADMIN_KEY_MIN_LEN) return "";
  const providedKey = extractBearerToken(request.headers.get("authorization"));
  if (!providedKey || !safeEqual(configuredKey, providedKey)) return "";
  const headerEmail = normalizeEmail(request.headers.get("x-admin-email"));
  if (!headerEmail) return "";
  return headerEmail;
}
