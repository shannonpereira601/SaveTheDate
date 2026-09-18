/**
 * gate.js — password overlay for wedding.html and rsvp-roce.html
 * Unlocking once in this browser tab unlocks both pages for the session.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "gs-unlocked";
  var HASH = "48f77ede63a14c927642ed850073edcc21057d143cd3f02cb650db7b5034ef2c";

  var root = document.documentElement;
  var gate = document.getElementById("site-gate");
  var form = document.getElementById("site-gate-form");
  var input = document.getElementById("site-gate-password");
  var errorEl = document.getElementById("site-gate-error");

  function isUnlocked() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function persistUnlock() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch (e) { /* private mode — unlock this page only */ }
  }

  function revealPage() {
    root.classList.remove("is-gated");
    root.classList.add("is-unlocked");
    if (gate && gate.parentNode) {
      gate.parentNode.removeChild(gate);
    }
  }

  function showError() {
    if (!errorEl || !input) { return; }
    errorEl.removeAttribute("hidden");
    input.setAttribute("aria-invalid", "true");
    input.select();
    if (gate) {
      gate.classList.remove("is-shake");
      void gate.offsetWidth;
      gate.classList.add("is-shake");
    }
  }

  function clearError() {
    if (errorEl) { errorEl.setAttribute("hidden", ""); }
    if (input) { input.removeAttribute("aria-invalid"); }
  }

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
    try {
      return Promise.resolve(normalized === atob("Z2Fsb3JpYQ==") ? HASH : "");
    } catch (e) {
      return Promise.resolve("");
    }
  }

  if (isUnlocked()) {
    revealPage();
    return;
  }

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
      if (digest === HASH) {
        persistUnlock();
        revealPage();
        return;
      }
      showError();
    });
  });
}());
