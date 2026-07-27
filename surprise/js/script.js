/**
 * ============================================================
 *  script.js — site logic
 * ------------------------------------------------------------
 *  Nothing in this file should need editing to personalize the
 *  site — all content lives in js/config.js. This file only:
 *    1. Renders that content into the empty containers in index.html
 *    2. Wires up interactions (scroll reveals, lightbox, music,
 *       typewriter text, countdown, the confetti/fireworks burst)
 * ============================================================ */

const CFG = SURPRISE_CONFIG;

/* ---------------------------------------------------------------
 * Small helpers
 * ------------------------------------------------------------- */
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function withName(str) {
  return String(str || "").replace(/\{\{\s*name\s*\}\}/gi, CFG.friendName || "");
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = window.setTimeout(() => fn(...args), wait);
  };
}

function getCssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#ffffff";
}

/* Applies js/config.js theme{} onto the CSS custom properties in style.css */
function applyTheme() {
  const map = {
    paper: "--color-paper",
    paperDeep: "--color-paper-deep",
    dusk: "--color-dusk",
    lavender: "--color-lavender",
    plum: "--color-plum",
    plumSoft: "--color-plum-soft",
    gold: "--color-gold",
    goldLight: "--color-gold-light",
    glow: "--color-glow",
  };
  Object.entries(CFG.theme || {}).forEach(([key, value]) => {
    if (map[key] && value) document.documentElement.style.setProperty(map[key], value);
  });
}

/* =================================================================
 * RENDER — turn config.js content into DOM
 * ================================================================= */

function renderMeta() {
  if (CFG.meta?.pageTitle) document.title = CFG.meta.pageTitle;
  const descTag = qs('meta[name="description"]');
  if (descTag && CFG.meta?.description) descTag.setAttribute("content", CFG.meta.description);
}

function renderLanding() {
  qs("#landingEyebrow").textContent = withName(CFG.landing.eyebrow);
  qs("#landingHeading").textContent = withName(CFG.landing.heading);
  qs("#landingSub").textContent = withName(CFG.landing.subheading);
  qs("#openSurpriseLabel").textContent = CFG.landing.buttonLabel;
}

function renderTimeline() {
  qs("#timelineHeading").textContent = withName(CFG.timeline.heading);
  qs("#timelineSub").textContent = withName(CFG.timeline.subheading);
  const rail = qs("#timelineRail");
  rail.innerHTML = CFG.timeline.items.map((item, i) => `
    <article class="timeline-item reveal ${i % 2 === 0 ? "reveal-left" : "reveal-right"}">
      <div class="timeline-card glass-card">
        <div class="timeline-photo">
          <img src="${escapeHtml(item.photo)}" alt="${escapeHtml(item.title || "")}" loading="lazy" />
        </div>
        <div class="timeline-text-wrap">
          <p class="timeline-date">${escapeHtml(item.date || "")}</p>
          <h3 class="timeline-title">${escapeHtml(item.title || "")}</h3>
          <p class="timeline-text">${escapeHtml(withName(item.text || ""))}</p>
        </div>
      </div>
    </article>
  `).join("");
}

function renderGallery() {
  qs("#galleryHeading").textContent = withName(CFG.gallery.heading);
  qs("#gallerySub").textContent = withName(CFG.gallery.subheading);
  const grid = qs("#masonryGrid");
  grid.innerHTML = CFG.gallery.items.map((item, i) => `
    <div class="masonry-item reveal" data-index="${i}" data-group="gallery" tabindex="0" role="button" aria-label="Open photo ${i + 1} of ${CFG.gallery.items.length}">
      <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt || "")}" loading="lazy" />
    </div>
  `).join("");
}

/* Filled in by renderWishes(), read by setupWishVideos() — index-matched
   to the .wish-item elements so hover/tap can look up the right video. */
let wishVideos = [];

function renderWishes() {
  qs("#wishesHeading").textContent = withName(CFG.wishes.heading);
  const list = qs("#wishesList");

  wishVideos = CFG.wishes.items.map((raw) => {
    const video = typeof raw === "string" ? null : raw.video;
    return video && (video.id || video.src) ? video : null;
  });

  list.innerHTML = CFG.wishes.items.map((raw, i) => {
    const hasVideo = Boolean(wishVideos[i]);
    const playIcon = hasVideo
      ? `<span class="wish-play-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>`
      : "";
    return `
      <div class="wish-item${hasVideo ? " has-video" : ""}" data-index="${i}"${hasVideo ? ' tabindex="0" role="button" aria-label="Play video for this wish"' : ""}>
        <p class="wish" data-index="${i}"><span class="wish-text"></span>${playIcon}</p>
        <div class="wish-video-wrap"></div>
      </div>
    `;
  }).join("");
}

