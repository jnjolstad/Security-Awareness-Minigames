"use strict";

const mails = [
  { id: 1, from: "IT Support", time: "08:12", subject: "Your password expires today", preview: "Action required: keep your account active", unread: true },
  { id: 2, from: "Ledgerline Accounts", time: "08:40", subject: "Invoice 4471 – overdue", preview: "Please find the invoice attached", unread: true },
  { id: 3, from: "Mara Lind", time: "09:05", subject: "Quick favour", preview: "Are you at your desk? I need something done", unread: true },
  { id: 4, from: "Northwind IT", time: "09:31", subject: "New MFA setup required", preview: "Scan the code in the attached guide", unread: true },
  { id: 5, from: "Ledgerline Accounts", time: "10:02", subject: "Updated bank details", preview: "Our bank details have changed from today", unread: false },
  { id: 6, from: "Voice Services", time: "10:15", subject: "Voicemail (0:42) from +47 9xx", preview: "You have a new voicemail", unread: false },
  { id: 7, from: "Sofie Dahl", time: "11:20", subject: "Team lunch Friday?", preview: "Thinking the new noodle place at 12", unread: false },
  { id: 8, from: "Northwind Security", time: "11:45", subject: "Security Awareness Month starts", preview: "Mini-games, a quiz and a prize draw", unread: false },
];

const list = mails.map((m) => `
  <li class="item${m.unread ? " unread" : ""}" data-free data-open="${m.id}">
    <div class="row"><b>${m.from}</b><span>${m.time}</span></div>
    <div class="subj">${m.subject}</div>
    <div class="prev">${m.preview}</div>
  </li>`).join("");

const head = (subject, name, addr, spot, extra = "") => `
  <h2>${subject}</h2>
  <div class="from">
    <span class="avatar">${name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
    <div><b>${name}</b> <span class="addr" ${spot}>&lt;${addr}&gt;</span><div class="to">To: you@northwind.com${extra}</div></div>
  </div>`;

const html = `
<div class="ol">
  <header class="ol-top"><span class="waffle">⋮⋮⋮</span> <b>Outlook</b><span class="search-box">Search</span><span class="me">YO</span></header>
  <nav class="ol-nav" data-free>
    <div class="nav-new">New mail</div>
    <div class="nav-item active">Inbox <span>4</span></div>
    <div class="nav-item">Sent items</div>
    <div class="nav-item">Drafts</div>
    <div class="nav-item">Archive</div>
    <div class="nav-item">Junk email</div>
  </nav>
  <ul class="ol-list">${list}</ul>
  <section class="ol-read">
    <article class="mail" data-mail="1">
      ${head("Your password expires today", "IT Support", "it-support@northwind-studlo.com", 'data-spot="lookalike"')}
      <div class="body">
        <p>Dear user,</p>
        <p>Your Northwind password expires <b>today at 17:00</b>. To keep access to email and files, confirm your password now.</p>
        <p><span class="link" data-spot="link" data-href="https://northwind-sso.login-verify.co/reset?u=you">https://portal.northwind.com/reset</span></p>
        <p>Thank you,<br>IT Support</p>
      </div>
    </article>
    <article class="mail" data-mail="2" hidden>
      ${head("Invoice 4471 – overdue", "Ledgerline Accounts", "accounts@ledgerline.io", 'data-spot="ledgerSender"')}
      <div class="attach" data-spot="zip"><span class="ficon zipf">ZIP</span><div><b>Invoice_4471.zip</b><small>214 KB</small></div></div>
      <div class="body">
        <p>Hi,</p>
        <p>Invoice 4471 is now 14 days overdue. The invoice is attached as a zip because of its size. Please open it and confirm payment today.</p>
        <p>Kind regards,<br>Ledgerline Accounts Receivable</p>
      </div>
    </article>
    <article class="mail" data-mail="3" hidden>
      ${head("Quick favour", "Mara Lind", "mara.lind.ceo@gmail.com", 'data-spot="ceoSender"')}
      <div class="body">
        <p>Hi,</p>
        <p data-spot="giftcards" class="block">Are you at your desk? I'm stuck in meetings all day. I need you to buy 6 Apple gift cards of 500 kr each for a client thank-you. Scratch them and send me photos of the codes within the hour. Please keep this between us, it's a surprise.</p>
        <p>Mara<br><small>Sent from my iPhone</small></p>
      </div>
    </article>
    <article class="mail" data-mail="4" hidden>
      <div class="external">⚠ This message came from outside your organisation.</div>
      ${head("New MFA setup required", "Northwind IT", "northwind.it@helpdesk-mail.net", 'data-spot="externalIt"')}
      <div class="attach"><span class="ficon pdf">PDF</span><div><b>MFA_setup_guide.pdf</b><small>88 KB</small></div></div>
      <div class="body">
        <p>All staff must re-register multi-factor authentication by Friday. Scan the code below with your phone camera to start.</p>
        <div class="qr" data-spot="qr"><div class="qr-grid"></div><small>Scan with your phone</small></div>
      </div>
    </article>
    <article class="mail" data-mail="5" hidden>
      ${head("Updated bank details", "Ledgerline Accounts", "accounts@ledgerline-io.com", 'data-spot="bankSender"')}
      <div class="body">
        <p>Hello,</p>
        <p>Following our move to a new bank, please update our payment details before paying invoice 4471.</p>
        <div class="bank" data-spot="bank"><b>New account</b><br>IBAN: GB29 LOYD 3096 1700 4422 19<br>Account name: Ledgerline Ltd<br>Valid from today. Old account is closed.</div>
        <p>Thank you for updating your records promptly.<br>Accounts</p>
      </div>
    </article>
    <article class="mail" data-mail="6" hidden>
      ${head("Voicemail (0:42) from +47 9xx", "Voice Services", "noreply@voice-services.cloud", "")}
      <div class="attach" data-spot="voicemail"><span class="ficon htm">HTM</span><div><b>Play_voicemail_0-42.htm</b><small>3 KB</small></div></div>
      <div class="body">
        <p>You have received a new voicemail.</p>
        <p>Duration: 0:42<br>Open the attachment to listen.</p>
      </div>
    </article>
    <article class="mail" data-mail="7" hidden>
      ${head("Team lunch Friday?", "Sofie Dahl", "sofie.dahl@northwind.com", 'data-spot="lunchSender"')}
      <div class="body">
        <p>Hi all,</p>
        <p data-spot="lunchText" class="block">Thinking the new noodle place on Torggata at 12 on Friday. Reply if you're in and I'll book a table for us.</p>
        <p>Sofie</p>
      </div>
    </article>
    <article class="mail" data-mail="8" hidden>
      ${head("Security Awareness Month starts", "Northwind Security", "security@northwind.com", 'data-spot="secSender"')}
      <div class="body">
        <p>Hi everyone,</p>
        <p>This month we have mini-games, a short quiz and a prize draw. Details are on the intranet: <span class="link" data-spot="intranet" data-href="https://intranet.northwind.com/security">intranet.northwind.com/security</span></p>
        <p>See something suspicious? Use the <span class="report" data-spot="reportBtn">⚑ Report phishing</span> button in Outlook.</p>
        <p>The Security team</p>
      </div>
    </article>
  </section>
  <footer class="status" id="status"></footer>
</div>`;

