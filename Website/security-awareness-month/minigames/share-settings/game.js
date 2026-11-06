"use strict";

const html = `
<div class="sp">
  <header class="sp-top"><span class="waffle">⋮⋮⋮</span> <b>SharePoint</b><span class="sp-search">Search this site</span><span class="me">YO</span></header>
  <section class="sp-file">
    <div class="crumbs" data-spot="path">Northwind › <b>Marketing</b> › <b>Public assets</b> › Salary_2026.xlsx</div>
    <div class="sheet">
      <div class="xl-head"><span class="xl">X</span><b>Salary_2026.xlsx</b><span class="label" data-spot="label">◉ Public</span></div>
      <table class="grid">
        <tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th></tr>
        <tr><th>1</th><td><b>Name</b></td><td><b>Role</b></td><td><b>Salary</b></td><td><b>Account no.</b></td></tr>
        <tr><th>2</th><td>Kari Holm</td><td>Head of IT</td><td>1 140 000</td><td>1503 22 87341</td></tr>
        <tr><th>3</th><td>Per Ås</td><td>Helpdesk</td><td>612 000</td><td>9710 05 12280</td></tr>
        <tr><th>4</th><td>Lea Vik</td><td>Payroll</td><td>705 000</td><td>1206 44 90127</td></tr>
        <tr><th>5</th><td>Jonas Berg</td><td>Developer</td><td>585 000</td><td>3000 18 66542</td></tr>
        <tr><th>6</th><td>Mara Lind</td><td>CEO</td><td>2 350 000</td><td>1503 90 11736</td></tr>
      </table>
    </div>
    <div class="details">
      <h3>Details</h3>
      <div class="drow" data-spot="owner"><span>Owner</span><b>You</b></div>
      <div class="drow" data-spot="versions"><span>Version history</span><b>14 versions</b></div>
      <div class="drow"><span>Modified</span><b>Today 09:12</b></div>
      <h3>Activity</h3>
      <div class="act" data-spot="hrOpened">👤 <b>Lea Vik (HR)</b> opened the file · 2 h ago</div>
      <div class="act" data-spot="teamsShare">💬 Link posted in Teams channel <b>External partners</b> · 1 h ago</div>
      <span class="dl" data-spot="download">⤓ Download</span>
    </div>
  </section>
  <section class="dialog">
    <h2>Share 'Salary_2026.xlsx'</h2>
    <div class="linkbox" data-spot="anyoneLink"><span class="globe">🌐</span><div><b>Anyone with the link</b><small>can edit · no sign-in needed</small></div><span class="chev">›</span></div>
    <div class="expiry" data-spot="expiry">Link expires: <b>Never</b></div>
    <div class="copy"><span>https://northwind.sharepoint.com/:x:/g/Ea7…</span><span class="btn primary">Copy</span></div>
    <h3>People with access</h3>
    <div class="person" data-spot="ownerRow"><span class="pa">YO</span><div><b>You</b><small>Owner</small></div></div>
    <div class="person" data-spot="hrTeam"><span class="pa grp">HR</span><div><b>HR team</b><small>Can edit</small></div></div>
    <div class="person" data-spot="allCompany"><span class="pa grp">AN</span><div><b>All Northwind</b><small>3 412 members · Can view</small></div></div>
    <div class="person" data-spot="guest"><span class="pa ext">KP</span><div><b>kari.privat88@gmail.com</b><small>Guest · Can edit</small></div></div>
    <div class="person" data-spot="leaver"><span class="pa">ON</span><div><b>Ola Nord</b><small>Can edit · left the company in May</small></div></div>
  </section>
</div>`;

