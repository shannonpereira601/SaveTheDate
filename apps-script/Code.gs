/**
 * Gloria & Shannon Wedding RSVP — Google Apps Script
 * =====================================================
 *
 * SETUP STEPS (do this once in the browser):
 *
 *  1. Go to sheets.new and create a spreadsheet. Name it "Wedding RSVP".
 *  2. The first sheet is "Sheet1" — rename it to "Reception".
 *  3. Click the + at the bottom to add a second sheet. Name it "RoceReception".
 *  4. In the spreadsheet menu: Extensions → Apps Script.
 *  5. Delete any existing code and paste this entire file.
 *  6. Change SECRET_TOKEN below to any long random string you like
 *     (example: "Goa2026GloriaShannon!"). Use the SAME value in js/rsvp.js.
 *  7. Run setupHeaders() once:
 *       - In the function dropdown (top toolbar), choose "setupHeaders"
 *       - Click Run (▶). Approve the permissions Google asks for.
 *       - You will see header rows appear in both sheet tabs.
 *  8. Deploy as a Web App:
 *       - Click Deploy → New deployment
 *       - Type: Web app
 *       - Execute as: Me
 *       - Who has access: Anyone
 *       - Click Deploy → copy the Web app URL that appears.
 *  9. Paste that URL into js/rsvp.js as the SCRIPT_URL constant.
 * 10. IMPORTANT: Never share the Google Sheet itself publicly.
 *     The web app is write-only — guests can submit but never read rows.
 *
 * TESTING:
 *  - After deploying, fill out the RSVP form on your site and submit.
 *  - Open the Sheet — you should see one row per guest in the party.
 *  - If rows do not appear, open Apps Script → Executions to read the error log.
 */

var SECRET_TOKEN = "REPLACE_WITH_YOUR_TOKEN"; // ← change this (same value in js/rsvp.js)

// ─────────────────────────────────────────────────────────────────────────────
// doPost — called every time someone submits the RSVP form
// ─────────────────────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    var raw  = e && e.postData ? e.postData.contents : "{}";
    var data = JSON.parse(raw || "{}");

    // Honeypot: bots fill the hidden "website" field; humans leave it empty.
    if (data.website) {
      return respond({ status: "ok" });
    }

    // Token check — lightweight protection against random spam
    if (data.token !== SECRET_TOKEN) {
      return respond({ status: "error", message: "Unauthorized" });
    }

    var ss      = SpreadsheetApp.getActiveSpreadsheet();
    var tabName = data.tab === "RoceReception" ? "RoceReception" : "Reception";
    var sheet   = ss.getSheetByName(tabName);

    if (!sheet) {
      return respond({ status: "error", message: "Sheet tab '" + tabName + "' not found. Run setupHeaders() first." });
    }

    var timestamp   = new Date().toISOString();
    var partyId     = Utilities.getUuid();
    var names       = Array.isArray(data.names) ? data.names : [String(data.names || "")];
    var submittedBy = names[0] || "";
    var partySize   = parseInt(data.partySize, 10) || names.length;
    var attending   = data.attending || "No";
    var events      = tabName === "RoceReception" ? (data.events || "") : "";
    var phone       = data.phone    || "";
    var message     = data.message  || "";

    // Write one row per guest so headcounts and seating are trivial
    for (var i = 0; i < names.length; i++) {
      sheet.appendRow([
        timestamp,
        partyId,
        submittedBy,
        partySize,
        names[i],
        attending,
        events,
        phone,
        i === 0 ? message : ""  // message only on the first row (avoid duplication)
      ]);
    }

    return respond({ status: "ok" });
  } catch (ex) {
    return respond({ status: "error", message: ex.toString() });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// setupHeaders — run manually once to add headers to both sheet tabs
// ─────────────────────────────────────────────────────────────────────────────
function setupHeaders() {
  var ss      = SpreadsheetApp.getActiveSpreadsheet();
  var headers = [
    "Timestamp",
    "Party ID",
    "Submitted By",
    "Party Size",
    "Guest Name",
    "Attending",
    "Events",
    "Phone / WhatsApp",
    "Message"
  ];

  ["Reception", "RoceReception"].forEach(function (name) {
    var sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
    }
    if (sheet.getLastRow() === 0) {
      var range = sheet.getRange(1, 1, 1, headers.length);
      range.setValues([headers]);
      range.setFontWeight("bold");
      range.setBackground("#e8f5e9");
      sheet.setFrozenRows(1);
    }
  });

  Logger.log("Headers set up on both sheets.");
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
