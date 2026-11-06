"use strict";

const STORAGE_KEY = "weakest-link-poc:v2";
const MIN_TO_CONTINUE = 5;
const TIME_LIMIT = 600;
const POINTS = { perSecond: 1, wrong: 25, hint: 100, missed: 100 };

// Later entries are drawn on top, so small items come after the objects they sit on.
const spots = [
  { id: "door", label: "Entrance door", box: [216, 130, 150, 392], risk: true,
    title: "Propped badge door", topic: "Physical access",
    attacker: "Walk in behind the box. No badge needed.",
    why: "One wedge switches off the access control for everyone.",
    act: "Remove the wedge, close the door, report it if it keeps happening." },
  { id: "reader", label: "Badge reader", box: [128, 288, 32, 50],
    note: "The reader works. Look at what's next to it." },
  { id: "courier", label: "Person with a parcel", box: [310, 196, 162, 344], risk: true,
    title: "Unescorted visitor", topic: "Visitors · Social engineering",
    attacker: "A uniform and a parcel get you past most people.",
    why: "Nobody wants to be rude to someone who looks busy.",
    act: "Ask who they're here for and walk them to reception." },
  { id: "server", label: "Server room door", box: [426, 134, 164, 348],
    note: "Closed and badge-controlled. Working as intended." },
  { id: "board", label: "Whiteboard", box: [610, 132, 302, 210], risk: true,
    title: "Secrets on the whiteboard", topic: "Recon · Data classification",
    attacker: "Photograph it from the street: a Wi-Fi password and a project name for a believable pretext.",
    why: "Small public details make a phishing email convincing.",
    act: "Wipe boards after meetings. Never write passwords down." },
  { id: "plant", label: "Plant", box: [848, 206, 160, 304], note: "Just a plant." },
  { id: "window", label: "Window", box: [1008, 30, 134, 444],
    note: "A window is fine. Think about what can be seen through it." },
  { id: "printer", label: "Printer", box: [1164, 318, 92, 118], risk: true,
    title: "Uncollected confidential printout", topic: "Clean desk · Data handling",
    attacker: "Pick it up on the way out.",
    why: "A printout belongs to nobody until someone collects it.",
    act: "Use secure print release and collect it straight away." },
  { id: "colleague", label: "Colleague by the printer", box: [1252, 164, 124, 406],
    note: "Badge visible, heading back to their desk. Nothing to use here." },
  { id: "laptopA", label: "Laptop on the left desk", box: [0, 476, 218, 156], risk: true,
    title: "Unlocked, unattended laptop", topic: "Devices · Session security",
    attacker: "Thirty seconds: send mail as this person or set up forwarding.",
    why: "The session is already signed in. No password needed.",
    act: "Lock the screen (Win + L) every time you stand up." },
  { id: "monitor", label: "Monitor on the centre desk", box: [548, 366, 268, 218],
    note: "Locked screen. Good. Look closer, though." },
  { id: "sticky", label: "Note on the monitor", box: [570, 518, 52, 46], risk: true,
    title: "Password on a sticky note", topic: "Passwords",
    attacker: "Read it now, sign in later from anywhere.",
    why: "The screen is locked, but the key is taped to it.",
    act: "Use a password manager. Change any password that has been written down." },
  { id: "phone", label: "Phone on the centre desk", box: [796, 584, 76, 48], risk: true,
    title: "Unexpected sign-in prompt", topic: "MFA · Incident reporting",
    attacker: "Keep sending prompts until someone taps Approve.",
    why: "Prompt fatigue: people approve just to make it stop.",
    act: "Deny prompts you didn't start and report them. Your password is probably known." },
  { id: "cabinet", label: "Cabinet under the desk", box: [804, 668, 194, 100],
    note: "Locked drawer. That's where sensitive paper belongs." },
  { id: "mug", label: "Coffee mug", box: [230, 550, 66, 64], note: "Just coffee." },
  { id: "laptopC", label: "Laptop on the right desk", box: [1192, 580, 184, 52],
    note: "Lid closed, session locked. Good habit." },
  { id: "usb", label: "Item on the right desk", box: [1138, 596, 96, 40], risk: true,
    title: "Found USB stick", topic: "Removable media · Baiting",
    attacker: "Give it a tempting label and wait for curiosity.",
    why: "\"SALARY 2026\" is hard to ignore.",
    act: "Don't plug it in. Hand it to IT or security." },
];
const risks = spots.filter((s) => s.risk);
const byId = Object.fromEntries(spots.map((s) => [s.id, s]));