window.GAME = {
  id: "share-settings",
  title: "Share settings",
  eyebrow: "SHAREPOINT · SALARY_2026.XLSX",
  headline: ["One spreadsheet.", "Who can really see it?"],
  intro: "{n} settings around this salary file would let the wrong people read it. Click what you'd use. Your score is the time you have left, minus wrong clicks, hints and missed openings.",
  prompt: "Click every setting that lets the wrong people in.",
  habits: [
    "Share with named people, not \"Anyone with the link\".",
    "Label and store sensitive files where they belong.",
    "Review access regularly. Remove leavers, guests and big groups.",
  ],
  scene: { type: "html", width: 1100, height: 660, html },
  shuffle(stage, order) {
    const people = [...stage.querySelectorAll(".dialog .person:not([data-spot=ownerRow])")];
    const dialog = stage.querySelector(".dialog");
    order("people", people.length).forEach((i) => dialog.append(people[i]));
    const acts = [...stage.querySelectorAll(".details .act")];
    const dl = stage.querySelector(".details .dl");
    order("activity", acts.length).forEach((i) => dl.before(acts[i]));
  },
  spots: [
    { id: "path", label: "Folder path", risk: true,
      title: "Salary file in Marketing › Public assets", topic: "Data storage",
      attacker: "Public asset folders are synced, shared and searched by many people.",
      why: "Files inherit the access of the folder they're in.",
      act: "Store it in the HR site with restricted access." },
    { id: "label", label: "Sensitivity label", risk: true,
      title: "Labelled Public", topic: "Data classification",
      attacker: "A Public label means no protection follows the file.",
      why: "Labels control encryption, warnings and blocks. Wrong label, no protection.",
      act: "Label it Confidential – HR only." },
    { id: "anyoneLink", label: "Link setting", risk: true,
      title: "Anyone with the link can edit", topic: "Sharing links",
      attacker: "Get the link from a forwarded email or chat. No sign-in needed.",
      why: "Links get forwarded. Nobody knows who has them.",
      act: "Use \"Specific people\" and view-only." },
    { id: "expiry", label: "Link expiry", risk: true,
      title: "Link never expires", topic: "Sharing links",
      attacker: "An old link from two years ago still works.",
      why: "Access that never ends outlives the reason for it.",
      act: "Set an expiry date, for example 7 days." },
    { id: "guest", label: "Gmail guest", risk: true,
      title: "Private Gmail account can edit", topic: "External sharing",
      attacker: "Personal accounts often have weaker protection and aren't monitored.",
      why: "Company data in a private mailbox is outside company control.",
      act: "Remove the guest. Share only with work accounts." },
    { id: "leaver", label: "Ola Nord", risk: true,
      title: "Former employee still has access", topic: "Joiners, movers, leavers",
      attacker: "Leavers keep access to links and sharing that wasn't cleaned up.",
      why: "Sharing is separate from the account being disabled. Guest copies and links remain.",
      act: "Remove leavers from shares and review access when people leave." },
    { id: "allCompany", label: "All Northwind group", risk: true,
      title: "Whole company can view", topic: "Least privilege",
      attacker: "Compromise any one of 3 412 accounts, and you can read every salary.",
      why: "Big groups multiply the number of accounts that can leak it.",
      act: "Give access only to the people who need it." },
    { id: "teamsShare", label: "Teams activity", risk: true,
      title: "Link posted in an external channel", topic: "Data leakage",
      attacker: "Partners, and anyone they forward it to, now have an edit link.",
      why: "Channels with external members reach outside the company.",
      act: "Delete the post, change the link, and check who opened it." },
    { id: "owner", label: "Owner", note: "You own it. That's normal." },
    { id: "ownerRow", label: "You as owner", note: "The owner needs access." },
    { id: "hrTeam", label: "HR team", note: "HR needs this file. Correct access." },
    { id: "versions", label: "Version history", note: "Useful for recovery. Not a risk." },
    { id: "hrOpened", label: "HR opened it", note: "Lea works in HR. Expected." },
    { id: "download", label: "Download button", note: "A normal button. The question is who can use it." },
  ],
  chain: [
    { title: "The link route",
      story: "The edit link is forwarded from the partner channel to a supplier's shared mailbox. Someone there downloads the file and posts salaries online.",
      options: ["Change the link to Specific people, view-only, with an expiry", "Rename the file to Budget.xlsx", "Ask partners not to forward links"],
      answer: 0,
      why: "A link that needs sign-in by named people can't be forwarded to the world." },
    { title: "The leaver route",
      story: "Ola left in May, but his access to the file was never removed. In September he downloads the salary list before starting at a competitor.",
      options: ["Ask Ola to delete the file", "Remove leavers' access and review sharing regularly", "Add a password to the Excel file"],
      answer: 1,
      why: "Removing access when someone leaves is the control." },
    { title: "The label route",
      story: "A Copilot user in Marketing asks \"show me interesting files\". The Public salary file shows up in the answer.",
      options: ["Turn off Copilot for the company", "Tell Marketing not to ask that", "Label it Confidential and store it on the HR site"],
      answer: 2,
      why: "AI tools show what you already have access to. Fix the access and the label." },
  ],
};
