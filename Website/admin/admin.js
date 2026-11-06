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

  async function login() {
    const email = String($("adminEmail").value || "").trim().toLowerCase();
    const key = String($("adminKey").value || "").trim();
    if (!email || !key) throw new Error("Enter both admin email and admin key.");
    const data = await call("/auth/login", { method: "POST", body: { email, key } });
    if (data && data.token) sessionStorage.setItem(TOKEN_KEY, data.token);
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
      $("boardLink").textContent = "-";
      $("boardLink").href = "#";
      renderGames(null);
      return;
    }
    $("groupMeta").textContent = `${g.name} (${g.slug}) · members: ${g.members} · ${g.active ? "active" : "inactive"}`;
    const boardUrl = `/minigames/leaderboard/?group=${encodeURIComponent(g.slug)}#overall`;
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
  wireButton("saveCreds", async () => { await login(); await testAccess(); await loadGroups(); });
  wireButton("clearCreds", async () => {
    await logout();
    $("adminKey").value = "";
    $("authStatus").textContent = "Logged out.";
  });
  wireButton("testCreds", testAccess);
  wireButton("reloadGroups", loadGroups);
  wireButton("createGroup", createGroup);
  wireButton("saveGames", saveGames);
  wireButton("toggleActive", toggleActive);
  wireButton("addGroupAdmin", async () => addOrRemoveGroupAdmin(false));
  wireButton("removeGroupAdmin", async () => addOrRemoveGroupAdmin(true));

  testAccess().then(loadGroups).catch(() => {});
})();
