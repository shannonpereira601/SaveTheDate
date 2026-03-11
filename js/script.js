var timerEl = document.getElementById("time");
var leavesHost = document.getElementById("falling-leaves");
var isRocePage = document.body.classList.contains("roce-page");
var countdownTarget = timerEl ? timerEl.getAttribute("data-countdown-date") : null;
var countDownDate = new Date(countdownTarget || "Dec 19, 2026 00:00:00").getTime();
var intervalId = null;

function renderCountdown(days, hours, minutes, seconds) {
    timerEl.innerHTML =
        "<div class='countdown'>" +
        "<div class='time-block'><span class='time-value'>" + days + "</span><span class='time-label'>Days</span></div>" +
        "<div class='time-block'><span class='time-value'>" + hours + "</span><span class='time-label'>Hours</span></div>" +
        "<div class='time-block'><span class='time-value'>" + minutes + "</span><span class='time-label'>Minutes</span></div>" +
        "<div class='time-block'><span class='time-value'>" + seconds + "</span><span class='time-label'>Seconds</span></div>" +
        "</div>";
}

function updateCountdown() {
    var now = new Date().getTime();
    var distance = countDownDate - now;

    if (distance < 0) {
        clearInterval(intervalId);
        timerEl.innerHTML = "<p class='countdown-ended'>The celebration has begun!</p>";
        return;
    }

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    renderCountdown(days, hours, minutes, seconds);
}

if (timerEl) {
    updateCountdown();
    intervalId = setInterval(updateCountdown, 1000);
}

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function createLeaf() {
    var leaf = document.createElement("span");
    leaf.className = "falling-leaf";
    if (isRocePage) {
        leaf.classList.add(Math.random() < 0.5 ? "leaf-pink" : "leaf-green");
    }

    var size = randomBetween(10, 22);
    var leftPos = randomBetween(0, 100);
    var driftX = randomBetween(-90, 90);
    var startRotation = randomBetween(-120, 120);
    var endRotation = randomBetween(180, 560);
    var fallDuration = randomBetween(10, 20);
    var swayDuration = randomBetween(2.6, 5.2);
    var delay = randomBetween(-20, 0);

    leaf.style.setProperty("--leaf-size", size.toFixed(1) + "px");
    leaf.style.setProperty("--left-pos", leftPos.toFixed(2) + "%");
    leaf.style.setProperty("--drift-x", driftX.toFixed(1) + "px");
    leaf.style.setProperty("--start-rotation", startRotation.toFixed(0) + "deg");
    leaf.style.setProperty("--end-rotation", endRotation.toFixed(0) + "deg");
    leaf.style.setProperty("--fall-duration", fallDuration.toFixed(1) + "s");
    leaf.style.setProperty("--sway-duration", swayDuration.toFixed(1) + "s");
    leaf.style.setProperty("--fall-delay", delay.toFixed(1) + "s");
    leaf.style.setProperty("--sway-delay", (delay / 2).toFixed(1) + "s");

    leavesHost.appendChild(leaf);
}

function initFallingLeaves() {
    if (!leavesHost) {
        return;
    }

    var leafCount = window.innerWidth < 768 ? 12 : 20;
    for (var i = 0; i < leafCount; i += 1) {
        createLeaf();
    }
}

initFallingLeaves();
