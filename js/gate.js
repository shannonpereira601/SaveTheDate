/**
 * gate.js — two-tier password gate for wedding.html and rsvp.html
 *
 * Tier "full"      : family/close friends — sees Roce + Reception
 * Tier "reception" : all other guests     — sees Reception only
 *
 * Unlocking once persists for the browser session (sessionStorage), so moving
 * between wedding.html and rsvp.html does not re-prompt.
 *
 * To change a password:
 *   1. Choose your new password (case-insensitive, leading/trailing spaces stripped).
 *   2. Run in a terminal:
 *        node -e "const c=require('crypto');console.log(c.createHash('sha256').update('<password>').digest('hex'));"
 *   3. Add the result to the HASHES.full or HASHES.reception list below.
 */
(function () {
  "use strict";

  /* ── Hashes (SHA-256 of the password, trimmed + lower-cased) ────────────── */
  var HASHES = {
    full      : [
      "c88dc7a713fd1463461c1ac6bc93274d7cde047cee48f0d7ed404795d85f239e", // "gloshan"
      "5ee139edddb3b9bb9cc0289d3bf02f4feefd4555adf62ada20819659725ee933", // "shanglo"
      "edd49ba8dd56d9080c1080c73705c774f96bbf82340ab978ddfde70cb950df51", // "goya"
      "17e85e953d3f43131c00fe478139250fdcb0e97a4fc984ade1b4fa6e63d7ddf2"  // "shanu"
    ],
    reception : [
      "b6057615d0477c7bbea4027d34d9c3383d1790fcf71fcff450b8b027f0d31d9e"  // "morjim"
    ]
  };

  var TIER_KEY   = "gs-tier";   // sessionStorage key  →  "full" | "reception"

  /* ── DOM refs ────────────────────────────────────────────────────────────── */
  var root    = document.documentElement;
  var gate    = document.getElementById("site-gate");
  var form    = document.getElementById("site-gate-form");
  var input   = document.getElementById("site-gate-password");
  var errorEl = document.getElementById("site-gate-error");

  /* ── Tier helpers ────────────────────────────────────────────────────────── */
  function storedTier() {
    try { return sessionStorage.getItem(TIER_KEY) || ""; } catch (e) { return ""; }
  }

  function persistTier(tier) {
    try { sessionStorage.setItem(TIER_KEY, tier); } catch (e) { /* private mode — in-memory only */ }
  }

  function applyTier(tier) {
    root.classList.remove("tier-full", "tier-reception");
    if (tier === "full" || tier === "reception") {
      root.classList.add("tier-" + tier);
    }
  }

  /* ── Page reveal ─────────────────────────────────────────────────────────── */
  function revealPage() {
    root.classList.remove("is-gated");
    root.classList.add("is-unlocked");
    if (gate && gate.parentNode) {
      gate.parentNode.removeChild(gate);
    }
  }

  /* ── Error / shake ───────────────────────────────────────────────────────── */
  function showError() {
    if (!errorEl || !input) { return; }
    errorEl.removeAttribute("hidden");
    input.setAttribute("aria-invalid", "true");
    input.select();
    if (gate) {
      gate.classList.remove("is-shake");
      void gate.offsetWidth; // force reflow to restart animation
      gate.classList.add("is-shake");
    }
  }

  function clearError() {
    if (errorEl) { errorEl.setAttribute("hidden", ""); }
    if (input)   { input.removeAttribute("aria-invalid"); }
  }

  /* ── SHA-256 helper ──────────────────────────────────────────────────────── */
  function hex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map(function (b) { return b.toString(16).padStart(2, "0"); })
      .join("");
  }

  function hashPassword(value) {
    var normalized = String(value || "").trim().toLowerCase();
    if (window.crypto && crypto.subtle) {
      return crypto.subtle
        .digest("SHA-256", new TextEncoder().encode(normalized))
        .then(hex);
    }
    // Fallback for very old browsers: cannot hash — reject silently
    return Promise.resolve("");
  }

  /* ── Bootstrap ───────────────────────────────────────────────────────────── */
  var tier = storedTier();
  if (tier === "full" || tier === "reception") {
    applyTier(tier);
    revealPage();
    return;
  }

  // No valid tier in storage — show the gate
  root.classList.add("is-gated");
  root.classList.remove("is-unlocked");

  if (!gate || !form || !input) { return; }

  gate.removeAttribute("hidden");
  window.setTimeout(function () { input.focus(); }, 50);

  input.addEventListener("input", clearError);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var value = input.value;
    if (!value.trim()) {
      showError();
      return;
    }

    hashPassword(value).then(function (digest) {
      if (HASHES.full.indexOf(digest) !== -1) {
        persistTier("full");
        applyTier("full");
        revealPage();
        return;
      }
      if (HASHES.reception.indexOf(digest) !== -1) {
        persistTier("reception");
        applyTier("reception");
        revealPage();
        return;
      }
      showError();
    });
  });
}());
