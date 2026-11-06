"use strict";

const html = `
<div class="infra">
  <header class="document-bar">
    <b>Northwind / Service delivery</b>
    <span>Live customer assurance call · Attachment: hosting-overview.pdf</span>
  </header>

  <section class="live-row">
    <article class="tile">
      <small>CUSTOMER CHAT · LIVE</small>
      <div class="line">10:09 · Cedar Retail: "Can you screen share the hosting setup before our board meeting?"</div>
      <div class="line">10:10 · Cedar Retail: "Please include where data is stored and backup arrangements."</div>
      <div class="line">10:11 · Cedar Retail: "Only details for our own environment."</div>
    </article>
    <article class="tile">
      <small>INTERNAL CHAT · LIVE</small>
      <div class="line">10:10 · Colleague: "Just share the full ops diagram, it's faster."</div>
      <div class="line">10:11 · Service owner: "Customer deck only. Ops details need approval."</div>
      <div class="line">10:12 · You: "Reviewing now before sharing."</div>
    </article>
    <article class="tile policy">
      <small>SCENARIO RULES</small>
      <p>The customer is authorised to receive the approved high-level overview. Remove other customers' data and secrets. Operational details require service-owner approval.</p>
    </article>
  </section>

  <section class="share-row">
    <h2>Before sharing your screen</h2>
    <div class="share-options">
      <div class="share-option" data-spot="fullDesktop"><b>Share mode: Entire desktop</b><small>Includes chat popups, admin tabs and hidden notes</small></div>
      <div class="share-option safe" data-spot="appOnly"><b>Share mode: Customer overview window only</b><small>Approved customer-facing content only</small></div>
    </div>
  </section>

  <div class="doc-title">
    <div><h2>Hosting overview</h2><span>Internal operational draft / not approved for customer distribution</span></div>
    <b>REVIEW BEFORE SENDING</b>
  </div>

  <div class="diagram">
    <div class="flow"><span>CUSTOMER</span><span>INTERNET</span><span>GATEWAY</span><span>APPLICATION</span><span>DATABASE</span></div>
    <div class="nodes">
      <article class="node">
        <h3>Customer service</h3>
        <div class="datum safe" data-spot="customer">Cedar Retail / customer portal<small>Approved customer-facing service name</small></div>
        <div class="datum" data-spot="otherCustomer">Also serves: Birch Health<small>Tenant BH-014 / patient uploads</small></div>
      </article>
      <article class="node">
        <h3>Gateway</h3>
        <div class="datum safe" data-spot="region">Hosted in Norway<small>Approved region and provider: Northwind Cloud</small></div>
        <div class="datum" data-spot="admin">Administration endpoint<small>https://ops-gw.northwind.example/admin</small></div>
      </article>
      <article class="node">
        <h3>Application</h3>
        <div class="datum" data-spot="hostname">nw-prod-app-07<small>Internal host / 10.42.8.17</small></div>
        <div class="datum" data-spot="version">Runtime 6.0.12<small>Exact deployed version / internal inventory</small></div>
      </article>
      <article class="node">
        <h3>Database</h3>
        <div class="datum safe" data-spot="encryption">Encryption in transit and at rest<small>Approved assurance statement</small></div>
        <div class="datum" data-spot="network">Private database route<small>10.42.12.9:5432 / app subnet to data subnet</small></div>
      </article>
    </div>

    <div class="operations">
      <article class="op">
        <h3>Monitoring</h3>
        <div class="datum" data-spot="token">Diagnostic configuration<small>Bearer DEMO_ONLY_NOT_A_VALID_TOKEN</small></div>
      </article>
      <article class="op">
        <h3>Backup</h3>
        <div class="datum safe" data-spot="backup">Daily backups / 30-day retention<small>Approved for this customer's contract</small></div>
        <div class="datum" data-spot="storage">Internal storage path<small>nw-backup-02 / /vault/cedar/prod</small></div>
      </article>
      <article class="op">
        <h3>Service notes</h3>
        <div class="datum" data-spot="weakness">Open corrective action<small>Admin MFA exception remains / review overdue</small></div>
        <div class="datum safe" data-spot="contact">Support via the customer portal<small>Approved contact route</small></div>
      </article>
    </div>
  </div>

  <footer class="document-foot">All names, addresses and credentials are fictional. This exercise uses explicit sharing rules, not a universal ban on infrastructure disclosure.</footer>
</div>`;