function show(stage, id) {
  for (const m of stage.querySelectorAll(".mail")) m.hidden = m.dataset.mail !== String(id);
  for (const li of stage.querySelectorAll(".item")) {
    const on = li.dataset.open === String(id);
    li.classList.toggle("active", on);
    if (on) li.classList.remove("unread");
  }
}

window.GAME = {
  id: "inbox",
  title: "Inbox",
  eyebrow: "NORTHWIND STUDIO · MONDAY MORNING INBOX",
  headline: ["Eight new emails.", "Which ones are the trap?"],
  intro: "{n} details in this inbox are signs of phishing or fraud. Open emails for free, then click the details an attacker is counting on you to miss. Hover over links to see where they really go.",
  prompt: "Open an email from the list. Click the details that give the attack away.",
  habits: [
    "Check the real sender address and hover before you click.",
    "Unusual requests about money, codes or secrecy: verify on a channel you already know.",
    "Use the Report phishing button. It protects your colleagues too.",
  ],
  scene: { type: "html", width: 1100, height: 660, html },
  setup(stage) {
    if (!stage.dataset.wired) {
      stage.dataset.wired = "1";
      stage.addEventListener("click", (e) => {
        const li = e.target.closest(".ol-list [data-open]");
        if (li) show(stage, li.dataset.open);
      });
      stage.addEventListener("mouseover", (e) => {
        const status = stage.querySelector("#status");
        const link = e.target.closest("[data-href]");
        status.textContent = link ? link.dataset.href : "";
        status.classList.toggle("on", !!link);
      });
    }
    show(stage, stage.querySelector(".ol-list [data-open]").dataset.open);
  },
  // New order each run; the times stay in sequence so the list still looks like a real inbox.
  shuffle(stage, order) {
    const ul = stage.querySelector(".ol-list");
    const items = [...ul.children];
    const times = items.map((li) => li.querySelector(".row span").textContent);
    const sorted = order("inbox", items.length).map((i) => items[i]);
    sorted.forEach((li, pos) => {
      li.querySelector(".row span").textContent = times[pos];
      li.classList.toggle("unread", pos < 4);
      ul.append(li);
    });
  },
  reveal(id) {
    const stage = document.getElementById("stage");
    const mail = stage.querySelector(`[data-spot="${id}"]`).closest(".mail");
    if (mail) show(stage, mail.dataset.mail);
  },
  spots: [
    { id: "lookalike", label: "Sender address of the password email", risk: true,
      title: "Lookalike domain: northwind-studlo.com", topic: "Phishing · Sender spoofing",
      attacker: "Register a domain one letter off and send as \"IT Support\".",
      why: "We read the display name and skim the address. \"studlo\" passes as \"studio\".",
      act: "Read the full address, letter by letter, before you trust it." },
    { id: "link", label: "Reset link", risk: true,
      title: "Link text doesn't match the destination", topic: "Phishing · Links",
      attacker: "Show a trusted address as text and point it at my fake login page.",
      why: "The text of a link can say anything. Only the real target matters.",
      act: "Hover first. Better still, go to the portal through your bookmark." },
    { id: "zip", label: "Invoice attachment", risk: true,
      title: "Zipped \"invoice\"", topic: "Malware · Attachments",
      attacker: "Zip the payload so the mail filter can't look inside.",
      why: "Invoices are routine, and urgency stops people thinking.",
      act: "Don't open unexpected archives. Check with finance or report it." },
    { id: "ceoSender", label: "CEO's sender address", risk: true,
      title: "CEO writing from Gmail", topic: "CEO fraud · Impersonation",
      attacker: "Make a free mail account in the CEO's name.",
      why: "Leaders rarely use private addresses for work requests.",
      act: "Check the address. Verify on Teams or by phone, using a number you already have." },
    { id: "giftcards", label: "Gift card request", risk: true,
      title: "Gift cards, urgency and secrecy", topic: "CEO fraud · Social engineering",
      attacker: "Gift cards are cash that can't be traced or reversed.",
      why: "Authority + urgency + \"keep it between us\" stops people checking.",
      act: "Never buy gift cards on email instructions. Call the person on a known number." },
    { id: "externalIt", label: "\"Northwind IT\" sender", risk: true,
      title: "Internal name, external sender", topic: "Phishing · Sender spoofing",
      attacker: "Call myself Northwind IT. Most people won't read the banner.",
      why: "Display names are free text. The External banner tells the truth.",
      act: "If IT is \"external\", it isn't IT. Report it." },
    { id: "qr", label: "QR code", risk: true,
      title: "QR code phishing", topic: "Quishing · Mobile",
      attacker: "Move the victim to their phone, away from company link scanning.",
      why: "A QR code hides the link, and phones show less of the address.",
      act: "Don't scan QR codes in emails to sign in. Use the official app or portal." },
    { id: "bankSender", label: "Sender of the bank details email", risk: true,
      title: "ledgerline-io.com, not ledgerline.io", topic: "Invoice fraud · Lookalike domain",
      attacker: "Copy the supplier's style and send from a domain that's almost the same.",
      why: "It arrives right after a real invoice, so it feels like part of the thread.",
      act: "Compare it with the earlier email. They don't match." },
    { id: "bank", label: "New bank details", risk: true,
      title: "Changed bank details by email", topic: "Invoice fraud · Payments",
      attacker: "Swap the account number. The next payment comes to me.",
      why: "Payments are hard to get back once sent.",
      act: "Always confirm bank changes by phone, using the number in the supplier register." },
    { id: "voicemail", label: "Voicemail attachment", risk: true,
      title: "Voicemail as an .htm file", topic: "Phishing · Attachments",
      attacker: "The \"player\" is a local web page that asks you to sign in.",
      why: "Voicemail lives in Teams or on the phone, never in an .htm attachment.",
      act: "Don't open it. Report it with the Report phishing button." },
    { id: "ledgerSender", label: "Ledgerline sender address", note: "ledgerline.io is the supplier's real domain. Look at what they sent instead." },
    { id: "lunchSender", label: "Sofie's address", note: "A colleague on the right domain, writing about lunch. Normal." },
    { id: "lunchText", label: "Lunch invitation", note: "No link, no attachment, no pressure. Just lunch." },
    { id: "secSender", label: "Security team address", note: "security@northwind.com is the real internal team." },
    { id: "intranet", label: "Intranet link", note: "Hover: it really goes to intranet.northwind.com. Safe." },
    { id: "reportBtn", label: "Report phishing button", note: "This is your friend. Use it whenever an email looks wrong." },
  ],
  chain: [
    { title: "The invoice route",
      story: "Finance opens Invoice_4471.zip. A macro runs, steals the browser passwords, and the attacker signs in to the finance mailbox. From there, fake invoices go out to your customers.",
      options: ["Report unexpected archives instead of opening them", "Ask suppliers to send bigger attachments", "Delete the email after opening it"],
      answer: 0,
      why: "If it's never opened, nothing runs. Reporting also warns everyone else." },
    { title: "The CEO route",
      story: "An assistant buys gift cards for \"Mara\" and sends photos of the codes. The money is gone within minutes.",
      options: ["Reply to the email and ask if it's really her", "Call Mara on a number you already have before doing anything", "Buy only half the cards"],
      answer: 1,
      why: "Replying goes straight to the attacker. A known phone number reaches the real Mara." },
    { title: "The bank details route",
      story: "Accounts payable updates the supplier's IBAN from an email and pays 480 000 kr into the attacker's account.",
      options: ["Pay to both the old and the new account", "Wait a week before paying", "Confirm the change by calling the supplier on the number in the register"],
      answer: 2,
      why: "A call-back on a known number is the control that stops invoice fraud." },
  ],
};
