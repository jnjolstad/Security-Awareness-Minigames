"use strict";

const html = `
<div class="dt">
  <div class="icons">
    <div class="icon" data-spot="recycle"><span class="ic bin">🗑</span>Recycle Bin</div>
    <div class="icon" data-spot="passwordsTxt"><span class="ic txt">≡</span>passwords.txt</div>
    <div class="icon" data-free><span class="ic folder">📁</span>Projects</div>
    <div class="icon" data-free><span class="ic folder">📁</span>Customer files</div>
  </div>

  <section class="win browser">
    <div class="titlebar"><span class="tab">✦ ChatBuddy AI – free</span><span class="ctl">— ▢ ✕</span></div>
    <div class="urlbar"><span>🔒 chatbuddy-ai.app/chat</span></div>
    <div class="chat">
      <div class="msg bot">Hi! I'm ChatBuddy, a free AI assistant. Paste anything and I'll help.</div>
      <div class="msg me" data-spot="aiPaste">Summarise these customers and who is late paying:<br>
        <code>Anna Hansen · 0102 8834 551 · anna.h@mail.no · owes 42 300 kr<br>
        Ole Berg · 1507 7912 304 · ole@bergbygg.no · owes 118 900 kr<br>
        Lise Moe · 2209 9145 762 · lise.moe@gmail.com · owes 9 750 kr</code></div>
      <div class="msg bot">Sure! Here is a summary of the three customers…</div>
    </div>
    <div class="popup" data-spot="fakeUpdate">
      <b>⚠ Critical browser update</b>
      <p>Your browser is out of date and may be unsafe. Install the update to keep browsing.</p>
      <span class="btn primary">Download update.exe</span>
    </div>
  </section>

  <section class="win consent" data-spot="consent">
    <div class="titlebar"><span>Microsoft · Permissions requested</span><span class="ctl">✕</span></div>
    <div class="inner">
      <div class="app"><span class="logo">PDF</span><div><b>PDF Converter Pro</b><small>unverified publisher</small></div></div>
      <p>This app would like to:</p>
      <ul><li>Read and write all files you can access</li><li>Read, send and delete your mail</li><li>Maintain access to data you have given it access to</li></ul>
      <div class="btns"><span class="btn">Cancel</span><span class="btn primary">Accept</span></div>
    </div>
  </section>

  <section class="win props">
    <div class="titlebar"><span>Customer files – Properties</span><span class="ctl">✕</span></div>
    <div class="inner">
      <div class="tabs"><span>General</span><span class="on">Sharing</span><span>Security</span></div>
      <div class="perm head"><span>Name</span><span>Permission</span></div>
      <div class="perm" data-spot="shareEveryone"><span>👥 Everyone</span><span>Read / Write</span></div>
      <div class="perm"><span>👤 You</span><span>Owner</span></div>
    </div>
  </section>

  <section class="toast teams" data-spot="remoteSession">
    <div class="th"><span class="tlogo">T</span> Microsoft Teams</div>
    <b>IT Support <em>(External)</em></b>
    <p>Hi! We're seeing errors on your mailbox. Please accept the remote session so I can fix it quickly 🙂</p>
    <span class="btn primary">Accept remote control</span>
  </section>

  <section class="toast autoplay" data-spot="autoplay">
    <div class="th">💽 USB Drive (E:)</div>
    <p>Choose what to do with removable drives.</p>
    <div class="ap-row"><span class="ap-ic">▶</span><div><b>Run Salary_2026.exe</b><small>Published by: not specified</small></div></div>
  </section>

  <footer class="taskbar">
    <span class="tb winbtn">⊞</span>
    <span class="tb tbsearch">Search</span>
    <span class="tb" data-free>📁</span>
    <span class="tb teamsico" data-spot="teamsIcon">T</span>
    <span class="tray">
      <span class="upd" data-spot="updatesPaused">⟳ Updates paused · 35 days</span>
      <span class="tri" data-spot="onedrive">☁✓</span>
      <span class="tri shield" data-spot="defender">🛡✓</span>
      <span class="clock" data-spot="clock">14:32<br>Tue 06/10</span>
    </span>
  </footer>
</div>`;

