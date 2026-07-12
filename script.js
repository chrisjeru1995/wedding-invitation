/* ===============================
   Enchanted Forest Wedding Invitation — JS
   =============================== */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- 0. Tap to open ---------- */
  const intro = document.getElementById("intro");
  const openBtn = document.getElementById("open-btn");

  const duoHearts = document.getElementById("duo-hearts");

  function startHeartDraw() {
    if (duoHearts) duoHearts.classList.add("is-visible");
  }

  function openInvitation() {
    if (!intro) return;
    intro.classList.add("is-open");
    document.body.classList.remove("is-locked");
    // reveal the hero content right away
    document
      .querySelectorAll(".hero .reveal")
      .forEach((el) => el.classList.add("is-visible"));
    // kick off the two-hearts draw once the scroll fades away
    window.setTimeout(startHeartDraw, 500);
    window.setTimeout(() => {
      if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
    }, 1000);
  }

  if (openBtn) {
    openBtn.addEventListener("click", openInvitation);
  } else {
    document.body.classList.remove("is-locked");
    startHeartDraw();
  }

  /* ---------- 1. Countdown timer ---------- */
  // Wedding start: Thursday, 17 September 2026, 10:35 a.m. (local time)
  const WEDDING_DATE = new Date(2026, 8, 17, 10, 35, 0).getTime();

  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    mins: document.getElementById("cd-mins"),
    secs: document.getElementById("cd-secs"),
    timer: document.getElementById("countdown-timer"),
    done: document.getElementById("countdown-done"),
  };

  const pad = (n) => String(n).padStart(2, "0");

  function tickCountdown() {
    const diff = WEDDING_DATE - Date.now();

    if (diff <= 0) {
      if (els.timer) els.timer.hidden = true;
      if (els.done) els.done.hidden = false;
      return true; // finished
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    if (els.days) els.days.textContent = pad(days);
    if (els.hours) els.hours.textContent = pad(hours);
    if (els.mins) els.mins.textContent = pad(mins);
    if (els.secs) els.secs.textContent = pad(secs);
    return false;
  }

  if (els.timer) {
    if (!tickCountdown()) {
      const id = setInterval(() => {
        if (tickCountdown()) clearInterval(id);
      }, 1000);
    }
  }

  /* ---------- 2. Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- 3. Ambient fireflies + hearts (rich, on every screen) ----------
     Fixed, GPU-composited canvas of glowing drifting fireflies + rising hearts
     that cover the viewport — steady over the static background, on every
     screen, for both desktop and mobile. */
  const heartHost = document.getElementById("hearts");
  const mobile = window.matchMedia("(max-width: 640px)").matches;

  const ffCanvas = document.getElementById("firefly-canvas");
  const ffCtx = ffCanvas ? ffCanvas.getContext("2d") : null;
  let fireflies = [];
  let ffRunning = false;

  function sizeCanvas() {
    if (!ffCanvas || !ffCtx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ffCanvas.width = window.innerWidth * dpr;
    ffCanvas.height = window.innerHeight * dpr;
    ffCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function makeFirefly(w, h) {
    return {
      x: Math.random() * w, y: Math.random() * h,
      r: 1 + Math.random() * 2.2, baseAlpha: 0.28 + Math.random() * 0.55,
      phase: Math.random() * Math.PI * 2, speed: 0.004 + Math.random() * 0.012,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
    };
  }
  function initFireflies() {
    if (!ffCanvas || prefersReduced) return;
    sizeCanvas();
    fireflies = [];
    const count = mobile ? 32 : 55;
    for (let i = 0; i < count; i++) fireflies.push(makeFirefly(window.innerWidth, window.innerHeight));
    if (!ffRunning) { ffRunning = true; requestAnimationFrame(drawFireflies); }
  }
  function drawFireflies() {
    if (!ffCtx) return;
    const w = window.innerWidth, h = window.innerHeight;
    ffCtx.clearRect(0, 0, w, h);
    for (const f of fireflies) {
      f.phase += f.speed * 16; f.x += f.vx; f.y += f.vy;
      if (f.x < -12) f.x = w + 12; if (f.x > w + 12) f.x = -12;
      if (f.y < -12) f.y = h + 12; if (f.y > h + 12) f.y = -12;
      const alpha = f.baseAlpha * (0.5 + 0.5 * Math.sin(f.phase));
      const rad = f.r * 4.5;
      const grd = ffCtx.createRadialGradient(f.x, f.y, 0, f.x, f.y, rad);
      grd.addColorStop(0, "rgba(248, 232, 170, " + alpha + ")");
      grd.addColorStop(1, "rgba(248, 232, 170, 0)");
      ffCtx.fillStyle = grd; ffCtx.beginPath();
      ffCtx.arc(f.x, f.y, rad, 0, Math.PI * 2); ffCtx.fill();
    }
    requestAnimationFrame(drawFireflies);
  }

  const GLYPHS = ["❤", "❥", "♡", "❦"];
  function buildHearts() {
    if (!heartHost || prefersReduced) return;
    heartHost.innerHTML = "";
    const count = mobile ? 16 : 20;
    for (let i = 0; i < count; i++) {
      const sp = document.createElement("span");
      sp.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
      sp.style.left = Math.random() * 100 + "vw";
      sp.style.fontSize = 10 + Math.random() * 20 + "px";
      sp.style.animationDuration = 12 + Math.random() * 16 + "s";
      sp.style.animationDelay = -(Math.random() * 20) + "s";
      sp.style.opacity = String(0.35 + Math.random() * 0.45);
      heartHost.appendChild(sp);
    }
  }

  initFireflies();
  buildHearts();

  /* ---------- 4. Resize handling ---------- */
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initFireflies, 250);
  });
})();
