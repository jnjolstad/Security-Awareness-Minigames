"use strict";

const html = `
<div class="rf">
  <section class="br" id="pageA">
    <div class="br-top"><span class="dots">● ● ●</span><span class="label">Window A</span></div>
    <div class="br-url"><span class="pad" data-spot="realPadlock">🔒</span><span data-spot="realUrl">https://login.northwind.com/</span></div>
    <div class="page">
      <div class="rf-card">
        <div class="rf-brand" data-spot="realLogo"><span class="nw">N</span> Northwind</div>
        <p class="who">you@northwind.com</p>
        <h2>Approve sign-in request</h2>
        <div class="push" data-spot="realPush">
          <span class="phone">📱</span>
          <p>Open your Authenticator app and enter the number shown to sign in.</p>
          <div class="num">42</div>
        </div>
        <p class="rf-small"><span class="lnk" data-spot="realHelp">I can't use my Authenticator app right now</span></p>
      </div>
    </div>
  </section>
  <section class="br" id="pageB">
    <div class="br-top"><span class="dots">● ● ●</span><span class="label">Window B</span></div>
    <div class="br-url"><span class="pad" data-spot="fakePadlock">🔒</span><span data-spot="fakeDomain">https://login.northwind.com.secure-auth.io/</span></div>
    <div class="notif" data-spot="notifications"><b>secure-auth.io wants to</b><br>🔔 Show notifications<div><span class="b">Block</span><span class="b pri">Allow</span></div></div>
    <div class="page">
      <div class="rf-card">
        <div class="rf-brand" data-spot="fakeLogo"><span class="nw">N</span> Northwind</div>
        <h2>Verify your account</h2>
        <div class="fields" data-spot="allInOne">
          <label>Email</label><div class="in">you@northwind.com</div>
          <label>Password</label><div class="in">••••••••••</div>
          <label>Authenticator code</label><div class="in ph">6-digit code</div>
        </div>
        <div class="fields" data-spot="card"><label>Last 4 digits of your bank card (identity check)</label><div class="in ph">••••</div></div>
        <div class="timer" data-spot="countdown">⏱ Session expires in <b>02:59</b></div>
        <span class="go">Sign in</span>
        <p class="rf-small" data-spot="supportPhone">Problems? Call Northwind support: <b>+44 20 3966 1180</b></p>
      </div>
    </div>
  </section>
</div>`;

window.GAME = {
  id: "real-or-fake",
  title: "Real or fake",
  eyebrow: "TWO SIGN-IN PAGES · ONE IS A TRAP",
  headline: ["Two sign-in pages.", "Which details give the fake away?"],
  intro: "One of these windows is a phishing page. {n} details prove it. Click the details that give it away. Clicking the genuine page costs points too.",
  prompt: "Click the details that prove a page is fake.",
  habits: [
    "Read the domain from the right: the last part before the first / decides who owns it.",
    "A padlock only means the connection is encrypted, not that the site is honest.",
    "Use passkeys or a security key. They don't work on fake pages.",
  ],
  scene: { type: "html", width: 1100, height: 660, html },
  // The fake page lands left or right per run. The left window is always "Window A",
  // so every A/B reference in labels and stories is swapped along with it.
  shuffle(stage, order) {
    const swap = order("windows", 2)[0] === 1;
    const flip = (s) => s.replace(/\b([Ww]indow) ([AB])\b/g, (_, w, l) => `${w} ${l === "A" ? "B" : "A"}`);
    for (const item of [...this.spots, ...this.chain]) {
      const key = "label" in item ? "label" : "story";
      item.orig ??= item[key];
      item[key] = swap ? flip(item.orig) : item.orig;
    }
    if (!swap) return;
    const a = stage.querySelector("#pageA"), b = stage.querySelector("#pageB");
    a.querySelector(".label").textContent = "Window B";
    b.querySelector(".label").textContent = "Window A";
    a.before(b);
  },
  spots: [
    { id: "fakeDomain", label: "Address of window B", risk: true,
      title: "login.northwind.com.secure-auth.io", topic: "Phishing · Domains",
      attacker: "Buy secure-auth.io and put the real company name in front as a subdomain.",
      why: "The owner is the part right before the first slash: secure-auth.io.",
      act: "Read the domain from the right. Better still, use a bookmark." },
    { id: "allInOne", label: "Email, password and code on one screen", risk: true,
      title: "Password and MFA code asked together", topic: "MFA relay · Adversary in the middle",
      attacker: "Relay the password and code to the real site in real time. I'm in, with MFA.",
      why: "Real Northwind sign-in asks step by step and uses number matching.",
      act: "Never type a code into a page you reached from a link. Passkeys stop relays." },
    { id: "countdown", label: "Session countdown", risk: true,
      title: "Countdown timer", topic: "Social engineering · Urgency",
      attacker: "Time pressure stops you reading the address bar.",
      why: "Urgency is the most common manipulation trick.",
      act: "Slow down when a page rushes you." },
    { id: "supportPhone", label: "Support phone number", risk: true,
      title: "Phone number on the page", topic: "Callback phishing",
      attacker: "If you're unsure, you'll call me. Then I talk you through it.",
      why: "Attackers put their own number where help should be.",
      act: "Use the IT number from the intranet or your badge, not from the page." },
    { id: "card", label: "Bank card field", risk: true,
      title: "Bank card digits as an \"identity check\"", topic: "Phishing · Over-collection",
      attacker: "Collect extra details for fraud and for convincing calls later.",
      why: "Your employer never needs your bank card to sign you in.",
      act: "If a work login asks for payment details, close it and report it." },
    { id: "notifications", label: "Notification request", risk: true,
      title: "\"Allow notifications\" from the phishing site", topic: "Browser abuse",
      attacker: "If you click Allow, I can show you fake alerts later, even after you close the page.",
      why: "Notifications look like system messages.",
      act: "Block. Remove site permissions you didn't mean to give." },
    { id: "fakePadlock", label: "Padlock in window B", note: "Padlocks don't prove legitimacy. Phishing sites have them too." },
    { id: "fakeLogo", label: "Logo in window B", note: "Logos are easy to copy. They prove nothing either way." },
    { id: "realPadlock", label: "Padlock in window A", note: "Encrypted connection. Fine, but look at the domain." },
    { id: "realUrl", label: "Address of window A", note: "login.northwind.com is the real domain." },
    { id: "realLogo", label: "Logo in window A", note: "The real logo. Logos don't decide anything." },
    { id: "realPush", label: "Number matching", note: "Number matching is how real Northwind sign-in works." },
    { id: "realHelp", label: "Help link in window A", note: "A normal help option on the real page." },
  ],
  chain: [
    { title: "The relay route",
      story: "A user types password and authenticator code into window B. Two seconds later the attacker signs in to the real portal with them.",
      options: ["Use passkeys or a security key, which only work on the real domain", "Use a longer password", "Type the code more slowly"],
      answer: 0,
      why: "Passkeys are tied to the real domain, so a fake page gets nothing it can use." },
    { title: "The link route",
      story: "An email says \"Sign in to read a secure message\". The link opens window B.",
      options: ["Check that the page has a padlock", "Type the address yourself or use your bookmark", "Click the link from your phone instead"],
      answer: 1,
      why: "If you don't follow the link, the fake page never loads." },
    { title: "The phone route",
      story: "Unsure, the user calls the support number on window B. A friendly \"agent\" asks for the code that just arrived.",
      options: ["Read the code, the agent sounds professional", "Ask the agent for their employee ID", "Hang up and call IT on the number from the intranet"],
      answer: 2,
      why: "Use a number you found yourself. Never one the page gave you." },
  ],
};
