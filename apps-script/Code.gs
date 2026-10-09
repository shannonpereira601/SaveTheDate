/**
 * Gloria & Shannon Wedding RSVP — Google Apps Script
 * =====================================================
 *
 * All RSVPs go to ONE sheet tab called "RSVPs", one row per guest.
 * The "Guest Type" column records which password the guest unlocked the site with:
 *   Close (gloshan)     → family / close friends, invited to Roce + Reception
 *   Reception (morjim)  → all other guests, invited to the Reception only
 *
 * SETUP / UPDATE STEPS (in the browser):
 *
 *  1. Open the "Wedding RSVP" spreadsheet → Extensions → Apps Script.
 *  2. Delete the existing code and paste this entire file. Save (Ctrl+S).
 *  3. Run setupHeaders() once:
 *       - In the function dropdown (top toolbar), choose "setupHeaders"
 *       - Click Run (▶). Approve the permissions Google asks for.
 *       - A tab named "RSVPs" with a header row appears in the spreadsheet.
 *         The old "Reception" / "RoceReception" tabs are no longer used and
 *         can be deleted.
 *  4. Publish the new code WITHOUT changing the URL:
 *       - Deploy → Manage deployments
 *       - Click the pencil (Edit) on the existing Web app deployment
 *       - Version: "New version" → Deploy
 *     (Do NOT use "New deployment" — that creates a different URL, and
 *      js/rsvp.js would then need the new SCRIPT_URL.)
 *  5. IMPORTANT: Never share the Google Sheet itself publicly.
 *     The web app is write-only — guests can submit but never read rows.
 *
 * TESTING:
 *  - Fill out the RSVP form on the site and submit.
 *  - The form now shows an error if Google rejects the submission.
 *  - If rows do not appear, open Apps Script → Executions to read the error log.
 */

var SECRET_TOKEN = "galoria-is-the-best-kadu"; // must match TOKEN in js/rsvp.js
var SHEET_NAME   = "RSVPs";

var HEADERS = [
  "Timestamp",
  "Party ID",
  "Submitted By",
  "Party Size",
  "Guest Name",
  "Attending",
  "Guest Type",
  "Events",
  "Phone / WhatsApp",
  "Message"
];

var GUEST_TYPES = {
  full      : "Close (gloshan)",
  reception : "Reception (morjim)"
};

var FULL_TIER_EVENTS = ["Both", "Roce", "Reception"];

// "@" = plain text, so "+91 98765 43210" or a message starting with "=" is stored as typed
// instead of being parsed as a formula. Party Size stays numeric so it can be summed.
var COLUMN_FORMATS = HEADERS.map(function (h) { return h === "Party Size" ? "0" : "@"; });

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

    var timestamp   = new Date().toISOString();
    var partyId     = Utilities.getUuid();
    var names       = Array.isArray(data.names) ? data.names : [String(data.names || "")];
    var submittedBy = names[0] || "";
    var partySize   = parseInt(data.partySize, 10) || names.length;
    var attending   = data.attending === "Yes" ? "Yes" : "No";
    var tier        = data.tier === "full" || data.tier === "reception" ? data.tier : "";
    var guestType   = GUEST_TYPES[tier] || "Unknown";
    var phone       = data.phone   || "";
    var message     = data.message || "";

    // Reception-only guests can only attend the Reception, and declines attend nothing.
    var events = "";
    if (attending === "Yes") {
      if (tier === "reception") {
        events = "Reception";
      } else if (FULL_TIER_EVENTS.indexOf(data.events) !== -1) {
        events = data.events;
      }
    }

    var rows = names.map(function (name, i) {
      return [
        timestamp,
        partyId,
        submittedBy,
        partySize,
        name,
        attending,
        guestType,
        events,
        phone,
        i === 0 ? message : ""  // message only on the first row (avoid duplication)
      ];
    });

    if (rows.length) {
      // Lock so two parties submitting at once can't interleave their rows.
      var lock = LockService.getScriptLock();
      lock.waitLock(10000);
      try {
        var sheet = getSheet();
        var range = sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, HEADERS.length);
        range.setNumberFormats(rows.map(function () { return COLUMN_FORMATS; }));
        range.setValues(rows);
      } finally {
        lock.releaseLock();
      }
    }

    return respond({ status: "ok" });
  } catch (ex) {
    return respond({ status: "error", message: ex.toString() });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// setupHeaders — run manually once to create the RSVPs tab and its header row
// ─────────────────────────────────────────────────────────────────────────────
function setupHeaders() {
  getSheet();
  Logger.log("RSVPs tab is ready.");
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function getSheet() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    var range = sheet.getRange(1, 1, 1, HEADERS.length);
    range.setValues([HEADERS]);
    range.setFontWeight("bold");
    range.setBackground("#e8f5e9");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
