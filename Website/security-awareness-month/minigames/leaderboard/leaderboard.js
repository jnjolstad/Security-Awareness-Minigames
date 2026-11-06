"use strict";
// build-marker: admin-panel-v2-2026-11-06

(() => {
  const allRanked = MINIGAMES.games.filter((g) => !g.pending);
  const $ = (id) => document.getElementById(id);
  const groupSlug = Board.group();
  let tabs = [{ id: "overall", title: "Championship" }, ...allRanked];
  let adminInfo = { admin: false, globalAdmin: false, groups: [] };
  let groupsState = [];
  let canManage = new Set();

  function current() {
    const id = location.hash.slice(1);
    return tabs.find((t) => t.id === id) || tabs[0];
  }

  function renderTabs(active) {
    $("tabs").replaceChildren(...tabs.map((t) => {
      const b = Object.assign(document.createElement("button"), { type: "button", textContent: t.title });
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(t.id === active.id));
      b.addEventListener("click", () => { location.hash = t.id; });
      return b;
    }));
  }

  async function remove(entry) {
    if (!confirm(`Remove "${entry.name}" and all their scores?`)) return;
    try {
      await Board.call(`/player?id=${encodeURIComponent(entry.playerId)}`, { method: "DELETE" });
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  function adminPanel() {
    let panel = document.getElementById("adminPanelV2");
    if (!panel) {
      panel = Object.assign(document.createElement("section"), { id: "adminPanelV2", className: "card-lite" });
      $("board").after(panel);
    }
    return panel;
  }

  function setGameChecklist(host, selected) {
    host.replaceChildren(...allRanked.map((game) => {
      const label = document.createElement("label");
      label.style.display = "inline-flex";
      label.style.marginRight = "12px";
      label.style.gap = "6px";
      const cb = Object.assign(document.createElement("input"), {
        type: "checkbox",
        value: game.id,
        checked: selected.has(game.id),
      });
      label.append(cb, document.createTextNode(game.title));
      return label;
    }));
  }

  async function refreshGroups() {
    if (!adminInfo.admin) return;
    const data = await Board.call("/groups");
    groupsState = data.groups || [];
    canManage = new Set(adminInfo.globalAdmin ? groupsState.map((g) => g.id) : (adminInfo.groups || []).map((g) => g.id));
    renderAdmin();
  }

  function renderAdmin() {
    if (!adminInfo.admin) return;
    const panel = adminPanel();
    panel.replaceChildren();
    const title = document.createElement("h2");
    title.textContent = "Admin panel";
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = adminInfo.globalAdmin
      ? "Create groups, assign group admins, and deploy/remove games per group."
      : "Manage game deployment for your assigned group(s).";
    panel.append(title, p);

    if (adminInfo.globalAdmin) {
      const createBtn = Object.assign(document.createElement("button"), { type: "button", textContent: "Create group" });
      createBtn.addEventListener("click", async () => {
        const name = prompt("Group name");
        if (!name) return;
        const slug = prompt("Group slug (letters/numbers/dashes). Leave empty to auto-generate from name.") || "";
        try {
          await Board.call("/groups", { method: "POST", body: { name, slug } });
          await refreshGroups();
        } catch (err) {
          alert(err.message);
        }
      });
      panel.append(createBtn);
    }

    if (!groupsState.length) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "No groups yet.";
      panel.append(empty);
      return;
    }

    const selectWrap = document.createElement("p");
    const select = Object.assign(document.createElement("select"), { id: "groupEditor" });
    for (const g of groupsState.filter((g) => canManage.has(g.id))) {
      select.append(Object.assign(document.createElement("option"), { value: g.id, textContent: `${g.name} (${g.slug})` }));
    }
    selectWrap.append("Edit group: ", select);
    panel.append(selectWrap);

    const list = document.createElement("div");
    list.className = "muted";
    list.style.marginBottom = "12px";
    list.innerHTML = groupsState.map((g) => {
      const enabled = Object.values(g.games || {}).filter(Boolean).length;
      const open = `?group=${encodeURIComponent(g.slug)}#overall`;
      return `${g.name} (${g.slug}) · members: ${g.members} · games: ${enabled}/${allRanked.length} · ${g.active ? "active" : "inactive"} · <a href="${open}">open board</a>`;
    }).join("<br>");
    panel.append(list);

    const checks = document.createElement("div");
    panel.append(checks);

    const actions = document.createElement("p");
    panel.append(actions);
    const saveGames = Object.assign(document.createElement("button"), { type: "button", textContent: "Save game deployment" });
    actions.append(saveGames);

    const toggleActive = Object.assign(document.createElement("button"), { type: "button", textContent: "Toggle active" });
    toggleActive.style.marginLeft = "8px";
    if (adminInfo.globalAdmin) actions.append(toggleActive);

    const addAdmin = Object.assign(document.createElement("button"), { type: "button", textContent: "Add group admin" });
    addAdmin.style.marginLeft = "8px";
    if (adminInfo.globalAdmin) actions.append(addAdmin);

    const removeAdmin = Object.assign(document.createElement("button"), { type: "button", textContent: "Remove group admin" });
    removeAdmin.style.marginLeft = "8px";
    if (adminInfo.globalAdmin) actions.append(removeAdmin);

    const selectedGroup = () => groupsState.find((g) => g.id === select.value);
    const redrawChecks = () => {
      const g = selectedGroup();
      setGameChecklist(checks, new Set(Object.entries(g && g.games || {}).filter(([, on]) => !!on).map(([id]) => id)));
    };
    select.addEventListener("change", redrawChecks);
    redrawChecks();

    saveGames.addEventListener("click", async () => {
      const g = selectedGroup();
      if (!g) return;
      const selected = [...checks.querySelectorAll("input[type=checkbox]:checked")].map((cb) => cb.value);
      try {
        await Board.call("/groups/games", { method: "POST", body: { groupId: g.id, games: selected } });
        await refreshGroups();
        await load();
      } catch (err) {
        alert(err.message);
      }
    });

    if (adminInfo.globalAdmin) {
      toggleActive.addEventListener("click", async () => {
        const g = selectedGroup();
        if (!g) return;
        try {
          await Board.call("/groups", { method: "PATCH", body: { groupId: g.id, active: !g.active } });
          await refreshGroups();
          await load();
        } catch (err) {
          alert(err.message);
        }
      });
      addAdmin.addEventListener("click", async () => {
        const g = selectedGroup();
        if (!g) return;
        const email = prompt(`Email to grant admin for ${g.name}`);
        if (!email) return;
        try {
          await Board.call("/groups/admin", { method: "POST", body: { groupId: g.id, email } });
          await refreshGroups();
        } catch (err) {
          alert(err.message);
        }
      });
      removeAdmin.addEventListener("click", async () => {
        const g = selectedGroup();
        if (!g || !g.admins || !g.admins.length) return;
        const email = prompt(`Email to remove (${g.admins.join(", ")})`);
        if (!email) return;
        try {
          await Board.call("/groups/admin", { method: "DELETE", body: { groupId: g.id, email } });
          await refreshGroups();
        } catch (err) {
          alert(err.message);
        }
      });
    }
  }

  function renderAdminAccessHint(info) {
    const panel = adminPanel();
    const hint = Object.assign(document.createElement("section"), { className: "card-lite" });
    const h = document.createElement("h2");
    h.textContent = "Admin access";
    const p = document.createElement("p");
    p.className = "muted";
    const currentAdmin = Board.adminCreds();
    p.textContent = info.admin
      ? `Signed in as ${info.email || (currentAdmin && currentAdmin.email) || "admin user"}.`
      : `Admin panel is hidden because this session is not recognized as admin. Configure admin API credentials to unlock admin actions.`;
    hint.append(h, p);
    const actions = document.createElement("p");
    const setBtn = Object.assign(document.createElement("button"), { type: "button", textContent: "Set admin credentials" });
    setBtn.addEventListener("click", () => {
      const email = prompt("Enter admin email (must be allowed server-side)");
      if (!email) return;
      const key = prompt("Enter admin API key (SAM_MINIGAMES_ADMIN_KEY)");
      if (!key) return;
      Board.setAdminCreds(email, key);
      location.reload();
    });
    const clearBtn = Object.assign(document.createElement("button"), { type: "button", textContent: "Clear admin credentials" });
    clearBtn.style.marginLeft = "8px";
    clearBtn.addEventListener("click", () => {
      Board.clearAdminCreds();
      location.reload();
    });
    actions.append(setBtn, clearBtn);
    hint.append(actions);
    panel.replaceChildren(hint);
  }

  async function load() {
    const tab = current();
    renderTabs(tab);
    $("title").textContent = tab.title;
    const mode = groupSlug ? ` for group "${groupSlug}"` : "";
    $("sub").textContent = tab.id === "overall"
      ? `Sum of your best score on every active game${mode}. Play them all to climb.`
      : `Best score per player on ${tab.title}${mode}.`;
    const box = $("board");
    try {
      const data = await Board.get(tab.id);
      box.replaceChildren(Board.table(data, { overall: tab.id === "overall", onRemove: adminInfo.globalAdmin ? remove : null }));
      if (data.me && data.next) {
        const p = document.createElement("p");
        p.className = "chase";
        p.textContent = `${data.next.gap} point${data.next.gap === 1 ? "" : "s"} to pass ${data.next.name}.`;
        box.append(p);
      }
    } catch (err) {
      box.replaceChildren(Object.assign(document.createElement("p"), { className: "muted", textContent: err.message || "Leaderboard unavailable right now." }));
    }
  }

  async function init() {
    if (groupSlug) {
      for (const node of document.querySelectorAll('.game-name, .brand')) node.href += `?group=${encodeURIComponent(groupSlug)}`;
      try {
        const group = await Board.call(`/group?slug=${encodeURIComponent(groupSlug)}`);
        const allowed = new Set(group.games || []);
        tabs = [{ id: "overall", title: `${group.name} Championship` }, ...allRanked.filter((g) => allowed.has(g.id))];
      } catch {
        tabs = [{ id: "overall", title: "Championship" }, ...allRanked];
      }
    }

    try {
      adminInfo = await Board.call("/admin");
      if (adminInfo.admin) {
        await refreshGroups();
      } else {
        renderAdminAccessHint(adminInfo);
      }
    } catch {
      adminInfo = { admin: false, globalAdmin: false, groups: [] };
      renderAdminAccessHint(adminInfo);
    }
    await load();
  }

  window.addEventListener("hashchange", load);
  init();
})();
