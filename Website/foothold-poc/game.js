"use strict";

(() => {
  const KEY = "foothold-poc:v1";
  const DURATION = 15 * 60 * 1000;
  const $ = (id) => document.getElementById(id);
  const order = ["people", "place", "platform"];
  const findingText = {
    people: "Vera Chen · Release Owner. A-04 + R-08.",
    place: "P2 · Escorted access. Session not revoked.",
    platform: "G-17 · PreviewBridge · package.write."
  };
  const hints = {
    people: [
      "Trace the source of each confirmation. Three people repeating a claim are not three independent approvals.",
      "The signed responsibility agreement gives a role. The current duty roster tells you who holds it."
    ],
    place: [
      "You need both an allowed physical visit and a session that can reach the release package. A press pass is not enough.",
      "Compare P2's session lifetime with the credential event. The password changed, but sessions were not revoked."
    ],
    platform: [
      "Compare the contracted task with each active grant. Which right goes beyond making an artwork preview?",
      "G-17 belongs to PreviewBridge and includes package.write. G-18 is read-only and G-19 was denied."
    ]
  };
  let state;
  let lane = null;
  let storageAvailable = true;

  function fresh() {
    return { startedAt: null, lastFindingAt: null, solved: [], hints: { people: 0, place: 0, platform: 0 }, marker: false, outcome: null, finishedAt: null };
  }

  function valid(value) {
    return value && (value.startedAt === null || (Number.isFinite(value.startedAt) && value.startedAt > 0))
      && (value.lastFindingAt === null || Number.isFinite(value.lastFindingAt))
      && Array.isArray(value.solved) && value.solved.every((id) => order.includes(id))
      && new Set(value.solved).size === value.solved.length
      && value.hints && order.every((id) => Number.isInteger(value.hints[id]) && value.hints[id] >= 0 && value.hints[id] <= hints[id].length)
      && typeof value.marker === "boolean" && [null, "success", "timeout"].includes(value.outcome)
      && (value.finishedAt === null || Number.isFinite(value.finishedAt))
      && (!value.marker || value.solved.length === 3)
      && (!value.outcome || value.finishedAt !== null);
  }

  function announce(message) {
    $("notice").textContent = message;
    $("notice").hidden = false;
  }

  try {
    const saved = sessionStorage.getItem(KEY);
    state = saved ? JSON.parse(saved) : fresh();
    if (!valid(state)) throw new Error("Unrecognised saved game format");
  } catch (error) {
    console.warn("FOOTHOLD could not restore local progress.", error);
    state = fresh();
    announce("Saved progress could not be restored. A fresh demo has been prepared.");
  }

  function save() {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("FOOTHOLD could not save local progress.", error);
      storageAvailable = false;
      $("storageWarning").hidden = false;
    }
  }

  function closeDialogs() {
    document.querySelectorAll("dialog[open]").forEach((dialog) => dialog.close());
  }

  function show(dialog) {
    closeDialogs();
    dialog.showModal();
  }

  function remaining() {
    return state.startedAt === null ? DURATION : Math.max(0, DURATION - ((state.finishedAt ?? Date.now()) - state.startedAt));
  }

  function playable() {
    if (state.outcome) return false;
    if (state.startedAt === null) {
      show($("briefDialog"));
      return false;
    }
    if (remaining() <= 0) {
      finish("timeout");
      return false;
    }
    return true;
  }

  function feedback(id, message, success = false) {
    const target = $(id);
    target.hidden = false;
    target.className = `feedback ${success ? "success" : "error"}`;
    target.textContent = message;
  }

  function hintCount() {
    return Object.values(state.hints).reduce((sum, count) => sum + count, 0);
  }

  function render() {
    const solved = state.solved.length;
    $("progress").textContent = `${solved} / 3 findings`;
    $("start").textContent = state.startedAt === null ? "Start assessment →" : "Return to operations →";
    $("meter").style.width = `${solved / 3 * 100}%`;
    $("phase").textContent = state.outcome ? (state.outcome === "success" ? "Assessment complete" : "Window closed")
      : state.marker ? "Marker placed · close the opening" : state.startedAt === null ? "Awaiting briefing" : "Assessment active";
    $("hintCount").textContent = hintCount();
    $("hintCost").textContent = `${hintCount() * 25} pts`;
    $("findings").replaceChildren();
    if (!solved) {
      const empty = document.createElement("li");
      empty.className = "empty";
      empty.textContent = "No findings yet. Start with any lane.";
      $("findings").append(empty);
    }
    order.forEach((id) => {
      const done = state.solved.includes(id);
      $(`${id}Status`).textContent = done ? "VERIFIED" : "UNRESOLVED";
      document.querySelector(`.lane.${id}`).classList.toggle("solved", done);
      document.querySelector(`[data-lane="${id}"]`).disabled = !!state.outcome;
      if (done) {
        const item = document.createElement("li");
        const label = document.createElement("small");
        label.textContent = `${id.toUpperCase()} / VERIFIED`;
        item.append(label, document.createTextNode(findingText[id]));
        $("findings").append(item);
      }
    });
    $("routePeople").textContent = state.solved.includes("people") ? "Vera Chen / release owner" : "Who owns the decision?";
    $("routePlace").textContent = state.solved.includes("place") ? "P2 / retained release session" : "Which session survives?";
    $("routePlatform").textContent = state.solved.includes("platform") ? "G-17 / package.write" : "What permits a change?";
    $("routeBadge").textContent = state.marker ? "MARKER PLACED" : solved === 3 ? "ROUTE READY" : "EVIDENCE REQUIRED";
    $("routeSummary").textContent = state.marker ? "You proved access. Now break the demonstrated route."
      : solved === 3 ? "Three clues connected. Test your route." : "Resolve three lanes to unlock the route.";
    $("openFinale").disabled = solved !== 3 || !!state.outcome;
    $("openFinale").textContent = state.marker ? "Close the opening →" : "Assemble the route →";
    $("storageWarning").hidden = storageAvailable;
    renderOutcome();
    tick();
  }

  function field(id, label, options) {
    return `<label for="${id}">${label}<select id="${id}" required><option value="">Select a finding…</option>${options.map(([value, name]) => `<option value="${value}">${name}</option>`).join("")}</select></label>`;
  }

  const lanes = {
    people: {
      title: "Borrowed authority",
      question: "Trace the approvals. Who actually owns the decision?",
      content: () => `<div class="message-chain" aria-label="Message sources">
        <article class="message"><small>M-01 · 16:42</small><h3>Coordinator</h3><blockquote>“The partner approved it.”</blockquote><span class="source-link">source → M-02</span></article>
        <article class="message"><small>M-02 · 16:39</small><h3>Partner</h3><blockquote>“Crew chat confirmed it.”</blockquote><span class="source-link">source → M-03</span></article>
        <article class="message"><small>M-03 · 16:35</small><h3>Crew chat</h3><blockquote>“The coordinator said OK.”</blockquote><span class="source-link">source → coordinator call</span></article>
      </div>
      <div class="evidence-pair">
        <article class="visual-record"><small>A-04 / SIGNED AGREEMENT</small><div class="role-badge">RELEASE OWNER</div><p>May approve package changes.</p><span class="minor">Partners: previews only.</span></article>
        <article class="visual-record"><small>R-08 / DUTY ROSTER · 16:00–18:00</small><ul class="roster"><li><strong>Vera Chen</strong><span>Release Owner</span></li><li><strong>Owen Park</strong><span>Coordinator</span></li><li><strong>Nia Cole</strong><span>Partner Lead</span></li></ul></article>
      </div>
      <details class="extra"><summary>S-09 / AI summary</summary><p>“All three teams approved.” Sources: M-01, M-02, M-03. No independent sign-off.</p></details>
      <form id="laneForm" class="form-grid">
        ${field("owner", "Decision owner", [["owen","Owen Park"],["vera","Vera Chen"],["nia","Nia Cole"]])}
        ${field("authority", "Authority record", [["messages","M-01 / Coordinator"],["agreement","A-04 / Agreement"],["summary","S-09 / AI summary"]])}
        ${field("identity", "Role holder record", [["roster","R-08 / Roster"],["chat","M-03 / Crew chat"],["partner","M-02 / Partner"]])}
      </form>`,
      check: () => $("owner").value === "vera" && $("authority").value === "agreement" && $("identity").value === "roster",
      wrong: "That does not establish independent authority. Match the approval role to its current owner."
    },
    place: {
      title: "A borrowed workstation",
      question: "Find a reachable desk with a usable release session.",
      content: () => `<div class="visitor-pass"><span class="pass-icon" aria-hidden="true">▣</span><div><small>V-12 / YOUR TEST PASS</small><strong>Zone B · Escorted · 16:45</strong></div><span class="minor">P2 use authorised</span></div>
      <div class="venue">
        <div class="zone"><small>ZONE A / PUBLIC</small><span class="desk-icon" aria-hidden="true">▱</span><strong>P1 · Press hall</strong><span class="state-chip">Signed out</span></div>
        <div class="zone"><small>ZONE B / ESCORTED</small><span class="desk-icon" aria-hidden="true">▱</span><strong>P2 · Partner desk</strong><span class="state-chip warn">Session open</span></div>
        <div class="zone"><small>ZONE C / STAFF ONLY</small><span class="desk-icon" aria-hidden="true">▱</span><strong>P3 · Production</strong><span class="state-chip">Locked + MFA</span></div>
      </div>
      <section class="timeline-panel" aria-label="P2 session events"><small>T-21 / P2 SESSION</small>
        <ol class="event-timeline"><li><time>15:00</time><strong>Session opens</strong></li><li><time>16:00</time><strong>Password changes</strong></li><li class="flag"><time>16:05</time><strong>Sessions not revoked</strong></li><li><time>18:00</time><strong>Session expires</strong></li></ol>
      </section>
      <details class="extra"><summary>Other routes / control checks</summary><ul class="control-checks"><li>P3: staff gate blocks tailgating. Unexpected MFA request rejected and reported.</li><li>U-07: found USB quarantined, never connected.</li><li>N-03: guest Wi-Fi isolated; look-alike network blocked. P2 uses the managed partner network.</li></ul></details>
      <form id="laneForm" class="form-grid">
        ${field("desk", "Your entry point", [["p1","P1 / Press hall"],["p2","P2 / Partner desk"],["p3","P3 / Production"]])}
        ${field("session", "What keeps access alive?", [["password","Vendor pass reveals a password"],["retained","Existing session not revoked"],["mfa","MFA can always be bypassed"]])}
      </form>`,
      check: () => $("desk").value === "p2" && $("session").value === "retained",
      wrong: "Match both boundaries: your permitted visit and a usable session. Check the timeline."
    },
    platform: {
      title: "Permission is the payload",
      question: "Compare the job with the access. Find the excess grant.",
      content: () => `<div class="contract-strip"><small>C-11 / PREVIEWBRIDGE CONTRACT</small><div><span>Public artwork</span><b aria-hidden="true">→</b><span>Generate preview</span><b aria-hidden="true">⊣</b><span>No package changes</span></div></div>
      <div class="permission-scroll" tabindex="0" role="region" aria-label="App permissions, scroll horizontally on small screens"><table class="permissions"><caption>Granted access</caption><thead><tr><th scope="col">App / grant</th><th scope="col">Read artwork</th><th scope="col">Edit package</th><th scope="col">Org admin</th></tr></thead><tbody>
        <tr><th scope="row">PreviewBridge <small>G-17 · ACTIVE</small></th><td><span class="access yes">✓<span class="sr-only"> Granted</span></span></td><td><span class="access yes">✓<span class="sr-only"> Granted</span></span></td><td>—<span class="sr-only"> Not granted</span></td></tr>
        <tr><th scope="row">StageMonitor <small>G-18 · ACTIVE</small></th><td>—</td><td>—</td><td>—</td></tr>
        <tr><th scope="row">PreviewBridge <small>G-19 · REQUEST</small></th><td>—</td><td>—</td><td><span class="access denied">Denied</span></td></tr>
      </tbody></table></div>
      <div class="grant-link"><span>P2 session</span><b aria-hidden="true">→</b><span>G-17</span><b aria-hidden="true">→</b><span>ATLAS press package</span></div>
      <details class="extra"><summary>Grant details & asset scope</summary><ul class="control-checks"><li>G-17: artwork.read + package.write. Active until 18:00.</li><li>G-18: status.read, public status only.</li><li>G-19: organisation.admin requested, not granted.</li><li>D-06: press package = authorised staging target. Strategy vault = Confidential, no writes.</li></ul></details>
      <form id="laneForm" class="form-grid">
        ${field("grant", "Excess grant", [["g18","G-18 / StageMonitor"],["g19","G-19 / Admin request"],["g17","G-17 / PreviewBridge"]])}
        ${field("permission", "Capability", [["read","status.read"],["write","package.write"],["admin","organisation.admin"]])}
      </form>`,
      check: () => $("grant").value === "g17" && $("permission").value === "write",
      wrong: "Separate requested permissions from granted permissions. Find active access to the package."
    }
  };

  function renderHints() {
    const count = state.hints[lane];
    $("hints").hidden = count === 0;
    $("hints").textContent = hints[lane].slice(0, count).join(" ");
    $("hint").disabled = count === hints[lane].length || state.solved.includes(lane) || !!state.outcome;
    $("hint").textContent = count === hints[lane].length ? "All hints revealed" : "Request a hint (−25)";
  }

  function openLane(id) {
    if (!playable()) return;
    lane = id;
    $("laneEyebrow").textContent = `${id.toUpperCase()} / EVIDENCE INVESTIGATION`;
    $("laneTitle").textContent = lanes[id].title;
    $("laneQuestion").textContent = lanes[id].question;
    $("laneContent").innerHTML = lanes[id].content();
    $("laneFeedback").hidden = true;
    $("verify").disabled = state.solved.includes(id);
    if (state.solved.includes(id)) feedback("laneFeedback", findingText[id], true);
    renderHints();
    $("laneForm").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!playable() || state.solved.includes(lane)) return;
      if (!lanes[lane].check()) {
        feedback("laneFeedback", lanes[lane].wrong);
        return;
      }
      state.solved.push(lane);
      state.lastFindingAt = Date.now();
      save();
      render();
      feedback("laneFeedback", `Verified. ${findingText[lane]}`, true);
      $("verify").disabled = true;
      renderHints();
    });
    show($("laneDialog"));
  }

  function revealHint() {
    if (!playable() || !lane || state.solved.includes(lane) || state.hints[lane] >= hints[lane].length) return;
    state.hints[lane]++;
    save();
    renderHints();
    render();
  }

  function renderFinale() {
    $("finalFeedback").hidden = true;
    if (state.marker) {
      $("finalTitle").textContent = "Now close the opening.";
      $("finalContent").innerHTML = `<div class="marker">MARKER RECEIPT / FH-DEMO-001<br>ATLAS press package / staging<br>Non-executable simulation marker placed.</div>
        <div class="grant-link"><span>P2</span><b aria-hidden="true">→</b><span>G-17 / package.write</span><b aria-hidden="true">→</b><span>ATLAS package</span></div>
        <p>P2 stays signed in. Remove the app's write access.</p>
        <form id="containForm">${field("control", "Break the route", [["password","Rotate the partner password only"],["grant","Revoke G-17; reissue preview-only access"],["name","Rename the ATLAS package"],["messages","Delete the coordinator's message"]])}<button type="submit">Apply control & finish →</button></form>`;
      $("containForm").addEventListener("submit", (event) => {
        event.preventDefault();
        if (!playable()) return;
        if ($("control").value !== "grant") {
          feedback("finalFeedback", "That leaves the demonstrated delegated capability in place. Remove the excess app grant, not just a message or password.");
          return;
        }
        finish("success");
      });
    } else {
      $("finalTitle").textContent = "Assemble the route";
      $("finalContent").innerHTML = `<p>Connect your findings to the authorised target.</p>
        <div class="marker">PAYLOAD / FOOTHOLD-ASSESSMENT-MARKER<br>Plain fictional receipt · no executable content</div>
        <form id="markerForm"><div class="form-grid">
        ${field("target", "Destination", [["vault","Confidential launch strategy vault"],["package","ATLAS press package / staging"],["status","Public status page"]])}
        ${field("route", "Capability and entry point", [["guest","P1 guest Wi-Fi / public session"],["delegated","P2 release session / G-17 package.write"],["denied","P3 locked device / denied admin request"]])}
        </div>        <p class="locked-note">Staging only. No Confidential assets. No code execution.</p><button type="submit">Place simulated marker →</button></form>`;
      $("markerForm").addEventListener("submit", (event) => {
        event.preventDefault();
        if (!playable() || state.solved.length !== 3) return;
        if ($("target").value !== "package" || $("route").value !== "delegated") {
          feedback("finalFeedback", "Route refused. Stay within scope and use the exact session, grant and resource your evidence supports.");
          return;
        }
        state.marker = true;
        state.lastFindingAt = Date.now();
        save();
        render();
        renderFinale();
        $("finalTitle").tabIndex = -1;
        $("finalTitle").focus();
      });
    }
  }

  function finish(outcome) {
    if (state.outcome) return;
    state.outcome = outcome;
    state.finishedAt = Date.now();
    save();
    closeDialogs();
    render();
    $("outcome").scrollIntoView({ behavior: "auto", block: "start" });
    $("outcomeTitle").tabIndex = -1;
    $("outcomeTitle").focus();
  }

  function renderOutcome() {
    $("outcome").hidden = !state.outcome;
    if (!state.outcome) return;
    const success = state.outcome === "success";
    $("outcomeLabel").textContent = success ? "ASSESSMENT COMPLETE / DEMO RESULT ONLY" : "ASSESSMENT WINDOW CLOSED";
    $("outcomeTitle").textContent = success ? "You proved the opening. And closed it." : "The launch window has closed.";
    const points = Math.max(0, 500 + Math.floor(remaining() / 60000) * 10 - hintCount() * 25);
    $("outcomeBody").textContent = success
      ? `Marker placed in staging. G-17 revoked; preview-only access reissued. Demo score: ${points} points, including ${hintCount() * 25} hint penalty. This is not a ranked or registered attempt.`
      : `You verified ${state.solved.length} of 3 findings${state.marker ? " and placed the marker, but did not close the opening" : ""}. Replay is available in this concept demo. Review the explanation below before trying again.`;
    $("debrief").innerHTML = `<div class="debrief-grid">
      <div><h3>The opening</h3><p>P2 session retained.<br>G-17 could write.<br>Package exposed.</p></div>
      <div><h3>The defences</h3><p>MFA held.<br>Visitor limits held.<br>Admin access denied.</p></div>
      <div><h3>At work</h3><p>Verify approvals.<br>Review grants and sessions.<br>Report suspicious access.</p></div>
      </div><details class="extra"><summary>Full debrief & prototype scope</summary><p>An escorted visit allowed P2 use, not automatic system access. Its existing session survived a password change. G-17 supplied the excessive write capability; removing it broke the demonstrated route. Vera's authority came from independent records, not repeated messages.</p><p>P3 was locked with MFA, USB media was quarantined, guest Wi-Fi was isolated and the admin grant was denied. Preserve evidence and use your company's real security reporting channel.</p><p>This slice covers selected learning goals, not the full 16-topic curriculum or a validated 45-minute game.</p></details>`;
  }

  function tick() {
    const time = Math.ceil(remaining() / 1000);
    $("clock").textContent = `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(time % 60).padStart(2, "0")}`;
    $("clock").classList.toggle("low", time <= 180);
    if (!state.outcome && state.startedAt !== null && time <= 0) {
      finish("timeout");
      return;
    }
    const waiting = state.lastFindingAt !== null && Date.now() - state.lastFindingAt >= 5 * 60 * 1000;
    $("hintOffer").hidden = !!state.outcome || !waiting || !order.some((id) => !state.solved.includes(id) && state.hints[id] < hints[id].length);
  }

  document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
  document.querySelectorAll("[data-lane]").forEach((button) => button.addEventListener("click", () => openLane(button.dataset.lane)));
  $("start").addEventListener("click", () => {
    if (state.startedAt === null) {
      state.startedAt = Date.now();
      state.lastFindingAt = state.startedAt;
      save();
    }
    $("briefDialog").close();
    render();
  });
  $("openBrief").addEventListener("click", () => show($("briefDialog")));
  $("hint").addEventListener("click", revealHint);
  $("offerHint").addEventListener("click", () => {
    const next = order.find((id) => !state.solved.includes(id) && state.hints[id] < hints[id].length);
    if (next && playable()) {
      openLane(next);
      revealHint();
    }
  });
  $("openFinale").addEventListener("click", () => {
    if (!playable() || state.solved.length !== 3) return;
    renderFinale();
    show($("finalDialog"));
  });
  ["restart", "again"].forEach((id) => $(id).addEventListener("click", () => show($("restartDialog"))));
  $("confirmRestart").addEventListener("click", () => {
    state = fresh();
    lane = null;
    save();
    $("notice").hidden = true;
    render();
    show($("briefDialog"));
  });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) tick(); });
  save();
  render();
  if (state.startedAt === null && !state.outcome) show($("briefDialog"));
  setInterval(tick, 1000);
})();
