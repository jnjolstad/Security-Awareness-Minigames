const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_ADMIN_EMAILS = ["joar@njolstad.no"];

function parseCookieMap(cookieHeader) {
  const map = new Map();
  const raw = String(cookieHeader || "");
  if (!raw) return map;
  for (const part of raw.split(";")) {
    const idx = part.indexOf("=");
    if (idx <= 0) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (!key) continue;
    map.set(key, value);
  }
  return map;
}

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

export async function getSessionEmailFromCookie(request, env) {
  const headerEmail = normalizeEmail(
    request.headers.get("x-ms-client-principal-name")
    || request.headers.get("x-auth-request-email")
    || request.headers.get("x-user-email"),
  );
  if (headerEmail) return headerEmail;

  const cookies = parseCookieMap(request.headers.get("cookie"));
  return normalizeEmail(
    cookies.get("sam_session_email")
    || cookies.get("session_email")
    || "",
  );
}
