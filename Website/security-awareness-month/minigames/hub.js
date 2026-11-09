"use strict";

(() => {
  const el = (tag, attrs = {}, text) => {
    const node = Object.assign(document.createElement(tag), attrs);
    if (text !== undefined) node.textContent = text;
    return node;
  };

  // Bumped when the leaderboard is reset, so old local bests disappear too.
  function best(id) {
    try {
      localStorage.removeItem(`minigames:best:${id}`);
      return Number(localStorage.getItem(`minigames:best2:${id}`)) || 0;
    } catch { return 0; }
  }

  function card(g, query) {
    const node = el(g.pending ? "div" : "a", { className: "game" + (g.pending ? " soon" : "") });
    if (!g.pending) node.href = g.id + "/" + query;
    const cover = el("div", { className: "cover" }, g.icon);
    if (g.cover) {
      cover.textContent = "";
      cover.style.backgroundImage = `linear-gradient(180deg,transparent 40%,#131e2acc),url("${g.id}/cover.jpg")`;
    }
    const body = el("div", { className: "game-body" });
    const meta = el("div", { className: "game-meta" });
    const b = best(g.id);
    meta.append(
      el("span", {}, g.pending ? "COMING SOON" : "10 MIN"),
      el("span", { className: b ? "score" : "" }, b ? `Your best: ${b}` : g.pending ? "" : "Not played"),
    );
    body.append(el("h2", {}, g.title), el("p", {}, g.blurb), el("p", { className: "topics" }, g.topics), meta);
    node.append(cover, body);
    return node;
  }

  (async () => {
    let signInNote = "";
    try {
      const signedIn = await Board.consumeLoginLink();
      if (signedIn) {
        const who = signedIn.publicName || signedIn.name;
        signInNote = ` Signed in as ${who}${who.endsWith(".") ? "" : "."}`;
      }
    } catch (err) {
      signInNote = ` ${err.message}`;
    }

    const groupSlug = Board.group();
    const query = groupSlug ? `?group=${encodeURIComponent(groupSlug)}` : "";
    for (const node of document.querySelectorAll('.brand, .game-name, .champ-head a')) node.href += query;

    let allowed = null;
    if (groupSlug) {
      try {
        const group = await Board.call(`/group?slug=${encodeURIComponent(groupSlug)}`);
        allowed = new Set(group.games || []);
        const intro = document.querySelector(".hub-head .intro");
        if (intro) intro.textContent = `${intro.textContent} Group mode: ${group.name}.`;
        if (Board.player()) await Board.joinGroup(groupSlug);
      } catch {
        const intro = document.querySelector(".hub-head .intro");
        if (intro) intro.textContent = `${intro.textContent} Group link was not recognised, so all games are shown.`;
      }
    }

    for (const group of ["digital", "physical"]) {
      const games = MINIGAMES.games.filter((g) => g.group === group && (!allowed || g.pending || allowed.has(g.id)));
      document.getElementById(group).append(...games.map((g) => card(g, query)));
    }

    const introEl = document.querySelector(".hub-head .intro");
    if (signInNote && introEl) introEl.textContent = `${introEl.textContent}${signInNote}`;

    Board.get("overall").then((data) => {
      const box = document.getElementById("champ");
      box.replaceChildren(Board.table(data, { overall: true }));
      if (data.me) {
        box.append(el("p", { className: "chase" }, `You're #${data.me.rank} with ${data.me.score} points.`));
      } else if (!Board.player()) {
        box.append(el("p", { className: "muted" }, "Register your profile when you start a game to join."));
      }
    }).catch(() => {
      document.getElementById("champ").replaceChildren(el("p", { className: "muted" }, "Leaderboard unavailable right now. You can still play."));
    });
  })();
})();
