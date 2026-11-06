"use strict";

(() => {
  const API = "/security-awareness-month/minigames-api";
  const TOKEN_KEY = "minigames:admin-session-token";
  const ranked = (window.MINIGAMES && window.MINIGAMES.games || []).filter((g) => !g.pending);
  let groups = [];

  const $ = (id) => document.getElementById(id);

  async function call(path, { method = "GET", body } = {}) {
    const headers = { "content-type": "application/json" };
    const token = String(sessionStorage.getItem(TOKEN_KEY) || "").trim();
    if (token) headers.authorization = `Bearer ${token}`;
    const res = await fetch(API + path, { method, headers, body: body ? JSON.stringify(body) : undefined, credentials: "same-origin" });
    let data = {};
    try { data = await res.json(); } catch { /* ignore */ }
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  }

  async function sendLoginLink() {
    const email = String($("adminEmail").value || "").trim().toLowerCase();
    if (!email) throw new Error("Enter your admin email.");
    await call("/auth/request-login", { method: "POST", body: { email } });
    const el = $("authStatus");
    el.className = "ok";
    el.textContent = "If this email has admin access, a one-time login link has been sent.";
  }

  async function verifyLoginToken(token) {
    const data = await call("/auth/verify-login", { method: "POST", body: { token } });
    if (data && data.token) sessionStorage.setItem(TOKEN_KEY, data.token);
  }

  async function maybeConsumeLoginToken() {
    const url = new URL(location.href);
    const token = String(url.searchParams.get("login_token") || "").trim();
    if (!token) return false;
    await verifyLoginToken(token);
    url.searchParams.delete("login_token");
    history.replaceState({}, "", url.pathname + (url.search ? url.search : "") + url.hash);
    const el = $("authStatus");
    el.className = "ok";
    el.textContent = "Login link verified. You are signed in.";
    return true;
  }

  async function logout() {
    await call("/auth/logout", { method: "POST" });
    sessionStorage.removeItem(TOKEN_KEY);
  }

  async function testAccess() {
    const el = $("authStatus");
    try {
      const data = await call("/admin");
      el.className = data.admin ? "ok" : "warn";
      el.textContent = data.admin
        ? `Admin OK. global=${data.globalAdmin ? "yes" : "no"} email=${data.email || "-"}`
        : "Credentials accepted but this identity has no admin rights.";
    } catch (err) {
      el.className = "warn";
      el.textContent = `Auth failed: ${err.message}`;
    }
  }

  async function debugAuth() {
    const el = $("debugStatus");
    try {
      const data = await call("/auth/debug");
      const details = [];
      if (!data.ok) details.push("Auth config has issues.");
      if (Array.isArray(data.issues) && data.issues.length) details.push(...data.issues);
      details.push(`adminEmailsConfigured=${data.checks && data.checks.adminEmailsConfigured ? "yes" : "no"}`);
      details.push(`resendConfigured=${data.checks && data.checks.resendConfigured ? "yes" : "no"}`);
      details.push(`emailSenderConfigured=${data.checks && data.checks.emailSenderConfigured ? "yes" : "no"}`);
      details.push(`sessionSecretConfigured=${data.checks && data.checks.sessionSecretConfigured ? "yes" : "no"}`);
      details.push(`sessionSecretUsingAdminKey=${data.checks && data.checks.sessionSecretUsingAdminKey ? "yes" : "no"}`);
      details.push(`currentSessionEmail=${data.currentSessionEmail || "-"}`);
      el.className = data.ok ? "ok" : "warn";
      el.textContent = details.join(" ");
    } catch (err) {
      el.className = "warn";
      el.textContent = `Debug failed: ${err.message}`;
    }
  }

  function selectedGroup() {
    return groups.find((g) => g.id === $("groupSelect").value) || null;
  }

  function renderGames(group) {
    const host = $("games");
    const selected = new Set(Object.entries((group && group.games) || {}).filter(([, on]) => !!on).map(([id]) => id));
    host.replaceChildren(...ranked.map((game) => {
      const label = document.createElement("label");
      const cb = Object.assign(document.createElement("input"), { type: "checkbox", value: game.id, checked: selected.has(game.id) });
      label.append(cb, document.createTextNode(game.title));
      return label;
    }));
  }

  function updateGroupView() {
    const g = selectedGroup();
    if (!g) {
      $("groupMeta").textContent = "No group selected.";
      $("playLink").textContent = "-";
      $("playLink").href = "#";
      $("boardLink").textContent = "-";
      $("boardLink").href = "#";
      renderGames(null);
      return;
    }
    $("groupMeta").textContent = `${g.name} (${g.slug}) · members: ${g.members} · ${g.active ? "active" : "inactive"}`;
    const playUrl = `/minigames/?group=${encodeURIComponent(g.slug)}`;
    const boardUrl = `/minigames/leaderboard/?group=${encodeURIComponent(g.slug)}#overall`;
    $("playLink").href = playUrl;
    $("playLink").textContent = playUrl;
    $("boardLink").href = boardUrl;
    $("boardLink").textContent = boardUrl;
    renderGames(g);
  }

  async function loadGroups() {
    const data = await call("/groups");
    groups = data.groups || [];
    const sel = $("groupSelect");
    sel.replaceChildren(...groups.map((g) => Object.assign(document.createElement("option"), { value: g.id, textContent: `${g.name} (${g.slug})` })));
    updateGroupView();
  }

  async function createGroup() {
    const name = String($("newGroupName").value || "").trim();
    const slug = String($("newGroupSlug").value || "").trim();
    if (!name) throw new Error("Group name is required.");
    await call("/groups", { method: "POST", body: { name, slug } });
    $("newGroupName").value = "";
    $("newGroupSlug").value = "";
    await loadGroups();
  }

  async function saveGames() {
    const g = selectedGroup();
    if (!g) throw new Error("Select a group first.");
    const games = [...$("games").querySelectorAll("input[type=checkbox]:checked")].map((i) => i.value);
    await call("/groups/games", { method: "POST", body: { groupId: g.id, games } });
    await loadGroups();
  }

  async function toggleActive() {
    const g = selectedGroup();
    if (!g) throw new Error("Select a group first.");
    await call("/groups", { method: "PATCH", body: { groupId: g.id, active: !g.active } });
    await loadGroups();
  }

  async function addOrRemoveGroupAdmin(remove) {
    const g = selectedGroup();
    const email = String($("adminEmailTarget").value || "").trim().toLowerCase();
    if (!g) throw new Error("Select a group first.");
    if (!email) throw new Error("Enter an email.");
    await call("/groups/admin", { method: remove ? "DELETE" : "POST", body: { groupId: g.id, email } });
    await loadGroups();
  }

  function wireButton(id, fn) {
    $(id).addEventListener("click", async () => {
      try {
        await fn();
      } catch (err) {
        alert(err.message);
      }
    });
  }

  $("groupSelect").addEventListener("change", updateGroupView);
  wireButton("sendLoginLink", sendLoginLink);
  wireButton("clearCreds", async () => {
    await logout();
    $("authStatus").textContent = "Logged out.";
  });
  wireButton("testCreds", testAccess);
  wireButton("debugAuth", debugAuth);
  wireButton("reloadGroups", loadGroups);
  wireButton("createGroup", createGroup);
  wireButton("saveGames", saveGames);
  wireButton("toggleActive", toggleActive);
  wireButton("addGroupAdmin", async () => addOrRemoveGroupAdmin(false));
  wireButton("removeGroupAdmin", async () => addOrRemoveGroupAdmin(true));

  maybeConsumeLoginToken().then(() => testAccess().then(loadGroups)).catch((err) => {
    const el = $("authStatus");
    el.className = "warn";
    el.textContent = `Magic-link login failed: ${err.message}`;
  });
})();
