"use strict";

window.MINIGAMES = {
  api: "/security-awareness-month/minigames-api",
  games: [
    { id: "weakest-link", title: "Weakest link", group: "physical", icon: "🏢", blurb: "Lunch break at the office. Find what an intruder would use.", topics: "Doors · Clean desk · USB · MFA", cover: true },
    { id: "front-door", title: "Front door", group: "physical", icon: "🚪", blurb: "Monday rush at reception. Who gets in without a badge?", topics: "Tailgating · Visitors · Badges", cover: true },
    { id: "night-shift", title: "Night shift", group: "physical", icon: "🌙", blurb: "Everyone has gone home. What did they leave behind?", topics: "Clean desk · Keys · Disposal", cover: true },
    { id: "on-the-road", title: "On the road", group: "physical", icon: "✈️", blurb: "A delayed flight and a busy gate. Who's watching?", topics: "Travel · Wi-Fi · Chargers", cover: true },
    { id: "home-office", title: "Home office", group: "physical", icon: "🏠", blurb: "Standup in two minutes. Is home as safe as the office?", topics: "Video calls · Router · Family", cover: true },
    { id: "inbox", title: "Inbox", group: "digital", icon: "✉️", blurb: "Eight new emails. Spot the phishing, fraud and fakes.", topics: "Phishing · CEO fraud · QR · Invoices", cover: true },
    { id: "overshare", title: "Overshare", group: "digital", icon: "👤", blurb: "A new starter's public profile. What would an attacker use?", topics: "OSINT · Social media · Recovery", cover: true },
    { id: "overshare-2", title: "Overshare 2", group: "digital", icon: "🔎", blurb: "An infrastructure diagram for a customer. What should stay private?", topics: "Disclosure · Customers · Infrastructure", cover: true },
    { id: "desktop", title: "Desktop", group: "digital", icon: "🖥️", blurb: "One busy afternoon on screen. How many doors are open?", topics: "Fake updates · AI · Consent · Patching", cover: true },
    { id: "share-settings", title: "Share settings", group: "digital", icon: "🔗", blurb: "A salary spreadsheet. Who can really see it?", topics: "Sharing · Labels · Leavers", cover: true },
    { id: "real-or-fake", title: "Real or fake", group: "digital", icon: "🎣", blurb: "Two sign-in pages. Which details give the fake away?", topics: "Domains · MFA relay · Passkeys", cover: true },
  ],
};