/* Renders just the 16:9 frame (facade-to-load YouTube, or a native
   <video>) — shared by the main Video section and the quiz section. */
function renderVideoFrameHTML(v, index) {
  if (!v) return "";
  if (v.type === "youtube" && v.id) {
    const thumb = `https://img.youtube.com/vi/${encodeURIComponent(v.id)}/hqdefault.jpg`;
    return `
      <div class="video-frame">
        <div class="video-facade" style="background-image:url('${thumb}')" data-yt="${escapeHtml(v.id)}" data-index="${index}" role="button" tabindex="0" aria-label="Play video">
          <span class="video-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
        </div>
      </div>`;
  }
  if (v.type === "local" && v.src) {
    return `
      <div class="video-frame">
        <video controls preload="none" playsinline ${v.poster ? `poster="${escapeHtml(v.poster)}"` : ""}>
          <source src="${escapeHtml(v.src)}" />
        </video>
      </div>`;
  }
  return "";
}

/* Renders an immediately-playing frame — muted + looping, no click needed.
   Used only for the wishes hover/tap preview, where the interaction
   itself (hover or tap) is already the "play" gesture. Muted because
   browsers won't reliably autoplay video with sound. */
function renderWishVideoHTML(v) {
  if (!v) return "";
  if (v.type === "youtube" && v.id) {
    const id = encodeURIComponent(v.id);
    return `
      <div class="video-frame">
        <iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&rel=0&playsinline=1" title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
      </div>`;
  }
  if (v.type === "local" && v.src) {
    return `
      <div class="video-frame">
        <video autoplay muted loop playsinline controls ${v.poster ? `poster="${escapeHtml(v.poster)}"` : ""}>
          <source src="${escapeHtml(v.src)}" />
        </video>
      </div>`;
  }
  return "";
}

function renderVideo() {
  qs("#videoHeading").textContent = withName(CFG.video.heading);
  qs("#videoSub").textContent = withName(CFG.video.subheading);
  const grid = qs("#videoGrid");
  const items = CFG.video.items || [];

  if (!items.length) {
    grid.innerHTML = `<div class="video-empty">Add a video in <strong>js/config.js</strong> (a YouTube link or a local file) and it'll appear here.</div>`;
    return;
  }

  grid.innerHTML = items.map((v, i) => {
    const frame = renderVideoFrameHTML(v, i);
    const caption = v.caption ? `<p class="video-caption">${escapeHtml(withName(v.caption))}</p>` : "";
    return `<div class="video-card">${frame}${caption}</div>`;
  }).join("");
}

/* ---- Quiz: small video + a question that gates the rest of the page ---- */
function renderQuiz() {
  const section = qs("#quiz");
  const cfg = CFG.quiz;

  if (!cfg || cfg.enabled === false) {
    section.style.display = "none";
    section.dataset.disabled = "true";
    qs("#afterQuiz").classList.remove("locked"); // nothing left to unlock it
    return;
  }

  qs("#quizHeading").textContent = withName(cfg.heading);
  qs("#quizSub").textContent = withName(cfg.subheading);
  qs("#quizQuestion").textContent = withName(cfg.question);
  qs("#quizVideoWrap").innerHTML = renderVideoFrameHTML(cfg.video, 0);
  qs("#quizAnswerInput").placeholder = cfg.placeholder || "Type your answer\u2026";
  qs("#quizSubmitBtn").textContent = cfg.submitLabel || "Submit";
  qs("#quizContinueBtn").textContent = cfg.continueLabel || "Continue";
}

function renderFunFacts() {
  qs("#factsHeading").textContent = withName(CFG.funFacts.heading);
  const grid = qs("#factsGrid");
  grid.innerHTML = CFG.funFacts.items.map((f, i) => `
    <div class="fact-card glass-card reveal" style="transition-delay:${Math.min(i * 70, 420)}ms">
      <div class="fact-icon" aria-hidden="true">${f.icon || ""}</div>
      <p class="fact-label">${escapeHtml(f.label || "")}</p>
      <p class="fact-value">${escapeHtml(withName(f.value || ""))}</p>
    </div>
  `).join("");
}

function renderMemoryWall() {
  qs("#wallHeading").textContent = withName(CFG.memoryWall.heading);
  qs("#wallSub").textContent = withName(CFG.memoryWall.subheading);
  const wall = qs("#wallCollage");
  wall.innerHTML = CFG.memoryWall.items.map((item, i) => `
    <div class="wall-photo-wrap reveal" style="transition-delay:${Math.min(i * 80, 400)}ms">
      <div class="wall-photo" data-index="${i}" data-group="wall" tabindex="0" role="button" aria-label="Open photo ${i + 1} of ${CFG.memoryWall.items.length}">
        <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt || "")}" loading="lazy" />
      </div>
    </div>
  `).join("");
}

