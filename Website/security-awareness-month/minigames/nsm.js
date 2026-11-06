// Openings mapped to NSM's basic principles for ICT security (Grunnprinsipper for IKT-sikkerhet).
// English titles are our own wording. Physical and human-layer openings are left untagged on purpose:
// the principles cover ICT, and we only tag where the fit is honest.
(function () {
  const BASE = "https://nsm.no/regelverk-og-hjelp/rad-og-anbefalinger/";
  const P = {
    "1.1": ["Map governance, services and supporting systems", "identifisere-og-kartlegge/kartlegg-styringsstrukturer-leveranser-og-understottende-systemer/"],
    "2.3": ["Maintain a secure configuration", "beskytte-og-opprettholde/ivareta-en-sikker-konfigurasjon/"],
    "2.5": ["Control data flow", "beskytte-og-opprettholde/kontroller-dataflyt/"],
    "2.6": ["Control identities and access", "beskytte-og-opprettholde/ha-kontroll-pa-identiteter-og-tilganger/"],
    "2.7": ["Protect data at rest and in transit", "beskytte-og-opprettholde/beskytt-data-i-ro-og-i-transitt/"],
    "2.8": ["Protect email and browser", "beskytte-og-opprettholde/beskytt-e-post-og-nettleser/"],
    "4.1": ["Prepare to handle incidents", "handtere-og-gjenopprette/forbered-virksomheten-pa-handtering-av-hendelser/"],
    "4.3": ["Control and handle incidents", "handtere-og-gjenopprette/kontroller-og-handter-hendelser/"],
  };
  const MAP = {
    desktop: { fakeUpdate: "2.8", aiPaste: "2.5", consent: "2.6", shareEveryone: "2.6", autoplay: "2.3", passwordsTxt: "2.6", remoteSession: "2.6", updatesPaused: "2.3" },
    "front-door": { receptionPc: "2.3" },
    "home-office": { child: "2.6", router: "2.3", sticky: "2.6", usb: "2.3" },
    inbox: { lookalike: "2.8", link: "2.8", zip: "2.8", ceoSender: "2.8", giftcards: "2.8", externalIt: "2.8", qr: "2.8", bankSender: "2.8", bank: "2.8", voicemail: "2.8" },
    "night-shift": { laptop: "2.7", note: "2.6", unlockedPc: "2.3" },
    "on-the-road": { phone: "2.7", charger: "2.3", wifi: "2.7", bag: "2.7" },
    overshare: { pet: "2.6", mobile: "2.6" },
    "overshare-2": { fullDesktop: "2.6", otherCustomer: "2.6", admin: "2.6", hostname: "2.6", version: "2.6", network: "2.6", token: "2.7", storage: "2.6", weakness: "4.3" },
    "real-or-fake": { fakeDomain: "2.8", allInOne: "2.6", countdown: "2.8", supportPhone: "2.8", card: "2.8", notifications: "2.8" },
    "share-settings": { path: "1.1", label: "1.1", anyoneLink: "2.6", expiry: "2.6", guest: "2.6", leaver: "2.6", allCompany: "2.6", teamsShare: "2.5" },
    "weakest-link": { laptopA: "2.3", sticky: "2.6", phone: "4.1", usb: "2.3" },
  };
  window.NSM = {
    overview: "https://nsm.no/regelverk-og-hjelp/grunnprinsipper/",
    risiko: "https://nsm.no/regelverk-og-hjelp/rapporter/risiko-2026",
    norsis: "https://norsis.no/nasjonal-sikkerhetsmaned/",
    lookup(game, spot) {
      const code = (MAP[game] || {})[spot];
      if (!code || !P[code]) return null;
      return { code, title: P[code][0], url: BASE + P[code][1] };
    },
  };
})();