const chain = [
  { title: "The courier route",
    story: "A \"courier\" walks in through the propped door. Nobody stops him. He leaves a USB stick marked SALARY 2026 on a desk.",
    options: ["Install extra antivirus on every laptop", "Remove the wedge and challenge unbadged visitors", "Move the salary files to a new folder"],
    answer: 1,
    why: "Stop it at the first step. If he never gets in, there's no USB stick to find." },
  { title: "The whiteboard route",
    story: "Someone outside photographs the whiteboard, joins the guest Wi-Fi, and emails staff about \"urgent ORCA launch changes\".",
    options: ["Wipe the board and keep codenames and passwords out of view", "Block every email that mentions ORCA", "Fit frosted glass to all windows"],
    answer: 0,
    why: "The leak is the board. Blocking words or windows only treats the symptoms." },
  { title: "The prompt route",
    story: "An attacker has the password from the sticky note and keeps sending sign-in prompts to the owner's phone.",
    options: ["Approve once so the prompts stop", "Turn the phone off until tomorrow", "Deny, report it, and change the password"],
    answer: 2,
    why: "Prompts you didn't start mean your password is known. Deny, report, change it." },
];

const fresh = () => ({
  phase: "ready", found: [], cleared: [], wrong: 0, hints: 0,
  step: 0, selected: null, startedAt: null, endedAt: null, timeUp: false,
});
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

const $ = (id) => document.getElementById(id);
const SVG = "http://www.w3.org/2000/svg";

function el(tag, attrs = {}, text) {
  const node = document.createElement(tag);
  Object.assign(node, attrs);
  if (text !== undefined) node.textContent = text;
  return node;
}

function buildHotspots() {
  const layer = $("hotspots");
  for (const spot of spots) {
    const [x, y, w, h] = spot.box;
    const rect = document.createElementNS(SVG, "rect");
    for (const [k, v] of Object.entries({ x, y, width: w, height: h, class: "spot", tabindex: 0, role: "button", "data-id": spot.id, "aria-label": spot.label })) {
      rect.setAttribute(k, v);
    }
    rect.addEventListener("click", () => inspect(spot.id));
    rect.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inspect(spot.id); }
    });
    layer.append(rect);
  }
  $("photo").addEventListener("click", () => inspect(null));
}

// Every wrong click costs points, including repeats and clicks on empty space.
function inspect(id) {
  if (state.phase !== "search") return;
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
    box.append(el("p", { className: "muted" }, "Click anything in the office that an intruder could use."));
    return;
  }
  const spot = byId[state.selected];
  if (!spot || !spot.risk) {
    box.classList.add("ok");
    box.append(
      el("span", { className: "tag" }, "NOT AN OPENING · −" + POINTS.wrong),
      el("h3", {}, spot ? spot.label : "Nothing there"),
      el("p", {}, spot ? spot.note : "Look for something an intruder could actually use."),
    );
    return;
  }
  const dl = el("dl");
  for (const [term, text] of [["ATTACKER", spot.attacker], ["WHY IT WORKS", spot.why], ["WHAT YOU DO", spot.act]]) {
    dl.append(el("dt", {}, term), el("dd", {}, text));
  }
  box.append(el("span", { className: "tag" }, "OPENING · " + spot.topic.toUpperCase()), el("h3", {}, spot.title), dl);
}