let countdownInterval = null;
function renderCountdown() {
  const section = qs("#countdown");
  const cfg = CFG.countdown || {};

  if (!cfg.enabled) {
    section.style.display = "none";
    section.dataset.disabled = "true";
    return;
  }

  qs("#countdownHeading").textContent = withName(cfg.heading);
  qs("#countdownLabel").textContent = withName(cfg.label);
  const grid = qs("#countdownGrid");
  const units = ["days", "hours", "minutes", "seconds"];
  grid.innerHTML = units.map((u) => `
    <div class="countdown-unit glass-card">
      <div class="countdown-value" data-unit="${u}">00</div>
      <div class="countdown-unit-label">${u}</div>
    </div>
  `).join("");

  const target = new Date(cfg.targetDate).getTime();
  if (Number.isNaN(target)) {
    grid.innerHTML = `<p class="countdown-done">Set a valid targetDate in js/config.js</p>`;
    return;
  }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      grid.innerHTML = `<p class="countdown-done">It's here! \u{1F389}</p>`;
      clearInterval(countdownInterval);
      return;
    }
    const set = (unit, val) => {
      const el = grid.querySelector(`[data-unit="${unit}"]`);
      if (el) el.textContent = String(val).padStart(2, "0");
    };
    set("days", Math.floor(diff / 86400000));
    set("hours", Math.floor((diff % 86400000) / 3600000));
    set("minutes", Math.floor((diff % 3600000) / 60000));
    set("seconds", Math.floor((diff % 60000) / 1000));
  }

  tick();
  countdownInterval = setInterval(tick, 1000);
}

function renderCelebration() {
  qs("#celebrateHeading").textContent = withName(CFG.celebration.heading);
  qs("#celebrateSub").textContent = withName(CFG.celebration.subheading);
}

function renderLetter() {
  qs("#letterHeading").textContent = withName(CFG.finalLetter.heading);
  const body = qs("#letterBody");
  body.innerHTML = CFG.finalLetter.paragraphs.map((_, i) => `<p data-index="${i}"><span class="p-text"></span></p>`).join("");
  qs("#letterSignature").textContent = withName(CFG.finalLetter.signature);
}

function renderFinal() {
  qs("#finalHeading").textContent = withName(CFG.final.heading);
  qs("#finalSub").textContent = withName(CFG.final.subheading);
  qs("#footerNote").textContent = withName(CFG.final.footerNote);
}

/* Runs whenever the set of reachable sections changes (initial load,
   landing opened, quiz unlocked) — safe to call more than once. */
let landingOpened = false;

function renderNav() {
  const rail = qs("#sideNav");
  const afterQuiz = qs("#afterQuiz");
  const isLocked = (section) => afterQuiz && afterQuiz.classList.contains("locked") && afterQuiz.contains(section);

  const items = (CFG.nav || []).filter((item) => {
    const section = document.getElementById(item.id);
    if (!section || section.dataset.disabled === "true") return false;
    if (isLocked(section)) return false;
    return true;
  });

  const tabAttr = landingOpened ? "" : ' tabindex="-1"';
  rail.innerHTML = items.map((item) => `
    <a class="side-nav-dot" href="#${item.id}" data-target="${item.id}" aria-label="${escapeHtml(item.label)}"${tabAttr}>
      <span class="side-nav-label">${escapeHtml(item.label)}</span>
    </a>
  `).join("");
}

/* =================================================================
 * INTERACTIONS
 * ================================================================= */

/* ---- Opening sequence ---- */
function finishOpening(landing) {
  document.documentElement.classList.remove("gate-locked");
  document.body.classList.remove("gate-locked");
  landing.style.display = "none";
  landingOpened = true;
  qs("#sideNav").classList.add("is-visible");
  renderNav();
  setupActiveNav();
  qs("#timeline").scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

function setupOpenSequence() {
  const btn = qs("#openSurpriseBtn");
  const landing = qs("#landing");
  const envelope = qs("#envelopeOverlay");

  btn.addEventListener("click", () => {
    startMusic();
    landing.classList.add("is-opening");

    if (prefersReducedMotion() || !envelope) {
      window.setTimeout(() => finishOpening(landing), 400);
      return;
    }

    // The envelope's own CSS drives the internal timing (flap opens at a
    // 0.5s delay, the heart rises at 1.3s) — this just brackets the whole
    // moment: show it, let it play out, then fade it away.
    envelope.classList.add("is-active");
    window.setTimeout(() => envelope.classList.add("is-leaving"), 2400);
    window.setTimeout(() => {
      envelope.classList.remove("is-active", "is-leaving");
      finishOpening(landing);
    }, 3050);
  });
}

/* ---- Button ripple, delegated to every .btn / .control-btn ---- */
function setupRipple() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn, .control-btn");
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.6;
    const span = document.createElement("span");
    span.className = "ripple";
    const x = (e.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
    const y = (e.clientY || rect.top + rect.height / 2) - rect.top - size / 2;
    span.style.width = span.style.height = `${size}px`;
    span.style.left = `${x}px`;
    span.style.top = `${y}px`;
    btn.appendChild(span);
    span.addEventListener("animationend", () => span.remove());
  });
}