window.GAME = {
  id: "desktop",
  title: "Desktop",
  eyebrow: "NORTHWIND STUDIO · A COLLEAGUE'S SCREEN · 14:32",
  headline: ["One busy afternoon.", "How many doors are open?"],
  intro: "{n} things on this desktop would let an attacker in or let data out. Click what you'd use. Your score is the time you have left, minus wrong clicks, hints and missed openings.",
  prompt: "Click anything on the screen an attacker could use.",
  habits: [
    "Update through Windows Update and the company portal, never through a pop-up.",
    "Don't paste customer or company data into tools the company hasn't approved.",
    "Read permission requests. If an app wants everything, say no and ask IT.",
  ],
  scene: { type: "html", width: 1100, height: 660, html },
  shuffle(stage, order) {
    const icons = stage.querySelector(".icons");
    order("icons", icons.children.length).map((i) => icons.children[i]).forEach((n) => icons.append(n));
    if (order("windows", 2)[0] === 1) {
      stage.querySelector(".props").style.top = "16px";
      stage.querySelector(".consent").style.top = "200px";
    }
  },
  spots: [
    { id: "fakeUpdate", label: "Browser update pop-up", risk: true,
      title: "Fake browser update", topic: "Malware · Drive-by download",
      attacker: "A website shows a scary pop-up. The \"update\" is my malware.",
      why: "Real browsers update themselves. They never ask you to download an .exe from a page.",
      act: "Close the tab. Update only through the browser's own settings or IT." },
    { id: "aiPaste", label: "Message in the AI chat", risk: true,
      title: "Customer data pasted into a public AI tool", topic: "Data leakage · AI",
      attacker: "No attack needed. The data has left the company and may be stored or used for training.",
      why: "Free tools often keep what you type. Personal data needs a legal basis and approved processors.",
      act: "Use the company-approved AI tool, and remove personal data first." },
    { id: "consent", label: "App permission request", risk: true,
      title: "Broad consent to an unverified app", topic: "OAuth consent phishing",
      attacker: "Get one click on Accept. Now my app reads your mail and files, with no password needed.",
      why: "App consent survives a password change. It looks like a normal Microsoft dialog.",
      act: "Cancel requests from unverified apps, and report them to IT." },
    { id: "shareEveryone", label: "Everyone has Read / Write", risk: true,
      title: "Folder shared with Everyone", topic: "Access control",
      attacker: "Any account on the network, including one I've compromised, can read and change customer files.",
      why: "\"Everyone\" is rarely what anyone means.",
      act: "Share with named people or groups, with the least access needed." },
    { id: "autoplay", label: "USB AutoPlay prompt", risk: true,
      title: "Run a program from a found USB drive", topic: "Removable media · Baiting",
      attacker: "Leave a drive with a tempting file. Curiosity does the rest.",
      why: "An .exe called \"Salary\" is bait, not a spreadsheet.",
      act: "Don't run it. Remove the drive and hand it to IT." },
    { id: "passwordsTxt", label: "passwords.txt", risk: true,
      title: "Passwords in a text file", topic: "Passwords",
      attacker: "Malware searches for files called passwords. This one is on the desktop.",
      why: "Plain text is readable by anything running as you.",
      act: "Move them to a password manager, then delete the file and change the passwords." },
    { id: "remoteSession", label: "Teams message from IT Support", risk: true,
      title: "External \"IT Support\" asking for remote control", topic: "Vishing · Help desk impersonation",
      attacker: "Message from an outside tenant, named IT Support. Once I have control, I install what I like.",
      why: "The (External) label is the giveaway. Real IT uses the ticket system and is internal.",
      act: "Don't accept. Block the sender and report it to IT through the usual channel." },
    { id: "updatesPaused", label: "Updates paused", risk: true,
      title: "Security updates paused for 35 days", topic: "Patching",
      attacker: "Use a known, already-patched vulnerability. This machine is still open to it.",
      why: "Attackers start using new flaws within days of the fix being published.",
      act: "Resume updates and restart when asked." },
    { id: "recycle", label: "Recycle Bin", note: "Just the Recycle Bin." },
    { id: "teamsIcon", label: "Teams in the taskbar", note: "Teams itself is fine. Look at who's messaging." },
    { id: "onedrive", label: "OneDrive status", note: "Synced to the company OneDrive. Good." },
    { id: "defender", label: "Windows Security", note: "Protection is on. It can't stop everything you allow, though." },
    { id: "clock", label: "Clock", note: "Just the time." },
  ],
  chain: [
    { title: "The update route",
      story: "A news site shows \"Critical browser update\". The download installs an info-stealer that copies saved passwords and session cookies.",
      options: ["Close the tab and update only through the browser itself", "Run an antivirus scan after installing it", "Only install updates on Fridays"],
      answer: 0,
      why: "Real updates never come from a pop-up on a web page." },
    { title: "The consent route",
      story: "A user clicks Accept for PDF Converter Pro, a cloud app nobody has checked. It now has its own access to their mail. IT resets their password, but the attacker keeps reading the mailbox.",
      options: ["Reset the password again", "Revoke the app's consent and report it. Cancel unverified apps next time", "Turn on a longer password policy"],
      answer: 1,
      why: "The app has its own token. Changing the password doesn't remove it. Revoking consent does." },
    { title: "The help desk route",
      story: "\"IT Support (External)\" messages on Teams and asks for remote control to \"fix the mailbox\".",
      options: ["Accept, but watch what they do", "Ask them to prove they're IT by naming your manager", "Decline, and contact IT through the service desk you already know"],
      answer: 2,
      why: "Contact IT through a channel you already know. The attacker may know your manager's name." },
  ],
};