function renderSearch() {
  for (const rect of document.querySelectorAll(".spot")) {
    const id = rect.dataset.id;
    rect.classList.toggle("found", state.found.includes(id));
    rect.classList.toggle("cleared", state.cleared.includes(id));
  }
  renderDetail();
  const list = $("list");
  list.replaceChildren(...(state.found.length
    ? state.found.map((id) => el("li", {}, byId[id].title))
    : [el("li", { className: "empty muted" }, "No openings found yet.")]));
  const enough = state.found.length >= MIN_TO_CONTINUE;
  const finish = $("finish");
  finish.disabled = !enough;
  finish.textContent = state.found.length === risks.length ?   "All found. Break the chain →"
      : enough ? "Continue to round 2 →" : `Find at least ${MIN_TO_CONTINUE} to continue`;
  $("hint").disabled = state.found.length === risks.length;
}

function renderChain() {
  const q = chain[state.step];
  $("chainTitle").textContent = `${state.step + 1} / ${chain.length} · ${q.title}`;
  $("chainStory").textContent = q.story;
  $("chainFeedback").textContent = `Which single step stops this best? Wrong answers cost ${POINTS.wrong}.`;
  $("chainNext").hidden = true;
  $("chainOptions").replaceChildren(...q.options.map((text, i) => {
    const b = el("button", { type: "button" }, text);
    b.addEventListener("click", () => answer(i, b));
    return b;
  }));
}

function answer(i, button) {
  const q = chain[state.step];
  if (i !== q.answer) {
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
  next.textContent = state.step + 1 < chain.length ? "Next →" : "See debrief →";
  next.focus();
  save();
  renderStats();
}

function finishGame(timeUp) {
  state.phase = "done";
  state.timeUp = timeUp;
  state.endedAt = timeUp ? state.startedAt + TIME_LIMIT * 1000 : Date.now();
  save();
  render();
}

function nextChain() {
  state.step += 1;
  if (state.step >= chain.length) return finishGame(false);
  save();
  render();
}

function renderDebrief() {
  $("debriefTitle").textContent = state.timeUp ? "TIME'S UP" : "DEBRIEF";
  $("finalScore").textContent = score();
  const b = breakdown();
  const rows = [
    ["Time left", state.timeUp ? "0:00" : clock(secondsLeft()), b.time],
    ["Wrong clicks", `${state.wrong} × −${POINTS.wrong}`, b.wrong],
    ["Hints", `${state.hints} × −${POINTS.hint}`, b.hints],
    ["Openings missed", `${risks.length - state.found.length} × −${POINTS.missed}`, b.missed],
  ];
  $("breakdown").replaceChildren(...rows.map(([label, detail, pts]) => {
    const tr = el("tr");
    tr.append(el("td", {}, label), el("td", { className: "muted" }, detail), el("td", {}, (pts > 0 ? "+" : "") + pts));
    return tr;
  }));
  $("foundList").replaceChildren(...state.found.map((id) => {
    const li = el("li", {}, byId[id].title + " ");
    li.append(el("small", {}, "· " + byId[id].topic));
    return li;
  }));
  const missed = risks.filter((r) => !state.found.includes(r.id));
  $("missedHead").hidden = !missed.length;
  $("missedList").replaceChildren(...missed.map((r) => {
    const li = el("li", {}, r.title + " ");
    li.append(el("small", {}, "· " + r.act));
    return li;
  }));
}

function clock(sec) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
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

function hint() {
  const left = risks.filter((r) => !state.found.includes(r.id));
  if (!left.length) return;
  const target = left[Math.floor(Math.random() * left.length)];
  state.hints += 1;
  save();
  renderStats();
  const rect = document.querySelector(`.spot[data-id="${target.id}"]`);
  rect.classList.remove("hinted");
  void rect.getBBox();
  rect.classList.add("hinted");
  setTimeout(() => rect.classList.remove("hinted"), 4000);
}

function restart() {
  state = fresh();
  save();
  render();
  window.scrollTo(0, 0);
}

buildHotspots();
$("startBtn").addEventListener("click", () => {
  state.phase = "search";
  state.startedAt = Date.now();
  save();
  render();
});
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