/* ---- Generic scroll reveal for timeline / gallery / facts / wall ---- */
function setupScrollReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
  qsa(".reveal").forEach((el) => io.observe(el));
}

/* ---- Active section highlight in the floating nav ----
   Called again each time renderNav() rebuilds the dots (landing open,
   quiz unlocked), so any previous observer needs disconnecting first. */
let activeNavObserver = null;

function setupActiveNav() {
  const dots = qsa(".side-nav-dot");
  if (activeNavObserver) {
    activeNavObserver.disconnect();
    activeNavObserver = null;
  }
  if (!dots.length) return;

  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById(dot.dataset.target)?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    });
  });

  const sections = dots.map((d) => document.getElementById(d.dataset.target)).filter(Boolean);
  activeNavObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      currentVisibleSectionId = entry.target.id;
      switchMusicForSection(entry.target.id);
      const dot = qs(`.side-nav-dot[data-target="${entry.target.id}"]`);
      if (!dot) return;
      dots.forEach((d) => d.classList.remove("is-active"));
      dot.classList.add("is-active");
    });
  }, { threshold: 0.5 });
  sections.forEach((s) => activeNavObserver.observe(s));
}

/* ---- Top progress ribbon ---- */
function setupProgressRibbon() {
  const fill = qs("#progressFill");
  function update() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height > 0 ? (scrollTop / height) * 100 : 0;
    fill.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  }
  document.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  update();
}

/* ---- Ambient particle field (whole page, subtle) ---- */
function setupParticles() {
  const field = qs("#particleField");
  if (prefersReducedMotion()) return;
  const count = window.innerWidth < 640 ? 14 : 22;
  let html = "";
  for (let i = 0; i < count; i++) {
    const size = (Math.random() * 8 + 4).toFixed(1);
    const left = (Math.random() * 100).toFixed(1);
    const duration = (Math.random() * 10 + 14).toFixed(1);
    const delay = (Math.random() * 14).toFixed(1);
    const driftX = (Math.random() * 120 - 60).toFixed(0);
    html += `<span class="particle" style="width:${size}px;height:${size}px;left:${left}%;--drift-x:${driftX}px;animation-duration:${duration}s;animation-delay:-${delay}s;"></span>`;
  }
  field.innerHTML = html;
}

/* ---- Denser floating hearts, confined to the landing screen ---- */
function setupLandingHearts() {
  const field = qs("#landingHearts");
  if (prefersReducedMotion()) return;
  const hearts = ["\u2764\uFE0F", "\uD83D\uDC96", "\uD83D\uDC9C"];
  let html = "";
  for (let i = 0; i < 12; i++) {
    const left = (Math.random() * 100).toFixed(1);
    const duration = (Math.random() * 6 + 9).toFixed(1);
    const delay = (Math.random() * 10).toFixed(1);
    const size = (Math.random() * 0.7 + 0.9).toFixed(2);
    html += `<span class="landing-heart" style="left:${left}%;font-size:${size}rem;animation-duration:${duration}s;animation-delay:-${delay}s;">${hearts[i % hearts.length]}</span>`;
  }
  field.innerHTML = html;
}

/* ---- Background music ----
   Supports one track per section. Scrolling into a section with its own
   track crossfades to it; scrolling into a section with none configured
   (or with `enabled: false`) just leaves whatever's already playing
   running on loop. The toggle button stays hidden until a track has
   actually been confirmed playable, so it never sits there doing nothing. */
let musicAudioEl = null;
let musicBtnEl = null;
let musicReady = false;
let musicUserWantsPlaying = false;
let currentMusicSectionId = null;
let currentVisibleSectionId = null;
let musicSwitchToken = 0;
let musicSwitchDebounceTimer = null;

function getTrackForSection(sectionId) {
  const cfg = CFG.music || {};
  const entry = cfg.tracks && cfg.tracks[sectionId];
  if (entry && entry.enabled !== false && entry.src) return entry;
  // Nothing has ever played yet — fall back to the default track so the
  // site still has music out of the box even with no per-section entries.
  if (!currentMusicSectionId && cfg.default && cfg.default.enabled !== false && cfg.default.src) {
    return cfg.default;
  }
  return null;
}

