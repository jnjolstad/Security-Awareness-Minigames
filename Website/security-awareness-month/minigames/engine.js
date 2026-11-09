"use strict";

(() => {
  const G = window.GAME;
  const TIME_LIMIT = G.timeLimit || 600;
  const POINTS = { perSecond: 1, wrong: 25, hint: 100, missed: 100 };
  const STORAGE_KEY = `minigames:${G.id}:v1`;
  // Bumped when the leaderboard is reset (see hub.js).
  const BEST_KEY = `minigames:best2:${G.id}`;
  const risks = G.spots.filter((s) => s.risk);
  const byId = Object.fromEntries(G.spots.map((s) => [s.id, s]));
  const MIN_TO_CONTINUE = G.minToContinue || Math.ceil(risks.length * 0.6);
  const isPhoto = G.scene.type === "photo";
  const pending = isPhoto && G.scene.pending;
  let forceFullNames = false;
  const groupSlug = Board.group();
  const groupQuery = groupSlug ? `?group=${encodeURIComponent(groupSlug)}` : "";

  const $ = (id) => document.getElementById(id);
  const SVG = "http://www.w3.org/2000/svg";

  function el(tag, attrs = {}, text) {
    const node = document.createElement(tag);
    Object.assign(node, attrs);
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function buildPage() {
    document.title = `${G.title} · Mini-games`;
    document.body.innerHTML = `
      <header class="topbar">
        <a class="brand" href="../${groupQuery}"><span class="brand-mark">SA</span> MINI-GAMES <small>/ SECURITY AWARENESS MONTH</small></a>
        <span class="game-name" id="gameName"></span>
        <button class="quiet" id="restart">Restart</button>
      </header>
      <main>
        <section class="intro-row">
          <div>
            <p class="eyebrow" id="eyebrow"></p>
            <h1><span id="h1a"></span><br><span class="accent" id="h1b"></span></h1>
            <p class="intro" id="intro"></p>
          </div>
          <aside class="stats" aria-label="Progress">
            <div><small>TIME</small><strong id="timer" role="timer">10:00</strong></div>
            <div><small>FOUND</small><strong id="found"></strong></div>
            <div><small>SCORE</small><strong id="score"></strong></div>
            <button class="quiet" id="hint">Hint (−${POINTS.hint})</button>
          </aside>
        </section>
        <section id="search" class="search">
          <div class="scene-wrap" id="sceneWrap">
            <div id="start" class="start">
              <form id="startForm" class="start-box">
                <p class="eyebrow">RANKED · ${TIME_LIMIT / 60} MINUTES</p>
                <div id="who"></div>
                <button id="startBtn">Start</button>
                <p id="startMsg" class="start-msg" aria-live="polite"></p>
              </form>
            </div>
          </div>
          <aside class="panel">
            <div id="detail" class="detail" aria-live="polite"></div>
            <ul id="list" class="list"></ul>
            <button id="finish" disabled></button>
          </aside>
        </section>
        <section id="chain" class="card" hidden>
          <p class="eyebrow">ROUND 2 · BREAK THE CHAIN</p>
          <h2 id="chainTitle"></h2>
          <p id="chainStory" class="story"></p>
          <div id="chainOptions" class="options"></div>
          <p id="chainFeedback" class="feedback" aria-live="polite"></p>
          <button id="chainNext" hidden></button>
        </section>
        <section id="debrief" class="card" hidden>
          <p class="eyebrow" id="debriefTitle">DEBRIEF</p>
          <h2>Score: <span id="finalScore"></span> <small class="best" id="best"></small></h2>
          <table class="breakdown"><tbody id="breakdown"></tbody></table>
          <div class="ranked" id="ranked" aria-live="polite"></div>
          <div class="debrief-grid">
            <div>
              <h3>Openings you found</h3>
              <ul id="foundList"></ul>
              <h3 id="missedHead">Missed</h3>
              <ul id="missedList"></ul>
            </div>
            <div>
              <h3>Three habits</h3>
              <ol class="habits" id="habits"></ol>
              <p class="guardrail">Thinking like an attacker is a habit for spotting risk. Testing real systems or premises always needs written permission.</p>
              <p class="credit">Openings are tagged with <a href="https://nsm.no/regelverk-og-hjelp/grunnprinsipper/" target="_blank" rel="noopener">NSM's basic principles for ICT security</a> where they fit. Physical and human habits have no tag. Some stories draw on NSM's <a href="https://nsm.no/regelverk-og-hjelp/rapporter/risiko-2026" target="_blank" rel="noopener">Risiko 2026</a>. Part of <a href="https://norsis.no/nasjonal-sikkerhetsmaned/" target="_blank" rel="noopener">Nasjonal sikkerhetsmåned</a> (NorSIS). Our own wording; not endorsed by NSM or NorSIS.</p>
              <div class="actions"><button id="again">Play again</button><a class="button quiet" href="../">All mini-games</a></div>
            </div>
          </div>
        </section>
      </main>`;
    $("gameName").textContent = G.title.toUpperCase();
    $("eyebrow").textContent = G.eyebrow;
    $("h1a").textContent = G.headline[0];
    $("h1b").textContent = G.headline[1];
    $("intro").textContent = G.intro.replace("{n}", risks.length);
    $("habits").replaceChildren(...(G.habits || [
      "Look at your surroundings the way an outsider would.",
      "Verify before you trust: badges, links, requests.",
      "Report it. A reported risk can be fixed.",
    ]).map((h) => el("li", {}, h)));
  }

  let stage;

  function buildPhotoScene(wrap) {
    const { width, height, src } = G.scene;
    const svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("role", "group");
    svg.setAttribute("aria-label", "Scene. Each object is a button.");
    svg.id = "stage";
    const img = document.createElementNS(SVG, "image");
    img.setAttribute("href", src);
    img.setAttribute("width", width);
    img.setAttribute("height", height);
    img.id = "photo";
    img.addEventListener("click", () => inspect(null));
    svg.append(img);
    for (const spot of G.spots) {
      for (const [x, y, w, h] of spot.boxes || [spot.box]) {
        const rect = document.createElementNS(SVG, "rect");
        for (const [k, v] of Object.entries({ x, y, width: w, height: h, class: "spot", tabindex: 0, role: "button", "data-spot": spot.id, "aria-label": spot.label })) {
          rect.setAttribute(k, v);
        }
        rect.addEventListener("click", () => inspect(spot.id));
        svg.append(rect);
      }
    }
    wrap.append(svg);
    return svg;
  }

  function buildHtmlScene(wrap) {
    const { width, height } = G.scene;
    const box = el("div", { className: "html-stage", id: "stage" });
    box.style.width = width + "px";
    box.style.height = height + "px";
    wrap.append(box);
    wrap.classList.add("html");
    const fit = () => {
      const scale = wrap.clientWidth / width;
      box.style.transform = `scale(${scale})`;
      wrap.style.height = height * scale + "px";
    };
    new ResizeObserver(fit).observe(wrap);
    fit();
    box.addEventListener("click", (e) => {
      const hit = e.target.closest("[data-spot]");
      if (hit) return inspect(hit.dataset.spot);
      if (e.target.closest("[data-free]")) return;
      inspect(null);
    });
    return box;
  }

  // Rebuilt for every run so each one gets its own layout from the run seed.
  function layoutScene(seed) {
    if (isPhoto || !stage) return;
    stage.innerHTML = G.scene.html;
    if (seed && G.shuffle) G.shuffle(stage, (label, n) => Board.order(seed, label, n));
    for (const node of stage.querySelectorAll("[data-spot]")) {
      const spot = byId[node.dataset.spot];
      if (!spot) { console.error("Unknown spot in markup:", node.dataset.spot); continue; }
      node.tabIndex = 0;
      node.setAttribute("role", "button");
      node.setAttribute("aria-label", spot.label);
    }
    if (G.setup) G.setup(stage);
  }

  function buildScene() {
    const wrap = $("sceneWrap");
    if (pending) {
      wrap.classList.add("is-pending");
      wrap.append(el("div", { className: "pending" }, "Scene image coming soon."));
      $("startBtn").disabled = true;
      $("startBtn").textContent = "Coming soon";
      $("hint").disabled = true;
      return;
    }
    stage = isPhoto ? buildPhotoScene(wrap) : buildHtmlScene(wrap);
    layoutScene(state.phase === "ready" ? null : state.seed);
    stage.addEventListener("keydown", (e) => {
      const hit = e.target.closest && e.target.closest("[data-spot]");
      if (hit && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); inspect(hit.dataset.spot); }
    });
    for (const spot of G.spots) {
      if (!stage.querySelector(`[data-spot="${spot.id}"]`)) console.error("Spot missing from scene:", spot.id);
    }
  }

  const fresh = () => ({ phase: "ready", found: [], cleared: [], wrong: 0, hints: 0, step: 0, selected: null, startedAt: null, endedAt: null, timeUp: false, log: [], runId: null, seed: null, result: null });

  // The server re-scores ranked runs from this log, so every scored action is recorded.
  function logEvent(k, v) {
    if (!state.startedAt) return;
    const entry = { t: Date.now() - state.startedAt, k };
    if (v !== undefined) entry.v = v;
    state.log.push(entry);
  }
  let state = load();

  function load() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
      if (saved && ["ready", "search", "chain", "done"].includes(saved.phase) && Array.isArray(saved.found)) {
        return { ...fresh(), ...saved, found: saved.found.filter((id) => byId[id] && byId[id].risk) };
      }
    } catch { /* fall through */ }
    return fresh();
  }

  function save() {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
  }

  function secondsLeft() {
    if (!state.startedAt) return TIME_LIMIT;
    const end = state.endedAt || Date.now();
    return Math.max(0, TIME_LIMIT - Math.floor((end - state.startedAt) / 1000));
  }

  // Time left is the only source of points. Missed openings are charged at the end.
  function breakdown() {
    return {
      time: state.timeUp ? 0 : secondsLeft() * POINTS.perSecond,
      wrong: -state.wrong * POINTS.wrong,
      hints: -state.hints * POINTS.hint,
      missed: state.phase === "done" ? -(risks.length - state.found.length) * POINTS.missed : 0,
    };
  }

  function score() {
    return Math.max(0, Object.values(breakdown()).reduce((a, b) => a + b, 0));
  }

  // Every wrong click costs points, including repeats and clicks on empty space.
  function inspect(id) {
    if (state.phase !== "search") return;
    logEvent("c", id || "");
    const spot = id && byId[id];
    if (spot && spot.risk) {
      if (!state.found.includes(id)) state.found.push(id);
    } else {
      state.wrong += 1;
      if (spot && !state.cleared.includes(id)) state.cleared.push(id);
    }
    state.selected = id || "empty";
    save();
    render();
  }

  function renderDetail() {
    const box = $("detail");
    box.replaceChildren();
    box.className = "detail";
    if (!state.selected) {
      box.append(el("p", { className: "muted" }, G.prompt || "Click anything an attacker could use."));
      return;
    }
    const spot = byId[state.selected];
    if (!spot || !spot.risk) {
      box.classList.add("ok");
      box.append(
        el("span", { className: "tag" }, "NOT AN OPENING · −" + POINTS.wrong),
        el("h3", {}, spot ? spot.label : "Nothing there"),
        el("p", {}, spot ? spot.note : "Look for something an attacker could actually use."),
      );
      return;
    }
    const dl = el("dl");
    for (const [term, text] of [["ATTACKER", spot.attacker], ["WHY IT WORKS", spot.why], ["WHAT YOU DO", spot.act]]) {
      dl.append(el("dt", {}, term), el("dd", {}, text));
    }
    box.append(el("span", { className: "tag" }, "OPENING · " + spot.topic.toUpperCase()), el("h3", {}, spot.title), dl);
    const n = nsmFor(spot.id);
    if (n) box.append(nsmLink(n, "nsm"));
  }

  function nsmFor(id) {
    return window.NSM ? window.NSM.lookup(G.id, id) : null;
  }

  function nsmLink(n, className) {
    return el("a", { className, href: n.url, target: "_blank", rel: "noopener", title: "NSM basic principles for ICT security (in Norwegian)" },
      `NSM ${n.code} · ${n.title} ↗`);
  }

  function renderSearch() {
    if (stage) {
      for (const node of stage.querySelectorAll("[data-spot]")) {
        const id = node.dataset.spot;
        node.classList.toggle("found", state.found.includes(id));
        node.classList.toggle("cleared", state.cleared.includes(id));
      }
    }
    renderDetail();
    $("list").replaceChildren(...(state.found.length
      ? state.found.map((id) => el("li", {}, byId[id].title))
      : [el("li", { className: "empty muted" }, "No openings found yet.")]));
    const enough = state.found.length >= MIN_TO_CONTINUE;
    const finish = $("finish");
    finish.disabled = !enough;
    finish.textContent = state.found.length === risks.length ? "All found. Break the chain →"
      : enough ? "Continue to round 2 →" : `Find at least ${MIN_TO_CONTINUE} to continue`;
    $("hint").disabled = state.found.length === risks.length;
  }

  // Answer options are shown in a per-run order, so players have to read them.
  // The log records the position clicked; the server maps it back with the same seed.
  const chainOrder = (step) => Board.order(state.seed || state.runId || "", "chain" + step, G.chain[step].options.length);

  function renderChain() {
    const q = G.chain[state.step];
    $("chainTitle").textContent = `${state.step + 1} / ${G.chain.length} · ${q.title}`;
    $("chainStory").textContent = q.story;
    $("chainFeedback").textContent = `Which single step stops this best? Wrong answers cost ${POINTS.wrong}.`;
    $("chainNext").hidden = true;
    $("chainOptions").replaceChildren(...chainOrder(state.step).map((option, pos) => {
      const b = el("button", { type: "button" }, q.options[option]);
      b.addEventListener("click", () => answer(pos, b));
      return b;
    }));
  }

  function answer(pos, button) {
    const q = G.chain[state.step];
    logEvent("a", pos);
    if (chainOrder(state.step)[pos] !== q.answer) {
      state.wrong += 1;
      button.classList.add("wrong");
      button.disabled = true;
      $("chainFeedback").textContent = `That doesn't break the chain. −${POINTS.wrong}. Try another.`;
      save();
      renderStats();
      return;
    }
    button.classList.add("right");
    for (const b of $("chainOptions").children) b.disabled = true;
    $("chainFeedback").textContent = q.why;
    const next = $("chainNext");
    next.hidden = false;
    next.textContent = state.step + 1 < G.chain.length ? "Next →" : "See debrief →";
    next.focus();
  }

  function finishGame(timeUp) {
    state.phase = "done";
    state.timeUp = timeUp;
    state.endedAt = timeUp ? state.startedAt + TIME_LIMIT * 1000 : Date.now();
    save();
    try {
      const best = Number(localStorage.getItem(BEST_KEY)) || 0;
      if (score() > best) localStorage.setItem(BEST_KEY, String(score()));
    } catch { /* storage unavailable */ }
    render();
    submit();
  }

  async function submit() {
    if (!state.runId || state.result) return;
    const runId = state.runId;
    try {
      state.result = await Board.finish(runId, state.log);
    } catch (err) {
      state.result = { error: err.message };
    }
    if (state.runId !== runId) return;
    save();
    renderRanked();
  }

  function renderRanked() {
    const box = $("ranked");
    box.replaceChildren();
    const line = (cls, text) => box.append(el("p", { className: cls }, text));
    if (!state.runId) {
      line("muted", "Unranked run. Register your profile before you start to get on the leaderboard.");
    } else if (!state.result) {
      line("muted", "Submitting to the leaderboard…");
      return;
    } else if (state.result.error) {
      line("warn", `Leaderboard: ${state.result.error}`);
    } else {
      const r = state.result;
      const head = el("p", { className: "rank-line" });
      head.append(el("strong", {}, `#${r.rank}`), ` of ${r.total} · official score ${r.score}`);
      if (r.personalBest) head.append(el("span", { className: "pb" }, "NEW PERSONAL BEST"));
      box.append(head);
      if (!r.personalBest) line("muted", `Your best on this game is ${r.best}. Only your best counts.`);
      if (r.next) line("chase", `${r.next.gap} point${r.next.gap === 1 ? "" : "s"} to pass ${r.next.name} at #${r.rank - 1}.`);
      else if (r.rank === 1) line("chase", "You're top of the board. Defend it.");
      box.append(Board.table(r.board));
    }
    const links = el("p", { className: "lb-links" });
    links.append(el("a", { href: "../leaderboard/#" + G.id }, "Full leaderboard →"));
    box.append(links);
  }

  function nextChain() {
    state.step += 1;
    if (state.step >= G.chain.length) return finishGame(false);
    save();
    render();
  }

  function clock(sec) {
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
  }

  function renderDebrief() {
    $("debriefTitle").textContent = state.timeUp ? "TIME'S UP" : "DEBRIEF";
    $("finalScore").textContent = score();
    let best = 0;
    try { best = Number(localStorage.getItem(BEST_KEY)) || 0; } catch { /* storage unavailable */ }
    $("best").textContent = best ? `Best: ${best}` : "";
    const b = breakdown();
    const missed = risks.filter((r) => !state.found.includes(r.id));
    const rows = [
      ["Time left", state.timeUp ? "0:00" : clock(secondsLeft()), b.time],
      ["Wrong clicks", `${state.wrong} × −${POINTS.wrong}`, b.wrong],
      ["Hints", `${state.hints} × −${POINTS.hint}`, b.hints],
      ["Openings missed", `${missed.length} × −${POINTS.missed}`, b.missed],
    ];
    $("breakdown").replaceChildren(...rows.map(([label, detail, pts]) => {
      const tr = el("tr");
      tr.append(el("td", {}, label), el("td", { className: "muted" }, detail), el("td", {}, (pts > 0 ? "+" : "") + pts));
      return tr;
    }));
    $("foundList").replaceChildren(...state.found.map((id) => {
      const li = el("li", {}, byId[id].title + " ");
      li.append(el("small", {}, "· " + byId[id].topic));
      const n = nsmFor(id);
      if (n) li.append(" ", nsmLink(n, "nsm small"));
      return li;
    }));
    $("missedHead").hidden = !missed.length;
    $("missedList").replaceChildren(...missed.map((r) => {
      const li = el("li", {}, r.title + " ");
      li.append(el("small", {}, "· " + r.act));
      const n = nsmFor(r.id);
      if (n) li.append(" ", nsmLink(n, "nsm small"));
      return li;
    }));
    renderRanked();
  }

  function renderWho() {
    const who = $("who");
    who.replaceChildren();
    if (pending) {
      who.append(el("p", { className: "muted" }, "Scene image coming soon."));
      return;
    }
    const p = Board.player();
    if (p) {
      const line = el("p", { className: "playing-as" }, "Playing as ");
      line.append(el("strong", {}, p.publicName || p.name), " ");
      const change = el("button", { type: "button", className: "linkish" }, "change");
      change.addEventListener("click", () => {
        if (confirm("Use a different profile? Scores stay with the old one, and this browser forgets it.")) {
          Board.forget();
          renderWho();
        }
      });
      line.append(change);
      who.append(line);
    } else {
      if (forceFullNames) {
        const first = el("input", { id: "firstName", maxLength: 40, autocomplete: "given-name", placeholder: "First name" });
        const last = el("input", { id: "lastName", maxLength: 40, autocomplete: "family-name", placeholder: "Last name" });
        const email = el("input", { id: "email", type: "email", maxLength: 120, autocomplete: "email", placeholder: "Work email" });
        who.append(
          el("label", { htmlFor: "firstName" }, "First name"),
          first,
          el("label", { htmlFor: "lastName" }, "Last name"),
          last,
          el("label", { htmlFor: "email" }, "Email"),
          email,
          el("small", { className: "muted" }, "This group requires your full name and email for ranked play."),
        );
      } else {
        const nick = el("input", { id: "nick", maxLength: 20, autocomplete: "nickname", placeholder: "Nickname" });
        who.append(
          el("label", { htmlFor: "nick" }, "Nickname"),
          nick,
          el("small", { className: "muted" }, "Nicknames are allowed unless the group enforces full names."),
        );
      }
      const solo = el("button", { type: "button", className: "linkish", id: "unranked" }, "Play without the leaderboard");
      solo.addEventListener("click", () => begin(null));
      who.append(solo, signInBlock());
    }
  }

  // Players who registered with an email can get a one-time link that signs
  // them back in on this browser or any other.
  function signInBlock() {
    const wrap = el("div", { className: "signin" });
    const toggle = el("button", { type: "button", className: "linkish", id: "signinToggle" }, "Already registered? Sign in");
    const form = el("div", { hidden: true });
    const email = el("input", { id: "signinEmail", type: "email", maxLength: 120, autocomplete: "email", placeholder: "Email you registered with" });
    const send = el("button", { type: "button", className: "quiet small", id: "signinSend" }, "Email me a sign-in link");
    const note = el("small", { className: "muted", id: "signinMsg" });
    toggle.addEventListener("click", () => { form.hidden = !form.hidden; });
    send.addEventListener("click", async () => {
      const value = (email.value || "").trim();
      if (!value) {
        note.textContent = "Enter the email you registered with.";
        return;
      }
      send.disabled = true;
      try {
        await Board.requestLogin(value);
        note.textContent = "If that email is registered, a sign-in link is on its way. Open it on this device, then come back to this game.";
      } catch (err) {
        note.textContent = err.message;
      } finally {
        send.disabled = false;
      }
    });
    form.append(email, send, note);
    wrap.append(toggle, form);
    return wrap;
  }

  function begin(runId) {
    state = fresh();
    state.phase = "search";
    state.runId = runId;
    state.seed = runId || Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
    layoutScene(state.seed);
    state.startedAt = Date.now();
    save();
    render();
  }

  async function startRanked(e) {
    e.preventDefault();
    if (pending) return;
    const btn = $("startBtn");
    const msg = $("startMsg");
    msg.textContent = "";
    btn.disabled = true;
    try {
      if (!Board.player()) {
        if (forceFullNames) {
          const firstName = ($("firstName").value || "").trim();
          const lastName = ($("lastName").value || "").trim();
          const email = ($("email").value || "").trim();
          if (!firstName || !lastName || !email) {
            msg.textContent = "Enter first name, last name and email, or play without the leaderboard.";
            return;
          }
          await Board.register({
            firstName,
            lastName,
            email,
            isAnonymous: false,
          });
        } else {
          const nick = ($("nick").value || "").trim();
          if (!nick) {
            msg.textContent = "Pick a nickname, or play without the leaderboard.";
            return;
          }
          await Board.register(nick);
        }
      } else if (forceFullNames) {
        const p = Board.player();
        if (p && (!p.firstName || !p.lastName || !p.email)) {
          Board.forget();
          renderWho();
          msg.textContent = "This group requires first name, last name and email. Register again.";
          return;
        }
      }
      const { runId } = await Board.start(G.id);
      begin(runId);
    } catch (err) {
      msg.textContent = err.status === 401
        ? "That profile has been removed from the leaderboard. Register again and press start."
        : err.message;
      renderWho();
    } finally {
      btn.disabled = pending;
    }
  }

  async function loadGroupPolicy() {
    const slug = Board.group();
    if (!slug) {
      forceFullNames = false;
      return;
    }
    try {
      const group = await Board.call(`/group?slug=${encodeURIComponent(slug)}`);
      forceFullNames = !!(group && group.forceFullNames);
    } catch {
      forceFullNames = false;
    }
  }

  function renderStats() {
    const left = secondsLeft();
    $("found").textContent = `${state.found.length} / ${risks.length}`;
    $("score").textContent = score();
    $("timer").textContent = clock(left);
    $("timer").classList.toggle("low", left <= 60 && state.phase !== "done");
  }

  function render() {
    $("start").hidden = state.phase !== "ready";
    $("search").hidden = !["ready", "search"].includes(state.phase);
    $("search").classList.toggle("locked", state.phase === "ready");
    $("chain").hidden = state.phase !== "chain";
    $("debrief").hidden = state.phase !== "done";
    $("hint").hidden = state.phase !== "search";
    renderStats();
    if (state.phase === "search" || state.phase === "ready") renderSearch();
    if (state.phase === "chain") renderChain();
    if (state.phase === "done") renderDebrief();
  }

  function tick() {
    if (state.phase !== "search" && state.phase !== "chain") return;
    if (secondsLeft() === 0) return finishGame(true);
    renderStats();
  }

  // A ranked run that finished while offline or during a reload is submitted again.
  function resume() {
    if (state.phase === "done" && state.runId && !state.result) submit();
  }

  function hint() {
    const left = risks.filter((r) => !state.found.includes(r.id));
    if (!left.length) return;
    const target = left[Math.floor(Math.random() * left.length)];
    state.hints += 1;
    logEvent("h");
    save();
    renderStats();
    if (G.reveal) G.reveal(target.id);
    const node = stage.querySelector(`[data-spot="${target.id}"]`);
    node.classList.remove("hinted");
    void node.getBoundingClientRect();
    node.classList.add("hinted");
    setTimeout(() => node.classList.remove("hinted"), 4000);
  }

  function restart() {
    state = fresh();
    save();
    renderWho();
    render();
    window.scrollTo(0, 0);
  }

  buildPage();
  buildScene();
  loadGroupPolicy().finally(() => renderWho());
  $("startForm").addEventListener("submit", startRanked);
  $("finish").addEventListener("click", () => {
    state.phase = "chain";
    state.step = 0;
    save();
    render();
  });
  $("chainNext").addEventListener("click", nextChain);
  $("hint").addEventListener("click", hint);
  $("restart").addEventListener("click", restart);
  $("again").addEventListener("click", restart);
  setInterval(tick, 1000);
  tick();
  render();
  resume();
})();
