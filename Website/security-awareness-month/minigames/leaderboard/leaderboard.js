"use strict";

(() => {
  const allRanked = MINIGAMES.games.filter((g) => !g.pending);
  const $ = (id) => document.getElementById(id);
  const groupSlug = Board.group();
  let tabs = [{ id: "overall", title: "Championship" }, ...allRanked];
  let adminInfo = { admin: false, globalAdmin: false, groups: [] };

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

  // Group and game management lives on /admin/. Here a global admin only gets the remove buttons.
  function showAdminLink() {
    const link = Object.assign(document.createElement("a"), { href: "/admin/", textContent: "Admin panel →" });
    link.className = "hub-foot";
    $("board").after(link);
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
      if (adminInfo.admin) showAdminLink();
    } catch {
      adminInfo = { admin: false, globalAdmin: false, groups: [] };
    }
    await load();
  }

  window.addEventListener("hashchange", load);
  init();
})();