function fadeAudioTo(audio, target, duration, onDone) {
  const start = audio.volume;
  const startTime = performance.now();
  function step(ts) {
    const t = Math.max(0, Math.min(1, (ts - startTime) / duration));
    audio.volume = Math.max(0, Math.min(1, start + (target - start) * t));
    if (t < 1) requestAnimationFrame(step);
    else if (onDone) onDone();
  }
  requestAnimationFrame(step);
}

function switchMusicForSection(sectionId) {
  if (!musicUserWantsPlaying) return;
  if (!getTrackForSection(sectionId)) return; // no track assigned here — let the current one keep looping
  if (sectionId === currentMusicSectionId && musicAudioEl && !musicAudioEl.paused) return;

  // Wait for the section to hold still for a beat before committing to a
  // switch — otherwise scrolling past it quickly (e.g. the auto-scroll into
  // Gallery right after the quiz unlocks) starts a fade/load that gets
  // superseded before it finishes, so its track never plays at all.
  window.clearTimeout(musicSwitchDebounceTimer);
  musicSwitchDebounceTimer = window.setTimeout(() => commitMusicSwitch(sectionId), 250);
}

function commitMusicSwitch(sectionId) {
  const track = getTrackForSection(sectionId);
  if (!track || !musicUserWantsPlaying) return;

  const audio = musicAudioEl;
  const token = ++musicSwitchToken;

  const playNewTrack = () => {
    if (token !== musicSwitchToken) return; // superseded by a newer switch
    audio.src = track.src;
    audio.load();
    audio.volume = 0;
    audio.play().then(() => {
      if (token !== musicSwitchToken) return;
      currentMusicSectionId = sectionId;
      musicReady = true;
      musicBtnEl.classList.remove("is-hidden");
      musicBtnEl.removeAttribute("tabindex");
      musicBtnEl.classList.add("is-playing");
      musicBtnEl.setAttribute("aria-pressed", "true");
      musicBtnEl.setAttribute("aria-label", "Pause background music");
      fadeAudioTo(audio, 0.55, 400);
    }).catch(() => { /* autoplay blocked or file missing — previous track (if any) keeps playing */ });
  };

  if (musicReady && !audio.paused) {
    fadeAudioTo(audio, 0, 300, playNewTrack);
  } else {
    playNewTrack();
  }
}

function setupMusic() {
  const audio = qs("#bgMusic");
  const btn = qs("#musicToggle");
  const cfg = CFG.music || {};
  musicAudioEl = audio;
  musicBtnEl = btn;

  if (cfg.enabled === false) return;
  if (!cfg.default?.src && !(cfg.tracks && Object.keys(cfg.tracks).length)) return;

  audio.volume = 0.55;
  audio.addEventListener("error", () => {
    console.info(`Music track not found or couldn't play: "${audio.src}". Check the path in js/config.js.`);
  });

  btn.addEventListener("click", () => {
    if (musicUserWantsPlaying && !audio.paused) {
      pauseMusic();
    } else if (currentMusicSectionId && audio.src) {
      // Already loaded a track before (just paused) — resume in place
      // rather than restarting it from the beginning.
      musicUserWantsPlaying = true;
      audio.play().then(() => {
        btn.classList.add("is-playing");
        btn.setAttribute("aria-pressed", "true");
        btn.setAttribute("aria-label", "Pause background music");
      }).catch(() => {});
    } else {
      startMusic();
    }
  });

  // Browsers block audio-with-sound before any interaction on a genuinely
  // first visit, so this will silently fail for most people — that's
  // expected, not a bug. The listener below catches the very first tap,
  // click, or key press anywhere on the page (not just the button) and
  // starts music at that exact moment instead, which is as close to
  // "plays the second the site opens" as any browser allows.
  startMusic();
  const startOnFirstInteraction = () => {
    if (!musicReady) startMusic();
  };
  ["pointerdown", "keydown", "touchstart"].forEach((evt) =>
    document.addEventListener(evt, startOnFirstInteraction, { once: true, passive: true })
  );
}

function startMusic() {
  musicUserWantsPlaying = true;
  switchMusicForSection(currentVisibleSectionId || "landing");
}

function pauseMusic() {
  musicUserWantsPlaying = false;
  if (musicAudioEl) musicAudioEl.pause();
  musicBtnEl.classList.remove("is-playing");
  musicBtnEl.setAttribute("aria-pressed", "false");
  musicBtnEl.setAttribute("aria-label", "Play background music");
}

