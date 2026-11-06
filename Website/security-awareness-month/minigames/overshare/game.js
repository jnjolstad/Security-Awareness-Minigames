"use strict";

const html = `
<div class="pn">
  <header class="pn-top"><b class="pn-logo">Pro<span>Net</span></b><span class="pn-search">Search</span><span class="pn-nav">Home · Network · Jobs · Messages</span></header>
  <aside class="pn-profile">
    <div class="pn-banner"></div>
    <div class="pn-avatar">JB</div>
    <h2>Jonas Berg</h2>
    <p class="pn-headline" data-spot="headline">Junior Developer · Building things that matter</p>
    <p class="pn-loc">Oslo, Norway · <span class="pn-company" data-spot="companyLink">Northwind Studio</span></p>
    <p class="pn-conn" data-spot="connections">412 connections</p>
    <div class="pn-contact">
      <h3>Contact info</h3>
      <p data-spot="email">✉ jonas.berg@northwind.com</p>
      <p data-spot="mobile">☏ +47 912 34 567 · mobile</p>
    </div>
    <div class="pn-skills" data-spot="skills">
      <h3>Skills</h3>
      <span>Okta admin</span><span>Fortinet VPN</span><span>SAP S/4HANA</span><span>Azure AD</span><span>Python</span>
    </div>
    <div class="pn-edu" data-spot="education"><h3>Education</h3><p>BSc Computer Science · OsloMet 2025</p></div>
  </aside>
  <section class="pn-feed">
    <div class="pn-col">
      <article class="post">
        <div class="post-head"><span class="mini">JB</span><div><b>Jonas Berg</b><small>2 weeks ago</small></div></div>
        <p>First week done! 🎉 Got my badge and my own desk.</p>
        <div class="selfie" data-spot="badgeSelfie">
          <div class="face"></div><div class="body"></div>
          <div class="lanyard"></div>
          <div class="badge"><b>NORTHWIND</b><i></i><small>JONAS BERG<br>STAFF · ALL AREAS</small><em>▮▮▯▮▯▮▮▯▮▮</em></div>
        </div>
      </article>
      <article class="post" data-spot="welcome">
        <div class="post-head"><span class="mini">JB</span><div><b>Jonas Berg</b><small>3 weeks ago</small></div></div>
        <p>Started at Northwind Studio on 1 September! 🚀 Huge thanks to my manager <b>Kari Holm</b> for the warm welcome. Joining the IT platform team, working on sign-in and VPN.</p>
      </article>
      <article class="post" data-spot="orgChart">
        <div class="post-head"><span class="mini">JB</span><div><b>Jonas Berg</b><small>1 week ago</small></div></div>
        <p>Proud of this team 💪 Here's who does what:</p>
        <div class="org"><span>Kari Holm<small>Head of IT</small></span><div><span>Per Ås<small>Helpdesk</small></span><span>Jonas<small>Sign-in / VPN</small></span><span>Lea Vik<small>Payroll systems</small></span></div></div>
      </article>
    </div>
    <div class="pn-col">
      <article class="post" data-spot="holiday">
        <div class="post-head"><span class="mini">JB</span><div><b>Jonas Berg</b><small>2 days ago</small></div></div>
        <p>Two weeks in Thailand from Monday! 🌴 Out of office until 14 October, no laptop, no phone. Kari is covering for me.</p>
      </article>
      <article class="post" data-spot="pet">
        <div class="post-head"><span class="mini">JB</span><div><b>Jonas Berg</b><small>5 days ago</small></div></div>
        <p>Happy 5th birthday to Bamse 🐶 my best friend since 3 March 2021! Still remember picking him up as a puppy in Bergen, where I grew up.</p>
        <div class="dog">🐕</div>
      </article>
      <article class="post" data-spot="marathon">
        <div class="post-head"><span class="mini">JB</span><div><b>Jonas Berg</b><small>1 month ago</small></div></div>
        <p>Finished my first half marathon in 1:52! 🏃 Thanks for all the support.</p>
      </article>
      <div class="comment" data-spot="congrats"><b>Sara N.</b> Congrats on the new job, Jonas! 👏</div>
    </div>
  </section>
</div>`;

