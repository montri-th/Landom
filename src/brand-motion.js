/**
 * Page-level motion ownership for Landom.
 *
 * The document is final and usable without this module. This controller adds
 * the finite CTA discovery cue, coordinates the owner-approved site parallax
 * override with the governed motif runtime, and gives visitors one persistent
 * pause control. Reduced-motion and print always win.
 */

const CTA_SELECTOR = "[data-cta-discovery]";
const MOTIF_SELECTOR = "lm-motif";
const MOTION_EVENT = "landom-motion-preference";
const STORAGE_KEY = "lds-motion-paused";
const CUE_CLASS = "is-cta-cue-active";
const CUE_COMPLETE = "data-cta-cue-complete";
const CUE_DURATION_MS = 540;
const CUE_CLEANUP_GRACE_MS = 100;
const CONTROLLER_KEY = Symbol.for("landometer.brandMotion.controller");

function staticController() {
  return Object.freeze({
    isPaused: () => true,
    setLabels() {},
    pause() {},
    resume() {},
    destroy() {}
  });
}

function safelyRead(win, key) {
  try {
    return win.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safelyStore(win, key, value) {
  try {
    win.localStorage.setItem(key, value);
  } catch {
    // Storage is optional; the current-page control still works.
  }
}

function isVisible(element, win) {
  if (!(element instanceof win.Element) || element.getClientRects().length === 0) return false;
  const rect = element.getBoundingClientRect();
  const viewportHeight = win.innerHeight || element.ownerDocument.documentElement.clientHeight || 0;
  const viewportWidth = win.innerWidth || element.ownerDocument.documentElement.clientWidth || 0;
  return rect.bottom > 0 && rect.top < viewportHeight && rect.right > 0 && rect.left < viewportWidth;
}

/**
 * @param {{ document?: Document, button?: HTMLButtonElement|null, statusElement?: HTMLElement|null }} [options]
 */
export function initBrandMotion(options = {}) {
  const doc = options.document ?? globalThis.document;
  if (!doc?.documentElement) return staticController();
  if (doc[CONTROLLER_KEY]) return doc[CONTROLLER_KEY];

  const win = doc.defaultView ?? globalThis.window;
  const root = doc.documentElement;
  const button = options.button ?? doc.querySelector("[data-motion-toggle]");
  const statusElement = options.statusElement ?? null;
  const reducedMotion = win.matchMedia?.("(prefers-reduced-motion: reduce)");
  const printMedia = win.matchMedia?.("print");
  const ctas = [...doc.querySelectorAll(CTA_SELECTOR)];
  const cleanups = [];
  let ctaObserver = null;
  let cueTimer = 0;
  let cuePlayed = false;
  let destroyed = false;
  let labels = {
    pause: "Pause motion",
    resume: "Resume motion",
    reduced: "Motion follows your reduced-motion setting",
    pausedStatus: "Motion paused",
    resumedStatus: "Motion resumed"
  };
  let userPaused = root.dataset.motionPaused === "true" || safelyRead(win, STORAGE_KEY) === "true";

  function systemBlocksMotion() {
    return Boolean(reducedMotion?.matches || printMedia?.matches || doc.hidden);
  }

  function clearMotifTimers({ leaveFinal = true } = {}) {
    doc.querySelectorAll(MOTIF_SELECTOR).forEach((motif) => {
      win.clearTimeout(motif._loop);
      if (leaveFinal) motif.removeAttribute("data-play");
    });
  }

  function playVisibleMotifs() {
    if (userPaused || systemBlocksMotion()) return;
    doc.querySelectorAll(MOTIF_SELECTOR).forEach((motif) => {
      if (isVisible(motif, win) && typeof motif.play === "function") motif.play();
    });
  }

  function stopCue() {
    win.clearTimeout(cueTimer);
    cueTimer = 0;
    ctas.forEach((cta) => cta.classList.remove(CUE_CLASS));
  }

  function completeCue(target) {
    if (cuePlayed || userPaused || systemBlocksMotion() || !target) return;
    cuePlayed = true;
    ctaObserver?.disconnect();
    ctas.forEach((cta) => cta.setAttribute(CUE_COMPLETE, "true"));
    target.classList.add(CUE_CLASS);
    cueTimer = win.setTimeout(() => {
      target.classList.remove(CUE_CLASS);
      cueTimer = 0;
    }, CUE_DURATION_MS + CUE_CLEANUP_GRACE_MS);
  }

  function armCue() {
    if (cuePlayed || userPaused || systemBlocksMotion() || !ctas.length) return;
    if (typeof win.IntersectionObserver !== "function") {
      const visible = ctas.find((cta) => isVisible(cta, win));
      if (visible) completeCue(visible);
      return;
    }
    if (ctaObserver) return;
    ctaObserver = new win.IntersectionObserver((entries) => {
      const entry = entries.find((candidate) => candidate.isIntersecting && isVisible(candidate.target, win));
      if (entry) completeCue(entry.target);
    }, { threshold: 0.2 });
    ctas.forEach((cta) => ctaObserver.observe(cta));
  }

  function updateButton() {
    if (!button) return;
    const reduced = Boolean(reducedMotion?.matches);
    button.disabled = reduced;
    button.setAttribute("aria-pressed", userPaused ? "true" : "false");
    button.setAttribute("aria-label", reduced ? labels.reduced : (userPaused ? labels.resume : labels.pause));
    button.setAttribute("title", reduced ? labels.reduced : (userPaused ? labels.resume : labels.pause));
    const text = button.querySelector("#motion-toggle-label") ?? button;
    text.textContent = reduced ? labels.reduced : (userPaused ? labels.resume : labels.pause);
  }

  function announce(value) {
    if (statusElement) statusElement.textContent = value;
  }

  function dispatchPreference() {
    win.dispatchEvent(new win.CustomEvent(MOTION_EVENT, {
      detail: { paused: userPaused, systemBlocked: systemBlocksMotion() }
    }));
  }

  function sync({ persist = false, announceChange = false } = {}) {
    root.dataset.motionPaused = userPaused ? "true" : "false";
    if (persist) safelyStore(win, STORAGE_KEY, userPaused ? "true" : "false");
    updateButton();
    stopCue();
    clearMotifTimers();
    if (!userPaused && !systemBlocksMotion()) {
      playVisibleMotifs();
      armCue();
    }
    dispatchPreference();
    if (announceChange) announce(userPaused ? labels.pausedStatus : labels.resumedStatus);
  }

  function onButtonClick() {
    if (reducedMotion?.matches) return;
    userPaused = !userPaused;
    sync({ persist: true, announceChange: true });
  }

  function onMediaChange() {
    sync();
  }

  function onVisibilityChange() {
    sync();
  }

  function addMediaListener(query, listener) {
    if (!query) return;
    if (query.addEventListener) {
      query.addEventListener("change", listener);
      cleanups.push(() => query.removeEventListener("change", listener));
    } else if (query.addListener) {
      query.addListener(listener);
      cleanups.push(() => query.removeListener(listener));
    }
  }

  button?.addEventListener("click", onButtonClick);
  if (button) cleanups.push(() => button.removeEventListener("click", onButtonClick));
  doc.addEventListener("visibilitychange", onVisibilityChange);
  cleanups.push(() => doc.removeEventListener("visibilitychange", onVisibilityChange));
  addMediaListener(reducedMotion, onMediaChange);
  addMediaListener(printMedia, onMediaChange);

  const controller = Object.freeze({
    isPaused() {
      return userPaused || systemBlocksMotion();
    },
    setLabels(nextLabels = {}) {
      labels = { ...labels, ...nextLabels };
      updateButton();
    },
    pause({ persist = true } = {}) {
      userPaused = true;
      sync({ persist });
    },
    resume({ persist = true } = {}) {
      userPaused = false;
      sync({ persist });
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      ctaObserver?.disconnect();
      ctaObserver = null;
      stopCue();
      clearMotifTimers();
      cleanups.splice(0).forEach((cleanup) => cleanup());
      delete doc[CONTROLLER_KEY];
    }
  });

  doc[CONTROLLER_KEY] = controller;
  sync();
  return controller;
}

export { MOTION_EVENT };