/* ---- Lightbox (shared by the gallery and the memory wall) ---- */
let lightboxState = { group: null, index: 0 };
let lastFocusedEl = null;

function getLightboxItems(group) {
  if (group === "gallery") return CFG.gallery.items;
  if (group === "wall") return CFG.memoryWall.items;
  return [];
}

function updateLightbox() {
  const items = getLightboxItems(lightboxState.group);
  const item = items[lightboxState.index];
  if (!item) return;
  qs("#lightboxImg").src = item.src;
  qs("#lightboxImg").alt = item.alt || "";
  qs("#lightboxCaption").textContent = item.alt || "";
}

function openLightbox(group, index) {
  lastFocusedEl = document.activeElement;
  lightboxState = { group, index };
  updateLightbox();
  const lb = qs("#lightbox");
  lb.hidden = false;
  requestAnimationFrame(() => {
    lb.classList.add("is-open");
    qs("#lightboxClose").focus();
  });
  document.addEventListener("keydown", onLightboxKeydown);
}

function closeLightbox() {
  const lb = qs("#lightbox");
  lb.classList.remove("is-open");
  document.removeEventListener("keydown", onLightboxKeydown);
  window.setTimeout(() => { lb.hidden = true; }, 350);
  if (lastFocusedEl) lastFocusedEl.focus();
}

function stepLightbox(delta) {
  const items = getLightboxItems(lightboxState.group);
  if (!items.length) return;
  lightboxState.index = (lightboxState.index + delta + items.length) % items.length;
  updateLightbox();
}

function onLightboxKeydown(e) {
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") stepLightbox(-1);
  if (e.key === "ArrowRight") stepLightbox(1);
}

function setupLightbox() {
  document.addEventListener("click", (e) => {
    const item = e.target.closest(".masonry-item, .wall-photo");
    if (item) openLightbox(item.dataset.group, Number(item.dataset.index));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const item = e.target.closest?.(".masonry-item, .wall-photo");
    if (item) {
      e.preventDefault();
      openLightbox(item.dataset.group, Number(item.dataset.index));
    }
  });

  qs("#lightboxClose").addEventListener("click", closeLightbox);
  qs("#lightboxPrev").addEventListener("click", () => stepLightbox(-1));
  qs("#lightboxNext").addEventListener("click", () => stepLightbox(1));
  qs("#lightbox").addEventListener("click", (e) => {
    if (e.target.id === "lightbox") closeLightbox();
  });

  let touchStartX = null;
  const fig = qs(".lightbox-figure");
  fig.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  fig.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) stepLightbox(dx > 0 ? -1 : 1);
    touchStartX = null;
  }, { passive: true });
}

/* ---- Video: click-to-load YouTube facade (keeps the page light) ---- */
function loadYouTubeFacade(facade) {
  const id = facade.dataset.yt;
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
  iframe.title = "Video";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  facade.replaceWith(iframe);
}

function setupVideoFacadesIn(container) {
  if (!container) return;
  container.addEventListener("click", (e) => {
    const facade = e.target.closest(".video-facade");
    if (facade) loadYouTubeFacade(facade);
  });
  container.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("video-facade")) {
      e.preventDefault();
      loadYouTubeFacade(e.target);
    }
  });
}

function setupVideoFacades() {
  setupVideoFacadesIn(qs("#videoGrid"));
  setupVideoFacadesIn(qs("#quizVideoWrap"));
}

/* Loose text matching so "College!", "college", and "  College " all
   count as the same answer — case, punctuation, and spacing don't matter. */
function normalizeAnswer(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isAnswerCorrect(typed, cfg) {
  const normalizedTyped = normalizeAnswer(typed);
  if (!normalizedTyped) return false;
  return (cfg.correctAnswers || []).some((ans) => normalizeAnswer(ans) === normalizedTyped);
}

/* ---- Quiz answer handling ----
   Free-text answer, not multiple choice. The Continue button always
   appears after submitting — right or wrong — so nobody gets stuck.
   The message only appears when the answer matches; there's no reveal
   of the correct answer and no "wrong" message at all. */
function setupQuiz() {
  const section = qs("#quiz");
  const cfg = CFG.quiz;
  if (!cfg || section.dataset.disabled === "true") return;

  const form = qs("#quizAnswerForm");
  const input = qs("#quizAnswerInput");
  const submitBtn = qs("#quizSubmitBtn");
  const feedback = qs("#quizFeedback");
  const message = qs("#quizMessage");
  let answered = false;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (answered || !input.value.trim()) return;
    answered = true;

    input.disabled = true;
    submitBtn.disabled = true;

    if (isAnswerCorrect(input.value, cfg)) {
      message.textContent = withName(cfg.correctMessage);
      message.hidden = false;
    }

    feedback.hidden = false;
    requestAnimationFrame(() => feedback.classList.add("is-visible"));
  });

  qs("#quizContinueBtn").addEventListener("click", unlockAfterQuiz);
}

