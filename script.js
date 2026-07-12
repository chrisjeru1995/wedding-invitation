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
     One canvas of glowing fireflies + drifting hearts. On mobile both span the
     whole document and scroll with the content (position:absolute, no fixed
     layer). On desktop they cover the fixed viewport. */
  const heartHost = document.getElementById("hearts");
  const mobile = window.matchMedia("(max-width: 640px)").matches;

  function docHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      window.innerHeight
    );
  }

  const ffCanvas = document.getElementById("firefly-canvas");
  const ffCtx = ffCanvas ? ffCanvas.getContext("2d") : null;
  let fireflies = [];
  let ffRunning = false;
  let cw = 0, ch = 0;

  function sizeCanvas() {
    if (!ffCanvas || !ffCtx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cw = window.innerWidth;
    ch = mobile ? docHeight() : window.innerHeight;
    ffCanvas.style.width = cw + "px";
    ffCanvas.style.height = ch + "px";
    ffCanvas.width = cw * dpr;
    ffCanvas.height = ch * dpr;
    ffCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function makeFirefly() {
    return {
      x: Math.random() * cw, y: Math.random() * ch,
      r: 1 + Math.random() * 2.2, baseAlpha: 0.28 + Math.random() * 0.55,
      phase: Math.random() * Math.PI * 2, speed: 0.004 + Math.random() * 0.012,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
    };
  }
  function initFireflies() {
    if (!ffCanvas || prefersReduced) return;
    sizeCanvas();
    fireflies = [];
    const screens = mobile ? Math.max(1, Math.round(ch / window.innerHeight)) : 1;
    const count = (mobile ? 22 : 55) * screens;
    for (let i = 0; i < count; i++) fireflies.push(makeFirefly());
    if (!ffRunning) { ffRunning = true; requestAnimationFrame(drawFireflies); }
  }
  function drawFireflies() {
    if (!ffCtx) return;
    ffCtx.clearRect(0, 0, cw, ch);
    for (const f of fireflies) {
      f.phase += f.speed * 16; f.x += f.vx; f.y += f.vy;
      if (f.x < -12) f.x = cw + 12; if (f.x > cw + 12) f.x = -12;
      if (f.y < -12) f.y = ch + 12; if (f.y > ch + 12) f.y = -12;
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
    if (mobile) {
      const h = docHeight();
      heartHost.style.height = h + "px";
      const screens = Math.max(1, Math.round(h / window.innerHeight));
      const count = 7 * screens;
      for (let i = 0; i < count; i++) {
        const sp = document.createElement("span");
        sp.className = "heart-bob";
        sp.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        sp.style.left = Math.random() * 100 + "%";
        sp.style.top = Math.random() * 100 + "%";
        sp.style.fontSize = 12 + Math.random() * 18 + "px";
        sp.style.animationDuration = 5 + Math.random() * 6 + "s";
        sp.style.animationDelay = -Math.random() * 8 + "s";
        heartHost.appendChild(sp);
      }
    } else {
      for (let i = 0; i < 20; i++) {
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
  }

  function sizeMobileBackground() {
    if (!mobile) return;
    const h = docHeight();
    const bg = document.querySelector(".bg-animate");
    const scrim = document.querySelector(".bg-scrim");
    if (bg) bg.style.height = h + "px";
    if (scrim) scrim.style.height = h + "px";
  }

  function initAmbient() {
    sizeMobileBackground();
    initFireflies();
    buildHearts();
  }
  initAmbient();
  if (mobile) {
    window.addEventListener("load", initAmbient);
    setTimeout(initAmbient, 900);
  }

  /* ---------- 4. Resize handling ---------- */
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initAmbient, 250);
  });
})();
