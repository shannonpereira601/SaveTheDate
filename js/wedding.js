/**
 * wedding.js
 * Countdown to 18 Dec 2026 00:00:00 IST + mobile nav + scroll effect
 * Loaded only by wedding.html
 */
(function () {
  "use strict";

  /* ── Countdown ──────────────────────────────────────────────────────────── */
  // Target: 18 Dec 2026 00:00:00 IST (UTC+5:30 → 17 Dec 2026 18:30:00 UTC)
  var TARGET = Date.UTC(2026, 11, 17, 18, 30, 0); // months are 0-indexed

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function updateCountdown() {
    var el = document.getElementById("w-countdown");
    if (!el) { return; }

    var diff = TARGET - Date.now();

    if (diff <= 0) {
      el.innerHTML = '<span class="countdown-ended">The celebration has begun!</span>';
      return;
    }

    var days  = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var mins  = Math.floor((diff % 3600000)  / 60000);
    var secs  = Math.floor((diff % 60000)    / 1000);

    el.innerHTML =
      unitHTML(days,       "days")    +
      sepHTML()                        +
      unitHTML(pad(hours), "hours")   +
      sepHTML()                        +
      unitHTML(pad(mins),  "minutes") +
      sepHTML()                        +
      unitHTML(pad(secs),  "seconds");
  }

  function unitHTML(val, lbl) {
    return (
      '<div class="w-timer-unit">' +
        '<span class="w-timer-num">' + val + "</span>" +
        '<span class="w-timer-lbl">' + lbl + "</span>" +
      "</div>"
    );
  }

  function sepHTML() {
    return '<span class="w-timer-sep" aria-hidden="true">&middot;</span>';
  }

  // Kick off immediately then on a 1-second interval
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ── Nav: scroll background ─────────────────────────────────────────────── */
  var nav = document.getElementById("w-nav");
  if (nav) {
    function onScroll() {
      nav.classList.toggle("scrolled", window.scrollY > 60);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // handle case where page reloads mid-scroll
  }

  /* ── Mobile menu ────────────────────────────────────────────────────────── */
  var menuBtn    = document.getElementById("w-menu-btn");
  var mobileMenu = document.getElementById("w-mobile-menu");

  function openMenu() {
    mobileMenu.classList.add("is-open");
    menuBtn.classList.add("is-open");
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileMenu.classList.remove("is-open");
    menuBtn.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  function toggleMenu() {
    if (mobileMenu.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", toggleMenu);

    // Close when any link inside the mobile menu is clicked
    var menuLinks = mobileMenu.querySelectorAll("a");
    for (var i = 0; i < menuLinks.length; i++) {
      menuLinks[i].addEventListener("click", closeMenu);
    }

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if ((e.key === "Escape" || e.keyCode === 27) && mobileMenu.classList.contains("is-open")) {
        closeMenu();
        menuBtn.focus();
      }
    });
  }

  /* ── Figures: sequential pie + bar draw ─────────────────────────────────── */
  var MAROON = {
    deep: "#3A1510",
    mid:  "#6B2E2A",
    dust: "#8E4A46",
    rose: "#B56E6A"
  };

  var PIES = {
    gloria: {
      slices: [
        { pct: 0.08, tone: "rose", legend: 0 },
        { pct: 0.24, tone: "dust", legend: 1 },
        { pct: 0.12, tone: "mid",  legend: 2 },
        { pct: 0.56, tone: "deep", legend: 3 }
      ]
    },
    shannon: {
      slices: [
        { pct: 0.07, tone: "rose", legend: 0 },
        { pct: 0.18, tone: "dust", legend: 1 },
        { pct: 0.08, tone: "mid",  legend: 2 },
        { pct: 0.67, tone: "deep", legend: 3 }
      ]
    }
  };

  var BARS = [
    { x: 70,  w: 64, h: 158, pct: 100, tone: "deep", labelX: 102 },
    { x: 154, w: 64, h: 128, pct: 81,  tone: "mid",  labelX: 186 },
    { x: 238, w: 64, h: 102, pct: 65,  tone: "dust", labelX: 270 }
  ];

  var CX = 100;
  var CY = 100;
  var R = 88;
  var BASE_Y = 204;
  var NS = "http://www.w3.org/2000/svg";

  function polar(cx, cy, r, deg) {
    var rad = (deg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function slicePath(a0, a1) {
    var span = a1 - a0;
    if (span <= 0.08) { return ""; }
    var p0 = polar(CX, CY, R, a0);
    var p1 = polar(CX, CY, R, a1);
    var large = span > 180 ? 1 : 0;
    return "M " + CX + " " + CY +
      " L " + p0.x.toFixed(2) + " " + p0.y.toFixed(2) +
      " A " + R + " " + R + " 0 " + large + " 1 " +
      p1.x.toFixed(2) + " " + p1.y.toFixed(2) + " Z";
  }

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function prefersReduced() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function clearGroup(g) {
    if (!g) { return; }
    while (g.firstChild) { g.removeChild(g.firstChild); }
  }

  function drawSlicePath(d, fill) {
    if (!d) { return null; }
    var p = document.createElementNS(NS, "path");
    p.setAttribute("d", d);
    p.setAttribute("fill", fill);
    p.setAttribute("class", "pie-slice");
    return p;
  }

  function ensurePieLabels(svg, spec) {
    var group = svg.querySelector(".pie-pcts");
    if (!group || group.childNodes.length) { return; }
    var angle = 0;
    for (var i = 0; i < spec.slices.length; i++) {
      var slice = spec.slices[i];
      var span = slice.pct * 360;
      var mid = polar(CX, CY, R * 0.62, angle + span / 2);
      var t = document.createElementNS(NS, "text");
      t.setAttribute("class", "pie-pct");
      t.setAttribute("x", mid.x.toFixed(1));
      t.setAttribute("y", (mid.y + 4).toFixed(1));
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("opacity", "0");
      t.textContent = Math.round(slice.pct * 100) + "%";
      group.appendChild(t);
      angle += span;
    }
  }

  function drawPieFrame(svg, spec, progressByIndex) {
    var group = svg.querySelector(".pie-slices");
    var labels = svg.querySelectorAll(".pie-pcts text");
    clearGroup(group);
    ensurePieLabels(svg, spec);
    labels = svg.querySelectorAll(".pie-pcts text");
    var angle = 0;
    for (var i = 0; i < spec.slices.length; i++) {
      var slice = spec.slices[i];
      var span = slice.pct * 360;
      var shown = span * (progressByIndex[i] || 0);
      var node = drawSlicePath(
        shown > 0.08 ? slicePath(angle, angle + shown) : "",
        MAROON[slice.tone]
      );
      if (node) { group.appendChild(node); }
      if (labels[i]) {
        labels[i].setAttribute("opacity", (progressByIndex[i] || 0) > 0.72 ? "1" : "0");
      }
      angle += span;
    }
  }

  function lightLegend(list, index) {
    if (!list || !list.children[index]) { return; }
    list.children[index].classList.add("is-lit");
  }

  function animatePies(root) {
    var svgs = root.querySelectorAll(".js-pie");
    var duration = 380;
    var stagger = 160;
    var specs = [];
    var i;

    for (i = 0; i < svgs.length; i++) {
      specs.push({
        svg: svgs[i],
        spec: PIES[svgs[i].getAttribute("data-pie")],
        legend: root.querySelector('[data-pie-legend="' + svgs[i].getAttribute("data-pie") + '"]'),
        progress: [0, 0, 0, 0]
      });
    }

    function finishPies() {
      for (i = 0; i < specs.length; i++) {
        specs[i].progress = [1, 1, 1, 1];
        drawPieFrame(specs[i].svg, specs[i].spec, specs[i].progress);
        var items = specs[i].legend ? specs[i].legend.children : [];
        for (var n = 0; n < items.length; n++) { items[n].classList.add("is-lit"); }
      }
    }

    if (prefersReduced()) {
      finishPies();
      return Promise.resolve();
    }

    var sliceCount = 4;
    var start = null;

    return new Promise(function (resolve) {
      function tick(now) {
        if (start == null) { start = now; }
        var elapsed = now - start;
        var allDone = true;

        for (i = 0; i < specs.length; i++) {
          var unit = specs[i];
          for (var s = 0; s < sliceCount; s++) {
            var local = (elapsed - s * stagger) / duration;
            if (local < 0) {
              unit.progress[s] = 0;
              allDone = false;
            } else if (local >= 1) {
              if (unit.progress[s] < 1) {
                unit.progress[s] = 1;
                lightLegend(unit.legend, unit.spec.slices[s].legend);
              }
            } else {
              unit.progress[s] = easeOut(local);
              allDone = false;
            }
          }
          drawPieFrame(unit.svg, unit.spec, unit.progress);
        }

        if (allDone) { resolve(); }
        else { window.requestAnimationFrame(tick); }
      }
      window.requestAnimationFrame(tick);
    });
  }

  function animateBars(root) {
    var svg = root.querySelector(".js-bars");
    if (!svg) { return; }
    var bars = svg.querySelector(".bar-sketches");
    var axes = svg.querySelector(".bar-axes");
    var labels = svg.querySelectorAll(".bar-label");
    var pcts = svg.querySelectorAll(".bar-pct");
    var duration = 340;
    var stagger = 140;

    if (axes && !axes.childNodes.length) {
      var v = document.createElementNS(NS, "line");
      v.setAttribute("x1", "40"); v.setAttribute("y1", "28");
      v.setAttribute("x2", "40"); v.setAttribute("y2", "204");
      v.setAttribute("class", "bar-axis");
      var h = document.createElementNS(NS, "line");
      h.setAttribute("x1", "40"); h.setAttribute("y1", "204");
      h.setAttribute("x2", "320"); h.setAttribute("y2", "204");
      h.setAttribute("class", "bar-axis");
      axes.appendChild(v);
      axes.appendChild(h);
    }

    function setBars(progress) {
      clearGroup(bars);
      for (var i = 0; i < BARS.length; i++) {
        var bar = BARS[i];
        var t = progress[i] || 0;
        var hgt = bar.h * t;
        if (hgt > 1.5) {
          var node = document.createElementNS(NS, "rect");
          node.setAttribute("x", String(bar.x));
          node.setAttribute("y", String(BASE_Y - hgt));
          node.setAttribute("width", String(bar.w));
          node.setAttribute("height", String(hgt));
          node.setAttribute("class", "bar-rect");
          node.setAttribute("fill", MAROON[bar.tone]);
          bars.appendChild(node);
        }
        var yTop = BASE_Y - hgt;
        if (labels[i]) {
          labels[i].setAttribute("y", Math.max(18, yTop - 8).toFixed(2));
          labels[i].setAttribute("opacity", t > 0.28 ? String(Math.min(1, (t - 0.28) / 0.45)) : "0");
        }
        if (pcts[i]) {
          pcts[i].setAttribute("y", (yTop + 18).toFixed(2));
          pcts[i].setAttribute("opacity", t > 0.55 ? String(Math.min(1, (t - 0.55) / 0.3)) : "0");
        }
      }
    }

    if (prefersReduced()) {
      setBars([1, 1, 1]);
      return;
    }

    var start = null;
    function tick(now) {
      if (start == null) { start = now; }
      var elapsed = now - start;
      var allDone = true;
      var progress = [];
      for (var i = 0; i < BARS.length; i++) {
        var local = (elapsed - i * stagger) / duration;
        if (local < 0) {
          progress[i] = 0;
          allDone = false;
        } else if (local >= 1) {
          progress[i] = 1;
        } else {
          progress[i] = easeOut(local);
          allDone = false;
        }
      }
      setBars(progress);
      if (!allDone) { window.requestAnimationFrame(tick); }
    }
    window.requestAnimationFrame(tick);
  }

  var figures = document.getElementById("figures");
  if (figures) {
    var started = false;
    function playFigures() {
      if (started) { return; }
      started = true;
      animatePies(figures);
      animateBars(figures);
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            playFigures();
            io.disconnect();
            break;
          }
        }
      }, { threshold: 0.32, rootMargin: "0px 0px -8% 0px" });
      io.observe(figures);
    } else {
      playFigures();
    }
  }

  /* ── Section fade-up on scroll ──────────────────────────────────────────── */
  function setupFadeUp() {
    var nodes = document.querySelectorAll(".fu");
    if (!nodes.length) { return; }

    if (prefersReduced() || !document.documentElement.classList.contains("js-motion")) {
      for (var a = 0; a < nodes.length; a++) { nodes[a].classList.add("is-in"); }
      return;
    }

    if (!("IntersectionObserver" in window)) {
      for (var b = 0; b < nodes.length; b++) { nodes[b].classList.add("is-in"); }
      return;
    }

    var ioFade = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add("is-in");
          ioFade.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

    for (var n = 0; n < nodes.length; n++) {
      ioFade.observe(nodes[n]);
    }
  }

  setupFadeUp();

  /* ── Envelope opens on scroll, letter slides out ────────────────────────── */
  function setupEnvelopeOpen() {
    var env = document.getElementById("w-envelope");
    if (!env) { return; }

    function openEnvelope() {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          env.classList.add("is-open", "is-opening");
          window.setTimeout(function () {
            env.classList.remove("is-opening");
          }, 2800);
        });
      });
    }

    if (prefersReduced() || !document.documentElement.classList.contains("js-motion")) {
      env.classList.add("is-open");
      return;
    }

    if (!("IntersectionObserver" in window)) {
      env.classList.add("is-open");
      return;
    }

    var ioEnv = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          openEnvelope();
          ioEnv.disconnect();
          break;
        }
      }
    }, { threshold: 0.36, rootMargin: "0px 0px -8% 0px" });

    ioEnv.observe(env);
  }

  setupEnvelopeOpen();
})();
