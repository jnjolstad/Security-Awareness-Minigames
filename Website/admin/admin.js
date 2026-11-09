"use strict";
// build-marker: admin-panel-v4-2026-11-09

(() => {
  const API = "/security-awareness-month/minigames-api";
  const BASE = "/security-awareness-month/minigames/";
  const TOKEN_KEY = "minigames:admin-session-token";
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const ranked = (window.MINIGAMES && window.MINIGAMES.games || []).filter((g) => !g.pending);

  const $ = (id) => document.getElementById(id);
  let me = { admin: false, globalAdmin: false, email: "" };
  let groups = [];
  let players = [];

  function el(tag, props = {}, ...children) {
    const node = Object.assign(document.createElement(tag), props);
    node.append(...children);
    return node;
  }

  let toastTimer;
  function toast(message, isError = false) {
    const t = $("toast");
    t.textContent = message;
    t.classList.toggle("err", isError);
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), isError ? 5000 : 2200);
  }

  async function call(path, { method = "GET", body } = {}) {
    const headers = { "content-type": "application/json" };
    const token = String(sessionStorage.getItem(TOKEN_KEY) || "").trim();
    if (token) headers.authorization = `Bearer ${token}`;
    const res = await fetch(API + path, { method, headers, body: body ? JSON.stringify(body) : undefined, credentials: "same-origin" });
    let data = {};
    try { data = await res.json(); } catch { /* not JSON */ }
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  }

  // Runs a click/submit action; shows failures as a toast instead of an alert.
  async function run(fn, button) {
    if (button) button.disabled = true;
    try {
      await fn();
    } catch (err) {
      toast(err.message, true);
    } finally {
      if (button) button.disabled = false;
    }
  }

  function setAuthStatus(text, cls = "muted") {
    const s = $("authStatus");
    s.className = `status ${cls}`;
    s.textContent = text;
  }

  // ---- views -------------------------------------------------------------

  function showLogin() {
    $("loginCard").hidden = false;
    $("app").hidden = true;
    $("who").hidden = true;
    $("logout").hidden = true;
    groups = [];
    players = [];
    $("groups").replaceChildren();
    $("playersBackfillStatus").textContent = "";
    $("playersGroups").replaceChildren(el("p", { className: "muted", textContent: "Sign in to load players." }));
  }

  function showApp() {
    $("loginCard").hidden = true;
    $("app").hidden = false;
    $("createCard").hidden = !me.globalAdmin;
    $("who").hidden = false;
    $("who").textContent = `${me.email || "admin"} · ${me.globalAdmin ? "global admin" : "group admin"}`;
    $("logout").hidden = false;
  }

  function absolute(path) {
    return location.origin + path;
  }

  function linkRow(label, path) {
    const url = absolute(path);
    const copy = el("button", { type: "button", className: "small quiet", textContent: "Copy" });
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(url);
        toast("Link copied");
      } catch {
        toast("Could not copy. Select the link and copy it manually.", true);
      }
    });
    return el("div", { className: "link-row" },
      el("span", { className: "label", textContent: label }),
      el("a", { href: path, target: "_blank", rel: "noopener", textContent: url }),
      copy);
  }

  function enabledIds(group) {
    return ranked.filter((g) => group.games && group.games[g.id]).map((g) => g.id);
  }

  function renderGroup(group) {
    const card = el("section", { className: "card" });
    card.dataset.group = group.id;

    // Header: name, status and the on/off switch (global admins only).
    const badge = el("span", { className: "badge" });
    const syncBadge = () => {
      badge.className = `badge ${group.active ? "on" : "off"}`;
      badge.textContent = group.active ? "Active" : "Inactive";
    };
    syncBadge();
    const head = el("div", { className: "group-head" },
      el("div", { className: "name" }, group.name, el("span", { className: "slug", textContent: group.slug })),
      el("span", { className: "muted", textContent: `${group.members} player${group.members === 1 ? "" : "s"}` }),
      badge);
    if (me.globalAdmin) {
      const input = el("input", { type: "checkbox", checked: !!group.active });
      input.setAttribute("role", "switch");
      input.setAttribute("aria-label", `Group ${group.name} active`);
      const sw = el("label", { className: "switch" }, input, el("span", { className: "track" }));
      input.addEventListener("change", () => {
        const next = input.checked;
        if (!next && !confirm(`Deactivate "${group.name}"? Its players will not be able to play until you activate it again.`)) {
          input.checked = true;
          return;
        }
        run(async () => {
          try {
            await call("/groups", { method: "PATCH", body: { groupId: group.id, active: next } });
            group.active = next;
            syncBadge();
            toast(next ? "Group activated" : "Group deactivated");
          } catch (err) {
            input.checked = !next;
            throw err;
          }
        }, input);
      });
      head.append(sw);
    }
    card.append(head);

    // Links to share.
    const playPath = `${BASE}?group=${encodeURIComponent(group.slug)}`;
    const boardPath = `${BASE}leaderboard/?group=${encodeURIComponent(group.slug)}#overall`;
    card.append(el("h3", { textContent: "Share" }), el("div", { className: "links" },
      linkRow("Play link", playPath), linkRow("Leaderboard", boardPath)));

    // Games: every switch saves right away, one request at a time per group.
    const count = el("span", { className: "count" });
    const grid = el("div", { className: "games" });
    const boxes = new Map();
    const syncCount = () => { count.textContent = `${enabledIds(group).length} of ${ranked.length} on`; };
    let queue = Promise.resolve();
    const save = (previous) => {
      queue = queue.then(async () => {
        try {
          await call("/groups/games", { method: "POST", body: { groupId: group.id, games: enabledIds(group) } });
          toast("Games saved");
        } catch (err) {
          group.games = previous;
          for (const [id, box] of boxes) box.checked = !!previous[id];
          syncCount();
          toast(err.message, true);
        }
      });
    };
    const setGames = (change) => {
      const previous = { ...group.games };
      group.games = { ...group.games, ...change };
      for (const [id, box] of boxes) box.checked = !!group.games[id];
      syncCount();
      save(previous);
    };
    for (const game of ranked) {
      const box = el("input", { type: "checkbox", checked: !!(group.games && group.games[game.id]) });
      box.setAttribute("role", "switch");
      box.setAttribute("aria-label", game.title);
      box.addEventListener("change", () => setGames({ [game.id]: box.checked }));
      boxes.set(game.id, box);
      grid.append(el("div", { className: "game" },
        el("span", { className: "icon", textContent: game.icon || "" }),
        el("span", { className: "gname", textContent: game.title }),
        el("label", { className: "switch" }, box, el("span", { className: "track" }))));
    }
    const all = el("button", { type: "button", className: "small quiet", textContent: "All on" });
    const none = el("button", { type: "button", className: "small quiet", textContent: "All off" });
    all.addEventListener("click", () => setGames(Object.fromEntries(ranked.map((g) => [g.id, true]))));
    none.addEventListener("click", () => setGames(Object.fromEntries(ranked.map((g) => [g.id, false]))));
    syncCount();
    card.append(el("h3", { textContent: "Games" }), el("div", { className: "games-tools" }, all, none, count), grid);

    // Group admins.
    const chips = el("div", { className: "chips" });
    const drawChips = () => {
      chips.replaceChildren(...(group.admins || []).map((email) => {
        const chip = el("span", { className: `chip${me.globalAdmin ? "" : " ro"}` }, email);
        if (me.globalAdmin) {
          const x = el("button", { type: "button", textContent: "×" });
          x.setAttribute("aria-label", `Remove ${email}`);
          x.addEventListener("click", () => {
            if (!confirm(`Remove ${email} as admin of "${group.name}"?`)) return;
            run(async () => {
              await call("/groups/admin", { method: "DELETE", body: { groupId: group.id, email } });
              group.admins = group.admins.filter((e) => e !== email);
              drawChips();
              toast("Admin removed");
            }, x);
          });
          chip.append(x);
        }
        return chip;
      }));
      if (!(group.admins || []).length) chips.append(el("span", { className: "muted", textContent: "No group admins yet." }));
    };
    drawChips();
    card.append(el("h3", { textContent: "Group admins" }), chips);
    if (me.globalAdmin) {
      const input = el("input", { type: "email", placeholder: "Email to give admin access", autocomplete: "off", required: true });
      const add = el("button", { type: "submit", textContent: "Add admin" });
      const form = el("form", { className: "row" }, input, add);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = input.value.trim().toLowerCase();
        if (!EMAIL_PATTERN.test(email)) return toast("Enter a valid email address.", true);
        if ((group.admins || []).includes(email)) return toast("That email is already an admin.", true);
        run(async () => {
          try {
            const res = await call("/groups/admin", { method: "POST", body: { groupId: group.id, email } });
            group.admins = [...(group.admins || []), email].sort();
            input.value = "";
            drawChips();
            toast(res.invitationSent ? "Admin added. A login link was emailed." : "Admin added");
          } catch (err) {
            // The admin can be saved even when the login email fails, so show what the server has.
            await loadGroups().catch(() => {});
            throw err;
          }
        }, add);
      });
      card.append(form);

      const del = el("button", { type: "button", className: "danger small", textContent: "Delete group…" });
      del.addEventListener("click", () => askDelete(group));
      card.append(el("div", { className: "danger-zone" }, del));
    }
    return card;
  }

  // Deleting also removes the group's players and scores, so the admin has to type the slug.
  function askDelete(group) {
    const dlg = $("deleteDialog");
    const typed = $("deleteConfirm");
    const go = $("deleteGo");
    const needsSlug = group.members > 0;
    $("deleteTitle").textContent = `Delete "${group.name}"?`;
    $("deleteBody").textContent = needsSlug
      ? `This permanently removes the group, its ${group.members} player${group.members === 1 ? "" : "s"} and all their scores. It cannot be undone.`
      : "This permanently removes the group and its settings. It has no players. It cannot be undone.";
    $("deleteSlugRow").hidden = !needsSlug;
    $("deleteSlugLabel").textContent = group.slug;
    typed.value = "";
    go.disabled = needsSlug;
    typed.oninput = () => { go.disabled = typed.value.trim() !== group.slug; };
    go.onclick = () => run(async () => {
      await call("/groups", { method: "DELETE", body: { groupId: group.id } });
      dlg.close();
      groups = groups.filter((g) => g.id !== group.id);
      renderGroups();
      toast("Group deleted");
    }, go);
    dlg.showModal();
  }

  function renderGroups() {
    $("groups").replaceChildren(...groups.map(renderGroup));
    $("noGroups").hidden = groups.length > 0;
    $("noGroups").textContent = me.globalAdmin ? "No groups yet. Create the first one above." : "You are not admin of any group yet.";
  }

  async function loadGroups() {
    const data = await call("/groups");
    groups = data.groups || [];
    renderGroups();
  }

  function comparePlayers(a, b) {
    if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0);
    if ((a.durationMs || 0) !== (b.durationMs || 0)) return (a.durationMs || 0) - (b.durationMs || 0);
    return (a.createdAt || 0) - (b.createdAt || 0);
  }

  function renderPlayers() {
    const wrap = $("playersGroups");
    if (!players.length) {
      wrap.replaceChildren(el("p", { className: "muted", textContent: "No players yet." }));
      return;
    }

    const grouped = new Map();
    for (const player of players) {
      const key = player.groupId || "__no_group__";
      const label = player.groupName || player.groupSlug || "No group";
      if (!grouped.has(key)) grouped.set(key, { label, players: [] });
      grouped.get(key).players.push(player);
    }

    const sectionNodes = Array.from(grouped.entries())
      .sort((a, b) => a[1].label.localeCompare(b[1].label))
      .map(([, group]) => {
        const sortedPlayers = [...group.players].sort(comparePlayers);
        const rows = sortedPlayers.map((player, index) => {
      const firstInput = el("input", { type: "text", value: player.firstName || "", maxLength: 40 });
      const lastInput = el("input", { type: "text", value: player.lastName || "", maxLength: 40 });
      const emailInput = el("input", { type: "email", value: player.email || "", maxLength: 120 });
      const anonymousToggle = el("input", { type: "checkbox", checked: !!player.isAnonymous });
      const forcePublicToggle = el("input", { type: "checkbox", checked: !!player.adminForcePublicIdentity });
      const saveBtn = el("button", { type: "button", className: "small", textContent: "Save" });
      const rank = `#${index + 1}`;

      saveBtn.addEventListener("click", () => run(async () => {
        const payload = {
          playerId: player.id,
          firstName: firstInput.value.trim(),
          lastName: lastInput.value.trim(),
          email: emailInput.value.trim().toLowerCase(),
          isAnonymous: anonymousToggle.checked,
          adminForcePublicIdentity: forcePublicToggle.checked,
        };
        const data = await call("/player", { method: "PATCH", body: payload });
        const updated = data.player || {};
        player.firstName = updated.firstName || payload.firstName;
        player.lastName = updated.lastName || payload.lastName;
        player.email = updated.email || payload.email;
        player.isAnonymous = !!updated.isAnonymous;
        player.adminForcePublicIdentity = !!updated.adminForcePublicIdentity;
        player.publicName = updated.publicName || player.publicName;
        toast("Player profile updated");
        await loadPlayers();
      }, saveBtn));

      return el("tr", {},
        el("td", { className: "rank", textContent: rank }),
        el("td", {},
          el("div", { className: "stack" },
            el("div", {}, firstInput),
            el("div", {}, lastInput),
            el("div", {}, emailInput),
          )),
        el("td", { textContent: player.publicName || "–" }),
        el("td", { className: "rank", textContent: String(player.score || 0) }),
        el("td", { className: "rank", textContent: String(player.games || 0) }),
        el("td", {},
          el("div", { className: "stack" },
            el("label", {}, anonymousToggle, " Anonymous on public board"),
            el("label", {}, forcePublicToggle, " Force public full name"),
          )),
        el("td", {}, saveBtn),
      );
        });

        const table = el("table", { className: "players-table" },
          el("thead", {},
            el("tr", {},
              el("th", { textContent: "#" }),
              el("th", { textContent: "Name + email" }),
              el("th", { textContent: "Public display" }),
              el("th", { textContent: "Score" }),
              el("th", { textContent: "Games" }),
              el("th", { textContent: "Privacy controls" }),
              el("th", { textContent: "Save" }),
            )),
          el("tbody", {}, ...rows),
        );

        return el("section", { className: "players-group" },
          el("h3", { textContent: `${group.label} (${sortedPlayers.length} player${sortedPlayers.length === 1 ? "" : "s"})` }),
          el("div", { className: "players-group-card" }, table),
        );
      });

    wrap.replaceChildren(...sectionNodes);
  }

  async function loadPlayers() {
    const data = await call("/players");
    players = data.players || [];
    renderPlayers();
  }

  async function runPlayersBackfill() {
    const status = $("playersBackfillStatus");
    status.textContent = "Running backfill…";
    const data = await call("/players/backfill", { method: "POST" });
    status.textContent = `Done. Updated ${data.updated || 0} player rows.`;
    await loadPlayers();
    toast("Legacy player data backfilled");
  }

  // ---- auth --------------------------------------------------------------

  async function loadSession() {
    me = await call("/admin");
    if (!me.admin) {
      showLogin();
      return false;
    }
    showApp();
    await loadGroups();
    await loadPlayers();
    return true;
  }

  async function consumeLoginToken() {
    const url = new URL(location.href);
    const token = String(url.searchParams.get("login_token") || "").trim();
    if (!token) return;
    // Remove the one-time token from the address bar straight away.
    url.searchParams.delete("login_token");
    history.replaceState({}, "", url.pathname + url.search + url.hash);
    const data = await call("/auth/verify-login", { method: "POST", body: { token } });
    if (data && data.token) sessionStorage.setItem(TOKEN_KEY, data.token);
  }

  // ---- diagnostics -------------------------------------------------------

  const CHECK_LABELS = [
    ["adminEmailsConfigured", "Admin emails are configured", true],
    ["sessionSecretConfigured", "Session secret is set", true],
    ["sessionSecretUsingAdminKey", "Session secret differs from admin key", false],
    ["resendConfigured", "Resend API key is set", true],
    ["emailSenderConfigured", "Email sender is set", true],
  ];

  async function checkAuthConfig() {
    const data = await call("/auth/debug");
    const checks = data.checks || {};
    $("diagChecks").replaceChildren(...CHECK_LABELS.map(([key, label, wantTrue]) => {
      const good = wantTrue ? !!checks[key] : !checks[key];
      return el("li", { className: good ? "" : "fail", textContent: label });
    }));
    $("diagStatus").className = `status ${data.ok ? "ok" : "warn"}`;
    $("diagStatus").textContent = data.ok ? "Configuration looks good." : (data.issues || ["Configuration has issues."]).join(" ");
  }

  async function testAccess() {
    const data = await call("/admin");
    $("diagStatus").className = `status ${data.admin ? "ok" : "warn"}`;
    $("diagStatus").textContent = data.admin
      ? `Signed in as ${data.email || "-"} (${data.globalAdmin ? "global admin" : "group admin"}).`
      : "This session has no admin rights.";
  }

  // ---- wiring ------------------------------------------------------------

  $("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("adminEmail").value.trim().toLowerCase();
    run(async () => {
      await call("/auth/request-login", { method: "POST", body: { email } });
      setAuthStatus("If this email has admin access, a one-time login link has been sent.", "ok");
    }, $("sendLoginLink"));
  });

  $("logout").addEventListener("click", () => run(async () => {
    await call("/auth/logout", { method: "POST" });
    sessionStorage.removeItem(TOKEN_KEY);
    me = { admin: false, globalAdmin: false, email: "" };
    showLogin();
    setAuthStatus("You have been logged out.");
  }, $("logout")));

  $("createForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("newGroupName").value.trim();
    const slug = $("newGroupSlug").value.trim();
    run(async () => {
      await call("/groups", { method: "POST", body: { name, slug } });
      $("newGroupName").value = "";
      $("newGroupSlug").value = "";
      await loadGroups();
      toast("Group created");
    }, e.submitter);
  });

  $("deleteCancel").addEventListener("click", () => $("deleteDialog").close());
  $("testCreds").addEventListener("click", () => run(testAccess, $("testCreds")));
  $("debugAuth").addEventListener("click", () => run(checkAuthConfig, $("debugAuth")));
  $("playersBackfill").addEventListener("click", () => run(runPlayersBackfill, $("playersBackfill")));

  (async () => {
    try {
      await consumeLoginToken();
    } catch (err) {
      showLogin();
      setAuthStatus(`That login link did not work: ${err.message}. Request a new one.`, "warn");
      return;
    }
    try {
      await loadSession();
    } catch (err) {
      showLogin();
      setAuthStatus(`Could not check your session: ${err.message}`, "warn");
    }
  })();
})();
