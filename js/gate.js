/**
 * gate.js — two-tier password gate for wedding.html and rsvp.html
 *
 * Tier "full"      : family/close friends — sees Roce + Reception
 * Tier "reception" : all other guests     — sees Reception only
 *
 * Unlocking once persists for the browser session (sessionStorage), so moving
 * between wedding.html and rsvp.html does not re-prompt.
 *
 * Some full-tier passwords also choose whose name is written first wherever
 * Gloria and Shannon are named together (headings, labels, the tab title).
 * The letter, memory lane, and other story copy are left alone.
 *   lead "gloria"  : glo, gloshan
 *   lead "shannon" : shan, shanglow, shanu
 *   lead ""        : morjim, and every other password — page copy stays as written
 *
 * To change a password:
 *   1. Choose your new password (case-insensitive, leading/trailing spaces stripped).
 *   2. Run in a terminal:
 *        node -e "const c=require('crypto');console.log(c.createHash('sha256').update('<password>').digest('hex'));"
 *   3. Add an entry to PASSWORDS below.
 */
(function () {
  "use strict";

  /* ── Hashes (SHA-256 of the password, trimmed + lower-cased) ────────────── */
  var PASSWORDS = [
    { hash: "cf89449d349c0c8555fb43348a94406f066a7b42565b6de338f73bf7d5f84985", tier: "full",      lead: "gloria"  }, // "glo"
    { hash: "c88dc7a713fd1463461c1ac6bc93274d7cde047cee48f0d7ed404795d85f239e", tier: "full",      lead: "gloria"  }, // "gloshan"
    { hash: "6033dd6ed0058caa68b58a17cd367b146c900f43208e5316bfd584d03c290e11", tier: "full",      lead: "shannon" }, // "shan"
    { hash: "a26d61fc49936e8789f2d3593d0a282ca3fd04363492e776c59a2441a0bde529", tier: "full",      lead: "shannon" }, // "shanglow"
    { hash: "5ee139edddb3b9bb9cc0289d3bf02f4feefd4555adf62ada20819659725ee933", tier: "full",      lead: ""        }, // "shanglo"
    { hash: "edd49ba8dd56d9080c1080c73705c774f96bbf82340ab978ddfde70cb950df51", tier: "full",      lead: ""        }, // "goya"
    { hash: "17e85e953d3f43131c00fe478139250fdcb0e97a4fc984ade1b4fa6e63d7ddf2", tier: "full",      lead: "shannon" }, // "shanu"
    { hash: "b6057615d0477c7bbea4027d34d9c3383d1790fcf71fcff450b8b027f0d31d9e", tier: "reception", lead: ""        }  // "morjim"
  ];

  var TIER_KEY   = "gs-tier";   // sessionStorage key  →  "full" | "reception"
  var LEAD_KEY   = "gs-lead";   // sessionStorage key  →  "gloria" | "shannon" | ""

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

  function storedLead() {
    try { return sessionStorage.getItem(LEAD_KEY) || ""; } catch (e) { return ""; }
  }

  function persistLead(lead) {
    try {
      if (lead === "gloria" || lead === "shannon") sessionStorage.setItem(LEAD_KEY, lead);
      else sessionStorage.removeItem(LEAD_KEY);
      sessionStorage.setItem("gs-rules", "2");
    } catch (e) { /* private mode — in-memory only */ }
  }

  function applyLead(lead) {
    root.classList.remove("lead-gloria", "lead-shannon");
    if (lead === "gloria" || lead === "shannon") {
      root.classList.add("lead-" + lead);
    }
  }

  /* Joint labels only — elements opted in with data-order-names.
     Story and letter copy are not marked, so they stay as written. */
  function swapPairText(text, lead) {
    if (lead !== "gloria" && lead !== "shannon") return text;
    var gloria = /Gloria(?:\s+Noronha)?/.exec(text);
    var shannon = /Shannon(?:\s+Earl\s+Pereira)?/.exec(text);
    if (!gloria || !shannon) return text;
    var gloriaFirst = gloria.index < shannon.index;
    if ((lead === "gloria" && gloriaFirst) || (lead === "shannon" && !gloriaFirst)) return text;
    var first = gloriaFirst ? gloria : shannon;
    var second = gloriaFirst ? shannon : gloria;
    var leading = lead === "gloria" ? gloria[0] : shannon[0];
    var trailing = lead === "gloria" ? shannon[0] : gloria[0];
    return text.slice(0, first.index) +
      leading +
      text.slice(first.index + first[0].length, second.index) +
      trailing +
      text.slice(second.index + second[0].length);
  }

  function rewriteOrderedLabels(lead) {
    if (lead !== "gloria" && lead !== "shannon") return;
    document.title = swapPairText(document.title, lead);
    var metas = document.querySelectorAll(
      'meta[name="description"], meta[name="author"], meta[property="og:title"]'
    );
    Array.prototype.forEach.call(metas, function (meta) {
      var content = meta.getAttribute("content");
      if (content) meta.setAttribute("content", swapPairText(content, lead));
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-order-names]"), function (el) {
      ["aria-label", "alt"].forEach(function (attr) {
        var value = el.getAttribute(attr);
        if (value) el.setAttribute(attr, swapPairText(value, lead));
      });
    });
  }

  function whenReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
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
    var savedLead = storedLead();
    applyTier(tier);
    applyLead(savedLead);
    whenReady(function () { rewriteOrderedLabels(savedLead); });
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
      var match = null;
      for (var i = 0; i < PASSWORDS.length; i++) {
        if (PASSWORDS[i].hash === digest) { match = PASSWORDS[i]; break; }
      }
      if (!match) {
        showError();
        return;
      }
      persistTier(match.tier);
      persistLead(match.lead);
      applyTier(match.tier);
      applyLead(match.lead);
      rewriteOrderedLabels(match.lead);
      revealPage();
    });
  });
}());
