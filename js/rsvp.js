/**
 * rsvp.js — handles the RSVP form on rsvp-roce.html
 *
 * BEFORE GOING LIVE — update both constants below:
 *
 *   SCRIPT_URL : paste the Apps Script Web app URL from your deployment
 *                (Deploy → New deployment → Web app → copy the URL)
 *
 *   TOKEN      : the same secret token you set in apps-script/Code.gs
 */
(function () {
  "use strict";
 //DeploymentID: AKfycbzb77-H3zog6fOWu3X3uPYuujnyG8t7anW5x0zXQM3R8eurdQgjnKneg0DkAB8ukvJk

  /* ── CONFIG ──────────────────────────────────────────────────────────────── */
  var SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzb77-H3zog6fOWu3X3uPYuujnyG8t7anW5x0zXQM3R8eurdQgjnKneg0DkAB8ukvJk/exec";
  var TOKEN      = "galoria-is-the-best-kadu";

  /* ── Element refs ────────────────────────────────────────────────────────── */
  var form           = document.getElementById("rsvp-form");
  if (!form) { return; } // not on an RSVP page

  var attendingYes   = document.getElementById("attending-yes");
  var attendingNo    = document.getElementById("attending-no");
  var partyFields    = document.getElementById("party-fields");
  var partySizeEl    = document.getElementById("party-size");
  var namesContainer = document.getElementById("names-container");
  var submitBtn      = document.getElementById("rsvp-submit");
  var formWrap       = document.getElementById("rsvp-form-wrap");
  var successWrap    = document.getElementById("rsvp-success");
  var errorEl        = document.getElementById("form-error");

  /* ── Attending toggle ────────────────────────────────────────────────────── */
  function onAttendingChange() {
    var val = getAttending();
    if (val === "yes") {
      showEl(partyFields);
      buildExtraNameFields(getPartySize());
    } else {
      hideEl(partyFields);
      clearExtraNameFields();
    }
    clearError();
  }

  if (attendingYes) { attendingYes.addEventListener("change", onAttendingChange); }
  if (attendingNo)  { attendingNo.addEventListener("change", onAttendingChange); }

  /* ── Party size → extra name fields ──────────────────────────────────────── */
  if (partySizeEl) {
    partySizeEl.addEventListener("change", function () {
      buildExtraNameFields(getPartySize());
    });
  }

  /**
   * Builds "Guest 2", "Guest 3", … name fields inside #names-container.
   * Guest 1 ("Your name") is a static HTML input — we only build the extras.
   */
  function buildExtraNameFields(count) {
    if (!namesContainer) { return; }
    clearExtraNameFields();
    var extras = Math.max(0, count - 1); // count includes the submitter
    for (var i = 0; i < extras; i++) {
      var idx   = i + 1; // 0 = submitter (static), 1+ = dynamically added
      var field = document.createElement("div");
      field.className = "rsvp-field";

      var lbl = document.createElement("label");
      lbl.className     = "rsvp-label";
      lbl.htmlFor       = "guest-name-" + idx;
      lbl.textContent   = "Guest " + (idx + 1) + "\u2019s name";

      var inp = document.createElement("input");
      inp.type         = "text";
      inp.id           = "guest-name-" + idx;
      inp.name         = "guest_name_" + idx;
      inp.className    = "rsvp-input";
      inp.placeholder  = "Full name";
      inp.maxLength    = 80;
      inp.autocomplete = "off";

      field.appendChild(lbl);
      field.appendChild(inp);
      namesContainer.appendChild(field);
    }
  }

  function clearExtraNameFields() {
    if (namesContainer) { namesContainer.innerHTML = ""; }
  }

  /* ── Form submission ─────────────────────────────────────────────────────── */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearError();

    // Honeypot: bots fill the hidden "website" field; real people leave it blank.
    var hp = form.querySelector('[name="website"]');
    if (hp && hp.value.trim()) { return; }

    // Validate name
    var submitterName = getVal("guest-name-0");
    if (!submitterName) {
      showError("Please enter your name.");
      focusEl("guest-name-0");
      return;
    }

    // Validate attending choice
    var attending = getAttending();
    if (!attending) {
      showError("Please let us know if you\u2019ll be attending.");
      return;
    }

    // Collect all guest names
    var partySize = (attending === "yes") ? getPartySize() : 1;
    var names = [submitterName];
    if (attending === "yes") {
      for (var i = 1; i < partySize; i++) {
        var nm = getVal("guest-name-" + i);
        names.push(nm || ("Guest " + (i + 1)));
      }
    }

    // Events (Roce page only — the <select name="events"> is only on rsvp-roce.html)
    var eventsEl = form.querySelector('[name="events"]');
    var events   = eventsEl ? eventsEl.value : "";

    var payload = {
      token    : TOKEN,
      tab      : form.getAttribute("data-tab") || "Reception",
      attending: attending === "yes" ? "Yes" : "No",
      partySize: partySize,
      names    : names,
      events   : events,
      phone    : getVal("phone"),
      message  : getVal("message")
    };

    setLoading(true);

    // mode: "no-cors" sidesteps the CORS preflight that Google Apps Script
    // redirects would otherwise block. The response is opaque (we can't read
    // the status code), so we show success once the request goes through and
    // catch genuine network failures in the catch block.
    fetch(SCRIPT_URL, {
      method : "POST",
      mode   : "no-cors",
      body   : JSON.stringify(payload)
    })
    .then(function () {
      setLoading(false);
      showSuccess(attending);
    })
    .catch(function () {
      setLoading(false);
      showError("Could not send your RSVP. Please check your connection and try again.");
    });
  });

  /* ── Helpers ─────────────────────────────────────────────────────────────── */
  function getAttending() {
    var checked = form.querySelector('input[name="attending"]:checked');
    return checked ? checked.value : "";
  }

  function getPartySize() {
    return partySizeEl ? (parseInt(partySizeEl.value, 10) || 1) : 1;
  }

  function getVal(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function focusEl(id) {
    var el = document.getElementById(id);
    if (el) { el.focus(); }
  }

  function showEl(el) {
    if (el) { el.removeAttribute("hidden"); }
  }

  function hideEl(el) {
    if (el) { el.setAttribute("hidden", ""); }
  }

  function setLoading(on) {
    if (!submitBtn) { return; }
    submitBtn.disabled    = on;
    submitBtn.textContent = on ? "Sending\u2026" : "Send RSVP";
    if (form) { form.classList.toggle("is-loading", on); }
  }

  function showSuccess(attending) {
    if (formWrap) { hideEl(formWrap); }
    if (successWrap) {
      var msg = attending === "yes"
        ? "We\u2019re so thrilled you\u2019ll be there! We cannot wait to celebrate with you."
        : "We\u2019ll miss you, but thank you for letting us know. Wishing you all our love.";
      var msgEl = successWrap.querySelector(".rsvp-success-msg");
      if (msgEl) { msgEl.textContent = msg; }
      showEl(successWrap);
      successWrap.focus();
    }
  }

  function showError(msg) {
    if (!errorEl) { return; }
    errorEl.textContent = msg;
    showEl(errorEl);
    errorEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function clearError() {
    if (!errorEl) { return; }
    errorEl.textContent = "";
    hideEl(errorEl);
  }

  /* ── Init ────────────────────────────────────────────────────────────────── */
  // party-fields start hidden; rsvp.js reveals them when the user picks "Yes"
  hideEl(partyFields);

}());
