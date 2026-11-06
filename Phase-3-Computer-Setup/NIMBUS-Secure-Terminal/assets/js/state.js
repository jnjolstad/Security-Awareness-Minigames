/* ============================================================
   NIMBUS Secure Terminal — state engine & shared helpers
   Robust for file:// (no server needed). Progress lives in
   sessionStorage so closing/relaunching the browser = clean reset.
   ============================================================ */
(function (global) {
  var MEM = {};                                   // in-memory fallback
  var REMOTE = null;
  var REMOTE_RESET_REVISION = null;
  var REMOTE_ENABLED = global.location.protocol === "http:" || global.location.protocol === "https:";
  function storage() { try { return global.sessionStorage; } catch (e) { return null; } }
  function clearLocal() {
    var s = storage(); try { if (s) s.clear(); } catch (e) {}
    for (var k in MEM) delete MEM[k];
  }
  function remoteAction(action, value) {
    if (!REMOTE_ENABLED || !global.fetch) return;
    global.fetch("api/room/action", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: action, value: value || 0 })
    }).then(function (response) {
      if (response.ok) return response.json();
      throw new Error("Room command failed");
    }).then(function (state) {
      REMOTE = state;
    }).catch(function () {});
  }
  function pollRemote() {
    if (!REMOTE_ENABLED || !global.fetch) return;
    global.fetch("api/room/state", { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) throw new Error("Room state unavailable");
        return response.json();
      })
      .then(function (state) {
        REMOTE = state;
        if (REMOTE_RESET_REVISION === null) {
          REMOTE_RESET_REVISION = state.resetRevision;
        } else if (state.resetRevision !== REMOTE_RESET_REVISION) {
          REMOTE_RESET_REVISION = state.resetRevision;
          clearLocal();
          if (global.location.pathname.split(/[\\\/]/).pop().toLowerCase() !== "index.html") {
            global.location.replace("index.html");
          }
        }
      }).catch(function () {});
  }

  var NST = {
    /* ---- key/value ---- */
    get: function (k) { var s = storage(); try { return s ? s.getItem(k) : (MEM[k] || null); } catch (e) { return MEM[k] || null; } },
    set: function (k, v) { var s = storage(); try { if (s) s.setItem(k, v); else MEM[k] = v; } catch (e) { MEM[k] = v; } },
    /* ---- progress flags ---- */
    has: function (step) { return NST.get("step_" + step) === "1"; },
    mark: function (step) { NST.set("step_" + step, "1"); },
    reset: function () { clearLocal(); remoteAction("reset"); },

    /* ---- gate: redirect if prerequisite step missing ---- */
    require: function (step, redirect) {
      if (!NST.has(step)) { global.location.replace(redirect || "login.html"); return false; }
      return true;
    },
    requireAll: function (steps, redirect) {
      var ok = steps.every(function (step) { return NST.has(step); });
      if (!ok) { global.location.replace(redirect || "login.html"); return false; }
      return true;
    },

    /* ---- countdown ---- */
    timerStarted: function () { return REMOTE ? REMOTE.mode !== "ready" : !!NST.get("tEnd"); },
    startTimer: function () {
      if (REMOTE_ENABLED) remoteAction("start");
      if (REMOTE) {
        REMOTE.mode = "running";
        REMOTE.remaining = REMOTE.duration;
        REMOTE.end = Date.now() + REMOTE.duration;
      }
      var end = NST.get("tEnd");
      if (!end) {
        end = Date.now() + (NIMBUS_CONFIG.durationMinutes * 60000);
        NST.set("tEnd", String(end));
      }
      return parseInt(end, 10);
    },
    timerEnd: function () {
      var end = NST.get("tEnd");
      return end ? parseInt(end, 10) : null;
    },
    remaining: function () {
      if (REMOTE) {
        return REMOTE.mode === "running"
          ? Math.max(0, REMOTE.end - Date.now())
          : Math.max(0, REMOTE.remaining);
      }
      var end = NST.timerEnd();
      return end ? Math.max(0, end - Date.now()) : (NIMBUS_CONFIG.durationMinutes * 60000);
    },
    ensureTimer: function () {
      if (!NST.timerStarted() || NST.remaining() <= 0) {
        NST.set("tEnd", String(Date.now() + (NIMBUS_CONFIG.durationMinutes * 60000)));
      }
      return NST.timerEnd();
    },
    addTime: function (milliseconds) {
      if (REMOTE) {
        remoteAction("adjust", milliseconds);
        REMOTE.remaining = Math.max(0, NST.remaining() + milliseconds);
        if (REMOTE.mode === "running") REMOTE.end = Date.now() + REMOTE.remaining;
      }
      NST.set("tEnd", String(Date.now() + NST.remaining() + milliseconds));
      return NST.timerEnd();
    },
    fmt: function (ms) {
      var t = Math.floor(ms / 1000), m = Math.floor(t / 60), s = t % 60;
      return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
    },
    bindClock: function (elId) {
      var el = document.getElementById(elId); if (!el) return;
      function tick() {
        var r = NST.remaining(); el.textContent = NST.fmt(r);
        el.classList.toggle("low", r <= 5 * 60000);
        if (r <= 0) el.textContent = "00:00";
      }
      tick(); setInterval(tick, 1000);
    },

    enforceTimeout: function () {
      var page = global.location.pathname.split(/[\\\/]/).pop().toLowerCase();
      var exempt = page === "fail.html" || page === "win.html" || page === "timer.html";
      if (!exempt && !NST.get("winTime") && NST.timerStarted() && NST.remaining() <= 0) {
        global.location.replace("fail.html");
        return true;
      }
      return false;
    },

    /* ---- normalize answers ---- */
    norm: function (s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]/g, ""); },

    /* ---- ui helpers ---- */
    toast: function (msg) {
      var t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
      document.body.appendChild(t); requestAnimationFrame(function () { t.classList.add("show"); });
      setTimeout(function () { t.classList.remove("show"); setTimeout(function () { t.remove(); }, 300); }, 2600);
    },
    show: function (id, type, html) {
      var el = document.getElementById(id); if (!el) return;
      el.className = "msg show " + (type || "info"); el.innerHTML = html;
    },
    esc: function (s) { return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  };

  /* ---- host hotkeys ----
     Ctrl+Alt+R  = reset room (clear progress -> index)
     Ctrl+Alt+S  = host SKIP: unlock all steps (testing only)         */
  global.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.altKey && (e.key === "r" || e.key === "R")) {
      e.preventDefault(); NST.reset(); global.location.href = "index.html";
    }
    if (e.ctrlKey && e.altKey && (e.key === "s" || e.key === "S")) {
      e.preventDefault();
      NST.ensureTimer();
      ["login", "mfa", "phish", "usb", "rogue", "accuse", "assistant"].forEach(NST.mark);
      global.location.href = "killswitch.html";
    }
  });

  global.NST = NST;
  pollRemote();
  global.setInterval(pollRemote, 500);
  NST.enforceTimeout();
  global.setInterval(NST.enforceTimeout, 250);
})(window);
