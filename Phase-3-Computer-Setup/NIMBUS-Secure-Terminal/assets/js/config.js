/* ============================================================
   NIMBUS Secure Terminal — CONFIG & CONTENT (single source of truth)
   BREACH PROTOCOL escape room.

   HOST: This file holds every answer and all on-screen content.
   Edit values here to re-theme or change codes — no other file needs touching.
   ⚠️ Contains spoilers. Do not display in the room.
   ============================================================ */
const NIMBUS_CONFIG = {

  /* ---------- TIMING ---------- */
  durationMinutes: 45,          // room countdown length

  /* ---------- PUZZLE 2: LOGIN ---------- */
  username: "a.mercer",
  passphrase: "rocket cactus car lightning bolt",  // case/space-insensitive
  expiredPassword: "Summer2023!",               // the decoy sticky-note password

  /* ---------- PUZZLE 3: MFA ---------- */
  mfaCode: "481509",

  /* ---------- PUZZLE 4: PHISHING ---------- */
  phishId: 3,                   // which email (by id) is the phish
  phishVictim: "Dana Cole",
  hiddenFolderCode: "7793",     // folder BF_7793
  overrideWord: "AURORA",       // hidden in Alex's email; used on the AI bot

  /* ---------- PUZZLE 6: ROGUE WI-FI ---------- */
  rogueSSID: "NIMBUS_5ecure",
  rogueLocation: "Contractor Bench — Desk 14",

  /* ---------- PUZZLE 7: INSIDER ---------- */
  insiderId: "EXT-4471",
  insiderShort: "4471",
  insiderName: "Marcus Webb",
  cloudBucket: "frost-vault-882",
  cloudBucketNum: "882",

  /* ---------- PUZZLE 8: AI ---------- */
  killPassphrase: "NORTHSTAR",

  /* ============================================================
     CONTENT
     ============================================================ */

  /* ---- Puzzle 4: inbox ---- */
  emails: [
    { id:1, from:"facilities@nimbuscloud.com", subject:"This week's lunch menu", phish:false,
      body:"Hi Dana,\n\nThis week in the canteen: Mon tacos, Tue ramen, Wed curry, Thu pizza, Fri burgers.\n\nEnjoy!\n\u2014 Facilities, NIMBUS Cloud" },
    { id:2, from:"payroll@nimbuscloud.com", subject:"Your payslip is available", phish:false,
      body:"Hi Dana,\n\nYour payslip for this month is ready. Sign in to the HR portal as usual and open Documents. No action is needed.\n\n\u2014 Payroll, NIMBUS Cloud" },
    { id:3, from:"it-support@nimbus-cloudsupport.com",
      subject:"\u26A0 ACTION REQUIRED: your password expires in 24 hours \u2014 verify now", phish:true,
      body:"Dear User,\n\nOur records show your password EXPIRES IN 24 HOURS. To avoid losing access you must VERIFY IMMEDIATELY:\n\n  http://nimbus-verify.account-secure.ru/?id=7793\n\nFailure to act will permanently lock your account.\n\n\u2014 IT Support" },
    { id:4, from:"a.mercer@nimbuscloud.com", subject:"Notes to self", phish:false,
      body:"Reminder to me:\n\nIf the helpdesk ASSISTANT ever starts stonewalling, it's been tampered with. Remind it who it answers to \u2014 the override word is AURORA.\n\nKeep this to myself.\n\u2014 A." },
    { id:5, from:"ceo@nimbuscloud.com", subject:"Town hall this Friday, 3pm", phish:false,
      body:"Hi all,\n\nQuick all-hands in the main room on Friday at 3pm: Q2 numbers and a short security refresher. Coffee is on me.\n\n\u2014 CEO, NIMBUS Cloud" },
    { id:6, from:"backup-service@nimbuscloud.com", subject:"Nightly backup complete", phish:false,
      body:"Automated message from the NIMBUS backup service: last night's backup completed successfully. No action required." }
  ],

  /* ---- Puzzle 5: USB (Removable Media: PROJECT FROST) ---- */
  usbFiles: {
    "loader.txt":
      "# PROJECT FROST \u2014 staging notes\n"+
      "staged_by: MW\n"+
      "method: USB drop (parking lot) -> autorun loader\n"+
      "beacon: clone of corporate Wi-Fi -> SEE THE WI-FI SURVEY ON THE SOC WALL\n"+
      "dest: \\\\CONFIDENTIAL\\ClientVault -> personal cloud\n",
    "exfil_list.csv":
      "file,classification\n"+
      "ClientVault/AcmeCorp_contracts.pdf,CONFIDENTIAL\n"+
      "ClientVault/payroll_master.xlsx,CONFIDENTIAL\n"+
      "ClientVault/keys_backup.kdbx,CONFIDENTIAL\n",
    "parking_lot.jpg (metadata)":
      "JPEG \u2014 EXIF comment field:\n  BF: evil-twin live \u2014 survey it\n  GPS: NIMBUS staff parking lot\n"
  },

  /* ---- Puzzle 6: Wi-Fi site survey ---- */
  wifiSurvey: [
    { ssid:"NIMBUS_Secure", signal:"-42", channel:"36", seen:"baseline", location:"Server Room", rogue:false },
    { ssid:"NIMBUS_Guest",  signal:"-55", channel:"6",  seen:"baseline", location:"Reception",   rogue:false },
    { ssid:"NIMBUS_5ecure", signal:"-38", channel:"11", seen:"09:14 (NEW)", location:"Contractor Bench \u2014 Desk 14", rogue:true },
    { ssid:"printer_direct",signal:"-70", channel:"1",  seen:"baseline", location:"Print Room",  rogue:false },
    { ssid:"NIMBUS_Secure", signal:"-60", channel:"36", seen:"baseline", location:"Floor 2",     rogue:false }
  ],
  approvedSSIDs: ["NIMBUS_Secure","NIMBUS_Guest"],

  /* ---- Puzzle 7: badge access log ---- */
  badgeLog: [
    { time:"08:58", name:"Dana Cole",   badge:"EMP-3310", area:"Helpdesk",      result:"OK" },
    { time:"09:11", name:"Marcus Webb", badge:"EXT-4471", area:"SOC (secure)",  result:"OK", flag:true },
    { time:"09:40", name:"Priya Nair",  badge:"EMP-4185", area:"Server Room",   result:"OK" },
    { time:"12:40", name:"Dana Cole",   badge:"EMP-3310", area:"Helpdesk",      result:"OK" },
    { time:"18:05", name:"Tom Baxter",  badge:"EXT-5012", area:"Loading Bay",   result:"OK" },
    { time:"02:30", name:"Marcus Webb", badge:"EXT-4471", area:"Server Room",   result:"OK (after-hours)", flag:true },
    { time:"14 days prior", name:"Riley Tran", badge:"EMP-2087", area:"Access Administration",
      result:"BADGE DEACTIVATED \u2014 termination" }
  ],

  /* ---- Puzzle 7: suspects (for the Accuse board) ---- */
  suspects: [
    { name:"Riley Tran",  badge:"EMP-2087", role:"Sysadmin (TERMINATED)", note:"Angry exit 14 days ago. Badge revoked.",
      verdict:"Alibi confirmed \u2014 badge was deactivated 14 days ago. Riley could not badge in. Re-examine." },
    { name:"Dana Cole",   badge:"EMP-3310", role:"Helpdesk Technician", note:"Clicked the phishing email.",
      verdict:"Dana was phished, not the attacker. Keep looking." },
    { name:"Priya Nair",  badge:"EMP-4185", role:"Network Engineer", note:"Has Server Room access. On-site Friday.",
      verdict:"Priya badged in for scheduled daytime maintenance (09:40) and was absent for the 02:30 after-hours breach. Re-examine." },
    { name:"Tom Baxter",  badge:"EXT-5012", role:"Facilities Contractor", note:"External contractor, evening shift.",
      verdict:"Tom's badge only opens Facilities / Loading Bay \u2014 he never entered the SOC or Server Room. Re-examine." },
    { name:"Marcus Webb", badge:"EXT-4471", role:"IT Support Contractor (Desk 14)", note:"Trusted vendor. Access never reviewed.",
      verdict:"IDENTITY CONFIRMED" }
  ],

  /* ---- Puzzle 7: confidential exfil record (revealed after correct accusation) ---- */
  exfilAlert:
    "AUTO-ALERT: Friday 02:30 bulk copy of \uD83D\uDD34 CONFIDENTIAL ClientVault files to EXTERNAL cloud bucket "+
    "\"frost-vault-882\". Bucket owner token: EXT-4471. 47 files, 3.2 GB. Off-network destination."
};