window.GAME = {
  id: "overshare",
  title: "Overshare",
  eyebrow: "PRONET · PUBLIC PROFILE",
  headline: ["A new starter's profile.", "What would you use?"],
  intro: "Jonas just started at Northwind. {n} things on his public profile help an attacker plan a convincing attack. Click what you'd use. Your score is the time you have left, minus wrong clicks, hints and missed openings.",
  prompt: "Click anything on the profile an attacker could use.",
  habits: [
    "Before posting, ask: would a stranger get something useful from this?",
    "Never share badges, screens, org charts or travel dates publicly.",
    "Security questions are only safe if the answers aren't public.",
  ],
  scene: { type: "html", width: 1100, height: 660, html },
  // Posts move within their own column so column heights, and the fit, never change.
  shuffle(stage, order) {
    const cols = [...stage.querySelectorAll(".pn-col")];
    cols.forEach((col, c) => {
      const posts = [...col.querySelectorAll(":scope > .post")];
      const tail = col.querySelector(":scope > .comment");
      order("posts" + c, posts.length).forEach((i) => col.append(posts[i]));
      if (tail) col.append(tail);
    });
    if (order("columns", 2)[0] === 1) cols[0].before(cols[1]);
  },
  spots: [
    { id: "badgeSelfie", label: "Selfie with badge", risk: true,
      title: "Access badge in a selfie", topic: "OSINT · Physical access",
      attacker: "Zoom in. Copy the design, name and layout to print a fake badge.",
      why: "A convincing badge gets you past people, even if it doesn't open doors.",
      act: "Never post your badge. Turn it around or take it off for photos." },
    { id: "welcome", label: "Welcome post", risk: true,
      title: "Manager, start date and role", topic: "OSINT · Pretexting",
      attacker: "\"Hi Jonas, Kari asked me to fix your VPN access.\" New starters say yes.",
      why: "New starters don't know who's who yet and want to be helpful.",
      act: "Keep posts general. New starters: verify any IT request through the helpdesk." },
    { id: "skills", label: "Skills list", risk: true,
      title: "Tech stack and admin roles", topic: "OSINT · Recon",
      attacker: "Now I know which systems to target and which fake login pages to build.",
      why: "\"Okta admin\" marks a high-value account.",
      act: "Describe skills in general terms. Don't list internal systems or admin rights." },
    { id: "holiday", label: "Holiday post", risk: true,
      title: "Away, unreachable, and who's covering", topic: "OSINT · Timing",
      attacker: "Email Kari \"from Jonas's private address\" while he can't be reached to confirm.",
      why: "Out-of-office periods are when impersonation works best.",
      act: "Post holiday photos after you're back." },
    { id: "pet", label: "Pet birthday post", risk: true,
      title: "Answers to security questions", topic: "Account recovery",
      attacker: "Pet's name, hometown, a date. Classic password reset questions.",
      why: "Security questions are only as secret as your social media.",
      act: "Use false answers stored in a password manager, or turn the questions off." },
    { id: "mobile", label: "Mobile number", risk: true,
      title: "Public mobile number", topic: "Smishing · SIM swap",
      attacker: "Text him a fake MFA link, or try to move his number to my SIM.",
      why: "A phone number connects work accounts to a person.",
      act: "Keep your number private. Share it with contacts one by one." },
    { id: "orgChart", label: "Team structure post", risk: true,
      title: "Org chart in public", topic: "OSINT · Targeting",
      attacker: "Payroll systems: Lea Vik. That's who gets the fake invoice.",
      why: "Knowing who does what makes attacks precise.",
      act: "Keep org charts internal." },
    { id: "email", label: "Work email address", risk: true,
      title: "Work email in public", topic: "Phishing · Recon",
      attacker: "Now I know the address format for everyone: firstname.lastname@northwind.com.",
      why: "One address reveals the pattern for the whole company.",
      act: "Use a contact form or keep work addresses off public profiles." },
    { id: "headline", label: "Headline", note: "A general job title. Fine." },
    { id: "education", label: "Education", note: "Normal to share. Little use to an attacker." },
    { id: "marathon", label: "Marathon post", note: "Personal, but gives nothing useful about work." },
    { id: "connections", label: "Connections count", note: "Just a number." },
    { id: "congrats", label: "Congratulations comment", note: "A friendly comment. Nothing to use." },
    { id: "companyLink", label: "Company name", note: "The employer is public anyway. The details around it are the problem." },
  ],
  chain: [
    { title: "The new starter route",
      story: "A caller says \"Hi Jonas, Kari asked me to reset your VPN. Can you read me the code you just got?\" Jonas reads it out.",
      options: ["Hang up and call the helpdesk on the number from the intranet", "Ask the caller for their employee number", "Only read out half of the code"],
      answer: 0,
      why: "Any detail the caller gives may come from the profile. A call back on a known number can't be faked." },
    { title: "The reset route",
      story: "While Jonas is in Thailand, someone resets his private email using \"Bamse\" and \"Bergen\", then reaches his work accounts.",
      options: ["Post holiday photos with less sun", "Use false answers in a password manager, or turn security questions off", "Change the dog's name"],
      answer: 1,
      why: "If the answers aren't real, the profile can't give them away." },
    { title: "The badge route",
      story: "A visitor prints a badge that looks like Jonas's selfie and walks in confidently behind staff on Monday morning.",
      options: ["Make badges a different colour each year", "Ask staff to look closely at badges", "Don't post badges, and badge in one at a time"],
      answer: 2,
      why: "Remove the template, and one badge per person at the door." },
  ],
};