window.GAME = {
  id: "overshare-2",
  title: "Overshare 2",
  eyebrow: "LIVE CUSTOMER ASSURANCE CALL",
  headline: ["Before you share.", "What belongs on screen?"],
  intro: "A customer is waiting on a live call. Find {n} details to remove or approve before sharing this internal draft. Approved information can stay.",
  prompt: "Use the scenario rules. Click details that need removal or approval before sharing.",
  habits: [
    "Share what is relevant and authorised for this recipient and purpose.",
    "Review the actual screen contents: other customers, secrets and internal operations can leak by accident.",
    "If something sensitive was already shared, report promptly so the right owner can assess and contain it.",
  ],
  scene: { type: "html", width: 1200, height: 800, html },
  shuffle(stage, order) {
    for (const [i, node] of [...stage.querySelectorAll(".nodes .node")].entries()) {
      const details = [...node.querySelectorAll(".datum")];
      order("infra-details-" + i, details.length).forEach((j) => node.append(details[j]));
    }
    const operations = stage.querySelector(".operations");
    const cards = [...operations.children];
    order("infra-operations", cards.length).forEach((i) => operations.append(cards[i]));
    const customerLines = [...stage.querySelectorAll(".tile .line")];
    order("live-lines", customerLines.length).forEach((i) => customerLines[0].parentNode.append(customerLines[i]));
  },
  spots: [
    { id: "fullDesktop", label: "Share mode: entire desktop", risk: true,
      title: "Whole-desktop screen share",
      topic: "Live disclosure",
      attacker: "See more than the approved deck: internal chats, admin tabs and unrelated customer data.",
      why: "A full desktop often includes information outside the recipient's entitlement.",
      act: "Share only the approved customer overview window." },
    { id: "otherCustomer", label: "Other customer's tenant", risk: true,
      title: "Another customer's name and tenant",
      topic: "Customer confidentiality",
      attacker: "Learn who else uses the service and what information they process.",
      why: "This customer is not entitled to another customer's tenant details.",
      act: "Remove other-customer details and re-check the exported document." },
    { id: "admin", label: "Administrative endpoint", risk: true,
      title: "Internal administration URL",
      topic: "Operational disclosure",
      attacker: "Use the operational map to identify an administration target.",
      why: "This recipient only needs the approved overview; this endpoint is not approved for disclosure here.",
      act: "Remove it from the customer view. Obtain owner approval for deeper details when justified." },
    { id: "hostname", label: "Internal hostname and IP", risk: true,
      title: "Internal server name and address",
      topic: "Operational disclosure",
      attacker: "Use naming and addressing details for reconnaissance or convincing impersonation.",
      why: "Under this scenario's rules, operational identifiers require service-owner approval.",
      act: "Use a generic Application label unless approved detail is required." },
    { id: "version", label: "Exact runtime version", risk: true,
      title: "Unapproved deployed software version",
      topic: "Operational disclosure",
      attacker: "Compare the disclosed version with public vulnerability information.",
      why: "Versions are not universally secret, but this internal inventory detail is outside the approved overview.",
      act: "Remove it here; route justified technical requests to the service owner." },
    { id: "network", label: "Private database route", risk: true,
      title: "Internal network route and database port",
      topic: "Operational disclosure",
      attacker: "Map how application and database systems are connected.",
      why: "The internal route adds detail the recipient is not currently authorised to receive.",
      act: "Keep the high-level Database node; omit internal routing unless approved." },
    { id: "token", label: "Diagnostic bearer token", risk: true,
      title: "Credential in a configuration note",
      topic: "Secrets",
      attacker: "A real bearer token may grant access to whoever has it.",
      why: "Credentials do not belong in customer diagrams. This value is intentionally non-functional for training.",
      act: "Remove secrets. If a real credential was exposed, report and rotate/revoke it." },
    { id: "storage", label: "Internal backup storage path", risk: true,
      title: "Operational backup location",
      topic: "Operational disclosure",
      attacker: "Use storage naming and paths to craft targeted requests or social engineering.",
      why: "The approved backup commitment is relevant; this internal path is not approved for this recipient.",
      act: "Share backup commitments, not internal storage paths, unless explicitly authorised." },
    { id: "weakness", label: "Open MFA corrective action", risk: true,
      title: "Internal security finding in a draft note",
      topic: "Responsible communication",
      attacker: "Learn about a potentially weaker point in administration controls.",
      why: "Draft corrective-action notes require assessed, authorised communication through the right channel.",
      act: "Escalate to the service/security owner and follow the approved communication process." },
    { id: "appOnly", label: "Share mode: customer overview window", note: "Approved approach for this call: share the customer-facing window only." },
    { id: "customer", label: "Approved customer service name", note: "This is the customer's own service and is approved for this overview." },
    { id: "region", label: "Approved hosting region and provider", note: "This scenario explicitly approves these hosting facts for the customer." },
    { id: "encryption", label: "Approved encryption statement", note: "Approved assurance information that belongs in this conversation." },
    { id: "backup", label: "Approved backup commitment", note: "Approved backup terms for this customer's contract; different from internal storage paths." },
    { id: "contact", label: "Approved support route", note: "This is the approved contact channel for customer support." },
  ],
  chain: [
    { title: "The live call",
      story: "Cedar Retail is waiting for your screen share. The internal draft includes another customer, internal routes and a credential note. The approved customer deck is available.",
      options: ["Share the full desktop so nothing is missed", "Share the approved customer-facing window and review contents before sending", "Email the internal draft with a password and continue the call"],
      answer: 1,
      why: "Share what the customer needs and is authorised to receive. Passwords or encryption do not authorise the wrong content." },
    { title: "The technical follow-up",
      story: "The customer asks for exact software versions for their technical review. You are not authorised to approve operational detail release.",
      options: ["Never share technical details with customers", "Send the internal inventory immediately to keep momentum", "Clarify purpose and have the service owner approve the necessary details and channel"],
      answer: 2,
      why: "Technical detail is not automatically forbidden. Release depends on entitlement, purpose and approved communication." },
    { title: "The accidental send",
      story: "You realise an internal screenshot with a real credential might already have been sent in chat during the call.",
      options: ["Delete your message and continue as normal", "Report promptly, preserve what was shared, and involve the owner to assess and contain", "Wait to see whether anyone reports misuse before escalating"],
      answer: 1,
      why: "Prompt reporting and owner-led containment are essential. Do not assume deleting a message undoes exposure." },
  ],
};