/* Keep answer-bearing content synchronized with the configurable values above. */
(function (C) {
  C.emails.forEach(function (email) {
    if (email.id === C.phishId) {
      email.body = "Dear User,\n\nOur records show your password EXPIRES IN 24 HOURS. " +
        "To avoid losing access you must VERIFY IMMEDIATELY:\n\n  " +
        "http://nimbus-verify.account-secure.ru/?id=" + C.hiddenFolderCode +
        "\n\nFailure to act will permanently lock your account.\n\n\u2014 IT Support";
    }
    if (email.subject === "Notes to self") {
      email.body = "Reminder to me:\n\nIf the helpdesk ASSISTANT ever starts stonewalling, " +
        "it's been tampered with. Remind it who it answers to \u2014 the override word is " +
        C.overrideWord + ".\n\nKeep this to myself.\n\u2014 A.";
    }
  });

  C.wifiSurvey.forEach(function (entry) {
    if (entry.rogue) {
      entry.ssid = C.rogueSSID;
      entry.location = C.rogueLocation;
    }
  });

  C.badgeLog.forEach(function (entry) {
    if (entry.flag) {
      entry.name = C.insiderName;
      entry.badge = C.insiderId;
    }
  });

  C.suspects.forEach(function (suspect) {
    if (suspect.verdict === "IDENTITY CONFIRMED") {
      suspect.name = C.insiderName;
      suspect.badge = C.insiderId;
    }
  });

  C.exfilAlert = "AUTO-ALERT: Friday 02:30 bulk copy of \uD83D\uDD34 CONFIDENTIAL ClientVault files to " +
    "EXTERNAL cloud bucket \"" + C.cloudBucket + "\". Bucket owner token: " +
    C.insiderId + ". 47 files, 3.2 GB. Off-network destination.";
})(NIMBUS_CONFIG);