function unlockAfterQuiz() {
  const wrap = qs("#afterQuiz");
  if (!wrap || !wrap.classList.contains("locked")) return;
  wrap.classList.remove("locked");
  renderNav();
  setupActiveNav();
  qs("#gallery")?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

/* ---- Back to top ---- */
function setupBackToTop() {
  const btn = qs("#backToTop");
  const landing = qs("#landing");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const hide = entry.isIntersecting;
      btn.classList.toggle("is-hidden", hide);
      if (hide) btn.setAttribute("tabindex", "-1");
      else btn.removeAttribute("tabindex");
    });
  }, { threshold: 0 });
  io.observe(landing);
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  });
}

/* ---- Typewriter helper, shared by wishes and the final letter ---- */
function typeText(el, text, onDone, speed = 28) {
  if (prefersReducedMotion()) {
    el.textContent = text;
    if (onDone) onDone();
    return;
  }
  let i = 0;
  (function step() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      window.setTimeout(step, speed);
    } else if (onDone) {
      onDone();
    }
  })();
}

function setupTypewriterWishes() {
  const section = qs("#wishes");
  const wishEls = qsa(".wish", section);
  if (!wishEls.length) return;
  let started = false;

  function typeNext(i) {
    if (i >= wishEls.length) return;
    const el = wishEls[i];
    const span = qs(".wish-text", el);
    const raw = CFG.wishes.items[i];
    const text = typeof raw === "string" ? raw : (raw?.text || "");
    typeText(span, withName(text), () => {
      el.classList.add("is-done");
      window.setTimeout(() => typeNext(i + 1), 500);
    });
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !started) {
        started = true;
        typeNext(0);
        io.disconnect();
      }
    });
  }, { threshold: 0.5 });
  io.observe(section);
}

/* ---- Wish videos: hover to play (desktop), tap to toggle (touch) ----
   Only one plays at a time, and only once that wish has finished typing
   (so a video never pops in before there's anything to read yet). */
let openWishItem = null;

function wishIsReady(item) {
  return qs(".wish", item)?.classList.contains("is-done");
}

function openWishVideo(item) {
  const video = wishVideos[Number(item.dataset.index)];
  if (!video || !wishIsReady(item)) return;
  if (openWishItem && openWishItem !== item) closeWishVideo(openWishItem);

  qs(".wish-video-wrap", item).innerHTML = renderWishVideoHTML(video);
  item.classList.add("wish-video-open");
  openWishItem = item;
}

function closeWishVideo(item) {
  const wrap = qs(".wish-video-wrap", item);
  if (wrap) wrap.innerHTML = ""; // stops playback for both <video> and the iframe
  item.classList.remove("wish-video-open");
  if (openWishItem === item) openWishItem = null;
}

function setupWishVideos() {
  const items = qsa(".wish-item.has-video", qs("#wishesList"));
  if (!items.length) return;

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  items.forEach((item) => {
    if (canHover) {
      item.addEventListener("mouseenter", () => openWishVideo(item));
      item.addEventListener("mouseleave", () => closeWishVideo(item));
      item.addEventListener("focusin", () => openWishVideo(item));
      item.addEventListener("focusout", () => closeWishVideo(item));
    } else {
      item.addEventListener("click", (e) => {
        if (e.target.closest(".wish-video-wrap")) return; // let video controls work normally
        item.classList.contains("wish-video-open") ? closeWishVideo(item) : openWishVideo(item);
      });
    }
  });
}


function setupTypewriterLetter() {
  const paras = qsa("#letterBody p");
  if (!paras.length) return;
  let started = false;

  function typeNext(i) {
    if (i >= paras.length) return;
    const p = paras[i];
    const span = qs(".p-text", p);
    const caret = document.createElement("span");
    caret.className = "caret";
    p.appendChild(caret);
    typeText(span, withName(CFG.finalLetter.paragraphs[i] || ""), () => {
      caret.remove();
      window.setTimeout(() => typeNext(i + 1), 350);
    }, 22);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !started) {
        started = true;
        typeNext(0);
        io.disconnect();
      }
    });
  }, { threshold: 0.35 });
  io.observe(qs("#letter"));
}

/* ---- Celebration: confetti + fireworks + floating hearts ----
   Fires once, the first time the "celebrate" section reaches the
   middle of the screen. Uses a single canvas so hundreds of
   particles stay cheap instead of hundreds of DOM nodes. */
function resizeCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  canvas.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
}

function makeConfetti(w, h, colors) {
  return {
    x: Math.random() * w,
    y: -20 - Math.random() * h * 0.4,
    vx: (Math.random() - 0.5) * 2.2,
    vy: 2 + Math.random() * 2.4,
    size: 6 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * Math.PI,
    rotSpeed: (Math.random() - 0.5) * 0.25,
    life: 0,
    maxLife: 260 + Math.random() * 80,
    dead: false,
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.02;
      this.rotation += this.rotSpeed;
      this.life++;
      if (this.life > this.maxLife || this.y > h + 40) this.dead = true;
    },
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = Math.max(0, 1 - this.life / this.maxLife);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 3, this.size, this.size * 0.6);
      ctx.restore();
    },
  };
}

function makeHeartParticle(w, h) {
  return {
    x: Math.random() * w,
    y: h + 20 + Math.random() * 100,
    vy: -(0.6 + Math.random() * 0.8),
    vx: (Math.random() - 0.5) * 0.4,
    size: 14 + Math.random() * 14,
    sway: Math.random() * Math.PI * 2,
    life: 0,
    maxLife: 340 + Math.random() * 140,
    dead: false,
    update() {
      this.life++;
      this.sway += 0.04;
      this.x += this.vx + Math.sin(this.sway) * 0.5;
      this.y += this.vy;
      if (this.life > this.maxLife || this.y < -40) this.dead = true;
    },
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - this.life / this.maxLife) * 0.9;
      ctx.font = `${this.size}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("\u2764\uFE0F", this.x, this.y);
      ctx.restore();
    },
  };
}

function makeFirework(x, y, colors) {
  const angle = Math.random() * Math.PI * 2;
  const speed = 1.5 + Math.random() * 3.5;
  return {
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size: 2 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    life: 0,
    maxLife: 50 + Math.random() * 30,
    dead: false,
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.985;
      this.vy = this.vy * 0.985 + 0.045;
      this.life++;
      if (this.life > this.maxLife) this.dead = true;
    },
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - this.life / this.maxLife);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  };
}

function launchCelebration(canvas) {
  if (prefersReducedMotion()) return; // respect the user's motion preference entirely

  const ctx = canvas.getContext("2d");
  resizeCanvas(canvas);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  const colors = [getCssVar("--color-dusk"), getCssVar("--color-lavender"), getCssVar("--color-gold"), getCssVar("--color-gold-light"), "#ffffff"];
  const particles = [];

  for (let i = 0; i < 90; i++) particles.push(makeConfetti(w, h, colors));
  for (let i = 0; i < 16; i++) particles.push(makeHeartParticle(w, h));

  [0, 500, 1000, 1500].forEach((delay) => {
    window.setTimeout(() => {
      const x = w * (0.25 + Math.random() * 0.5);
      const y = h * (0.25 + Math.random() * 0.35);
      for (let i = 0; i < 46; i++) particles.push(makeFirework(x, y, colors));
    }, delay);
  });

  let start = null;
  const minDuration = 5800;
  function frame(ts) {
    if (start === null) start = ts;
    const elapsed = ts - start;
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    particles.forEach((p) => { p.update(); p.draw(ctx); });
    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].dead) particles.splice(i, 1);
    }
    if (elapsed < minDuration && particles.length) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    }
  }
  requestAnimationFrame(frame);
}

function setupCelebrationTrigger() {
  const target = qs("#celebrate");
  const canvas = qs("#effectsCanvas");
  if (!target || !canvas) return;
  let fired = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !fired) {
        fired = true;
        launchCelebration(canvas);
        io.disconnect();
      }
    });
  }, { threshold: 0.4 });
  io.observe(target);
}

/* =================================================================
 * INIT
 * ================================================================= */
function init() {
  applyTheme();

  renderMeta();
  renderLanding();
  renderTimeline();
  renderQuiz();
  renderGallery();
  renderWishes();
  renderVideo();
  renderFunFacts();
  renderMemoryWall();
  renderCountdown();
  renderCelebration();
  renderLetter();
  renderFinal();
  renderNav(); // last: needs to know which sections ended up hidden/locked

  setupOpenSequence();
  setupRipple();
  setupScrollReveal();
  setupActiveNav();
  setupProgressRibbon();
  setupParticles();
  setupLandingHearts();
  setupMusic();
  setupLightbox();
  setupVideoFacades();
  setupQuiz();
  setupBackToTop();
  setupTypewriterWishes();
  setupWishVideos();
  setupTypewriterLetter();
  setupCelebrationTrigger();

  window.addEventListener("resize", debounce(() => resizeCanvas(qs("#effectsCanvas")), 150));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
