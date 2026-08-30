/**
 * Riddim approach-motion adapter (candidate contract).
 *
 * Source HTML and source CSS must render every target in its final state. This
 * module only arms explicit, eligible, below-viewport `[data-approach]` units
 * while `html.lds-motion-ready` is present. A missing API, lifecycle edge case,
 * or runtime error always resolves to the final, fully operable state.
 */

const TARGET_SELECTOR = "[data-approach]";
const SEQUENCE_SELECTOR = "[data-approach-sequence]";

const ROOT_PENDING = "lds-motion-pending";
const ROOT_READY = "lds-motion-ready";
const ARMED = "is-lds-reveal-armed";
const REVEALED = "is-lds-revealed";
const ARRIVING = "is-lds-reveal-arriving";
const SETTLED = "is-lds-reveal-settled";

const OBSERVER_OPTIONS = Object.freeze({
  threshold: 0.14,
  rootMargin: "0px 0px -12% 0px"
});

const INIT_WATCHDOG_MS = 2400;
const STAGGER_STEP_MS = 150;
const STAGGER_CAP_MS = 450;
const TRANSFORM_SETTLE_MS = 920;
const SETTLE_GRACE_MS = 80;

const ALLOWED_ROLES = new Set([
  "section_opener",
  "peer_group",
  "paired_inline",
  "proof_preview",
  "contact_group"
]);

const HIDDEN_CONTAINER_SELECTOR = [
  "[hidden]",
  "[inert]",
  '[aria-hidden="true"]',
  "details:not([open])",
  "dialog:not([open])"
].join(",");

const FORBIDDEN_CONTAINER_SELECTOR = [
  "header",
  "nav",
  '[role="navigation"]',
  '[role="alert"]',
  '[role="status"]',
  "[aria-live]",
  "[data-hero]",
  "[data-lcp]",
  "[data-critical]",
  "[data-approach-exclude]",
  ".hero",
  ".hero-banner",
  ".site-header"
].join(",");

const FORBIDDEN_TARGET_SELECTOR = [
  "h1",
  "img",
  "picture",
  "video",
  "svg",
  "a",
  "button",
  "input",
  "select",
  "textarea",
  '[role="button"]'
].join(",");

const CONTROLLER_KEY = Symbol.for("landometer.riddimApproachMotion.controller");

function normalizeRole(element) {
  return (element.getAttribute("data-approach") || "")
    .trim()
    .toLowerCase()
    .replaceAll("-", "_");
}

function isRendered(element, win) {
  if (!(element instanceof win.Element) || element.getClientRects().length === 0) {
    return false;
  }

  const style = win.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
}

function isHiddenOrClosed(element) {
  return Boolean(element.closest(HIDDEN_CONTAINER_SELECTOR));
}

function isForbiddenTarget(element) {
  if (element.matches(FORBIDDEN_TARGET_SELECTOR)) return true;
  if (element.closest(FORBIDDEN_CONTAINER_SELECTOR)) return true;
  if (element.querySelector("h1, [fetchpriority='high'], [aria-live], [role='alert'], [role='status']")) {
    return true;
  }

  // Nested entrance wrappers compound transforms. They stay final unless a
  // state owner initializes the nested sequence after its ancestor settles.
  return Boolean(element.parentElement?.closest(TARGET_SELECTOR));
}

function viewportMetrics(doc, win) {
  const width = doc.documentElement.clientWidth || win.innerWidth || 0;
  const height = doc.documentElement.clientHeight || win.innerHeight || 0;
  return {
    width,
    height,
    effectiveBottom: height - width * 0.12
  };
}

function hasAlreadyPainted(win) {
  try {
    return win.performance
      ?.getEntriesByType?.("paint")
      ?.some((entry) => entry.name === "first-paint" || entry.name === "first-contentful-paint") ?? false;
  } catch {
    return true;
  }
}

function targetDelay(element) {
  const sequence = element.parentElement?.matches(SEQUENCE_SELECTOR)
    ? element.parentElement
    : null;

  if (!sequence) return 0;

  const peers = [...sequence.children].filter(
    (child) => child.matches?.(TARGET_SELECTOR) && ALLOWED_ROLES.has(normalizeRole(child))
  );
  const index = peers.indexOf(element);
  return index < 0 ? 0 : Math.min(index * STAGGER_STEP_MS, STAGGER_CAP_MS);
}

function configurePairedDirection(element) {
  if (normalizeRole(element) !== "paired_inline") return true;

  const sequence = element.parentElement?.matches(SEQUENCE_SELECTOR)
    ? element.parentElement
    : null;
  if (!sequence) return false;

  const peers = [...sequence.children].filter(
    (child) => child.matches?.('[data-approach="paired_inline"], [data-approach="paired-inline"]')
  );
  if (peers.length !== 2) return false;

  const index = peers.indexOf(element);
  if (index < 0) return false;
  element.setAttribute("data-approach-from", index === 0 ? "inline-start" : "inline-end");
  return true;
}

/**
 * Initialize the candidate Riddim approach-motion behavior.
 *
 * Mark each bounded semantic unit with one of:
 *   section_opener | peer_group | paired_inline | proof_preview | contact_group
 * Use `[data-approach-sequence]` on the direct parent when peer ordering matters.
 *
 * @param {{ document?: Document }} [options]
 * @returns {{ land: (node: Element|string) => void, landSubtree: (node: Element|Document|string) => void, destroy: () => void }}
 */
export function initApproachMotion(options = {}) {
  const doc = options.document ?? globalThis.document;
  if (!doc?.documentElement) {
    return Object.freeze({ land() {}, landSubtree() {}, destroy() {} });
  }

  if (doc[CONTROLLER_KEY]) return doc[CONTROLLER_KEY];

  const win = doc.defaultView ?? globalThis.window;
  const root = doc.documentElement;
  const reducedMotion = win.matchMedia?.("(prefers-reduced-motion: reduce)");
  const printMedia = win.matchMedia?.("print");

  const allTargets = new Set();
  const armedTargets = new Set();
  const settledTargets = new WeakSet();
  const settleCleanup = new WeakMap();

  let observer = null;
  let mutationObserver = null;
  let initializationTimer = 0;
  let auditFrame = 0;
  let auditSecondFrame = 0;
  let observerEffectiveBottom = null;
  let initialized = false;
  let permanentlyFinal = false;
  let listenersInstalled = false;

  function clearBootstrapWatchdog() {
    const timer = win.__LANDOM_MOTION_WATCHDOG__;
    if (timer) win.clearTimeout(timer);
    try {
      delete win.__LANDOM_MOTION_WATCHDOG__;
    } catch {
      win.__LANDOM_MOTION_WATCHDOG__ = 0;
    }
  }

  function clearSettleWork(target) {
    const cleanup = settleCleanup.get(target);
    if (cleanup) cleanup();
    settleCleanup.delete(target);
  }

  function forceTargetFinal(target) {
    if (!(target instanceof win.Element)) return;

    clearSettleWork(target);
    try {
      observer?.unobserve(target);
    } catch {
      // The final state below does not depend on observer cleanup succeeding.
    }

    target.classList.add(REVEALED, SETTLED);
    target.classList.remove(ARMED, ARRIVING);
    armedTargets.delete(target);
    settledTargets.add(target);
  }

  function forceNodeAndWrappersFinal(node) {
    if (!(node instanceof win.Element)) return;

    let current = node;
    while (current) {
      if (current.matches?.(TARGET_SELECTOR)) forceTargetFinal(current);
      current = current.parentElement;
    }

    for (const target of allTargets) {
      if (node.contains(target)) forceTargetFinal(target);
    }
  }

  function forceSubtreeFinal(node) {
    let resolved = node;
    if (typeof node === "string") resolved = doc.querySelector(node);
    if (!resolved) return;

    if (resolved instanceof win.Element) forceNodeAndWrappersFinal(resolved);
    resolved.querySelectorAll?.(TARGET_SELECTOR).forEach(forceTargetFinal);
  }

  function revealTarget(target) {
    if (permanentlyFinal || !armedTargets.has(target) || settledTargets.has(target)) return;

    try {
      observer?.unobserve(target);
      target.classList.add(REVEALED, ARRIVING);

      const delay = targetDelay(target);
      const settleAfter = delay + TRANSFORM_SETTLE_MS + SETTLE_GRACE_MS;
      let timer = 0;

      const settle = () => {
        win.clearTimeout(timer);
        target.removeEventListener("transitionend", onTransitionEnd);
        settleCleanup.delete(target);
        forceTargetFinal(target);
      };

      const onTransitionEnd = (event) => {
        if (event.target === target && event.propertyName === "transform") settle();
      };

      target.addEventListener("transitionend", onTransitionEnd);
      timer = win.setTimeout(settle, settleAfter);
      settleCleanup.set(target, settle);
    } catch {
      failOpen("reveal-error");
    }
  }

  function removeListeners() {
    if (!listenersInstalled) return;
    listenersInstalled = false;

    doc.removeEventListener("focusin", onFocusIn, true);
    doc.removeEventListener("click", onDocumentClick, true);
    doc.removeEventListener("toggle", onDisclosureToggle, true);
    win.removeEventListener("hashchange", onHashChange);
    win.removeEventListener("pageshow", onPageShow);
    win.removeEventListener("beforeprint", onBeforePrint);
    win.removeEventListener("scroll", onPassiveAudit);
    win.removeEventListener("resize", onResize);
    reducedMotion?.removeEventListener?.("change", onReducedMotionChange);
    reducedMotion?.removeListener?.(onReducedMotionChange);
    printMedia?.removeEventListener?.("change", onPrintMediaChange);
    printMedia?.removeListener?.(onPrintMediaChange);
    mutationObserver?.disconnect();
    mutationObserver = null;
  }

  function failOpen(_reason = "fail-open") {
    if (permanentlyFinal) return;
    permanentlyFinal = true;
    clearBootstrapWatchdog();
    win.clearTimeout(initializationTimer);
    win.cancelAnimationFrame(auditFrame);
    win.cancelAnimationFrame(auditSecondFrame);

    try {
      observer?.disconnect();
    } catch {
      // Class cleanup below still guarantees the visible final state.
    }
    observer = null;

    allTargets.forEach(forceTargetFinal);
    root.classList.remove(ROOT_PENDING, ROOT_READY);
    removeListeners();
  }

  function scheduleAudit() {
    if (permanentlyFinal || auditFrame) return;

    auditFrame = win.requestAnimationFrame(() => {
      auditFrame = 0;
      auditSecondFrame = win.requestAnimationFrame(() => {
        auditSecondFrame = 0;
        try {
          const metrics = viewportMetrics(doc, win);
          const effectiveBottom = observerEffectiveBottom ?? metrics.effectiveBottom;
          const atDocumentEnd = Math.ceil(win.scrollY + metrics.height) >=
            doc.documentElement.scrollHeight - 2;

          for (const target of [...armedTargets]) {
            if (target.classList.contains(REVEALED)) continue;
            if (!isRendered(target, win) || isHiddenOrClosed(target)) {
              forceTargetFinal(target);
              continue;
            }

            const rect = target.getBoundingClientRect();
            const overlapsInlineViewport = rect.right > 0 && rect.left < metrics.width;
            const overlapsBlockViewport = rect.bottom > 0 && rect.top < metrics.height;
            if (
              overlapsInlineViewport &&
              (rect.top <= effectiveBottom || (atDocumentEnd && overlapsBlockViewport))
            ) {
              forceTargetFinal(target);
            }
          }
        } catch {
          failOpen("audit-error");
        }
      });
    });
  }

  function onPassiveAudit() {
    scheduleAudit();
  }

  function onResize() {
    observerEffectiveBottom = null;
    scheduleAudit();
  }

  function onFocusIn(event) {
    forceNodeAndWrappersFinal(event.target);
  }

  function hashTarget(hash = win.location.hash) {
    if (!hash || hash === "#") return null;
    try {
      return doc.getElementById(decodeURIComponent(hash.slice(1)));
    } catch {
      return doc.getElementById(hash.slice(1));
    }
  }

  function onHashChange() {
    const target = hashTarget();
    if (target) forceNodeAndWrappersFinal(target);
    scheduleAudit();
  }

  function onDocumentClick(event) {
    const anchor = event.target?.closest?.("a[href]");
    if (!anchor) return;

    try {
      const url = new URL(anchor.href, win.location.href);
      const here = win.location;
      if (
        url.origin === here.origin &&
        url.pathname === here.pathname &&
        url.search === here.search &&
        url.hash
      ) {
        const target = hashTarget(url.hash);
        if (target) forceNodeAndWrappersFinal(target);
      }
    } catch {
      // An invalid URL is owned by the link, not the motion adapter.
    }
  }

  function onDisclosureToggle(event) {
    const owner = event.target;
    if (owner?.matches?.("details:not([open]), dialog:not([open])")) {
      forceSubtreeFinal(owner);
    }
  }

  function onPageShow() {
    const focused = doc.activeElement;
    if (focused && focused !== doc.body) forceNodeAndWrappersFinal(focused);
    const linked = hashTarget();
    if (linked) forceNodeAndWrappersFinal(linked);
    scheduleAudit();
  }

  function onBeforePrint() {
    failOpen("print");
  }

  function onPrintMediaChange(event) {
    if (event.matches) failOpen("print");
  }

  function onReducedMotionChange(event) {
    if (event.matches) failOpen("reduced-motion");
  }

  function installLifecycleGuards() {
    if (listenersInstalled) return;
    listenersInstalled = true;

    doc.addEventListener("focusin", onFocusIn, true);
    doc.addEventListener("click", onDocumentClick, true);
    doc.addEventListener("toggle", onDisclosureToggle, true);
    win.addEventListener("hashchange", onHashChange);
    win.addEventListener("pageshow", onPageShow);
    win.addEventListener("beforeprint", onBeforePrint);
    win.addEventListener("scroll", onPassiveAudit, { passive: true });
    win.addEventListener("resize", onResize, { passive: true });

    if (reducedMotion?.addEventListener) {
      reducedMotion.addEventListener("change", onReducedMotionChange);
    } else {
      reducedMotion?.addListener?.(onReducedMotionChange);
    }

    if (printMedia?.addEventListener) {
      printMedia.addEventListener("change", onPrintMediaChange);
    } else {
      printMedia?.addListener?.(onPrintMediaChange);
    }

    mutationObserver = new win.MutationObserver((records) => {
      try {
        for (const record of records) {
          const owner = record.target;
          if (!(owner instanceof win.Element)) continue;
          if (isHiddenOrClosed(owner) || owner.matches("[hidden], [inert], [aria-hidden='true']")) {
            forceSubtreeFinal(owner);
          }
        }
      } catch {
        failOpen("mutation-error");
      }
    });

    mutationObserver.observe(doc.documentElement, {
      subtree: true,
      attributes: true,
      attributeFilter: ["hidden", "inert", "aria-hidden", "open"]
    });
  }

  function prepare() {
    if (initialized || permanentlyFinal) return;
    initialized = true;

    try {
      const candidates = [...doc.querySelectorAll(TARGET_SELECTOR)];
      candidates.forEach((target) => allTargets.add(target));

      if (
        reducedMotion?.matches ||
        printMedia?.matches ||
        typeof win.IntersectionObserver !== "function"
      ) {
        failOpen("unsupported-or-final-state");
        return;
      }

      // A pre-paint head bootstrap may set `lds-motion-pending`. Without it,
      // never hide content that the user may already have seen.
      const hadPrepaintBootstrap = root.classList.contains(ROOT_PENDING);
      if (!hadPrepaintBootstrap && hasAlreadyPainted(win)) {
        failOpen("late-initialization");
        return;
      }
      root.classList.add(ROOT_PENDING);

      const linked = hashTarget();
      if (linked) forceNodeAndWrappersFinal(linked);
      if (doc.activeElement && doc.activeElement !== doc.body) {
        forceNodeAndWrappersFinal(doc.activeElement);
      }

      const metrics = viewportMetrics(doc, win);
      const eligible = candidates.filter((target) => {
        const role = normalizeRole(target);
        if (!ALLOWED_ROLES.has(role)) return false;
        if (settledTargets.has(target)) return false;
        if (!isRendered(target, win) || isHiddenOrClosed(target) || isForbiddenTarget(target)) return false;
        if (!configurePairedDirection(target)) return false;

        const rect = target.getBoundingClientRect();
        // Only wholly not-yet-visible content below the viewport may be armed.
        return rect.top >= metrics.height && rect.top > metrics.effectiveBottom;
      });

      for (const target of candidates) {
        if (!eligible.includes(target)) forceTargetFinal(target);
      }

      if (eligible.length === 0) {
        clearBootstrapWatchdog();
        win.clearTimeout(initializationTimer);
        root.classList.remove(ROOT_PENDING, ROOT_READY);
        return;
      }

      observer = new win.IntersectionObserver((entries) => {
        try {
          for (const entry of entries) {
            if (entry.rootBounds) observerEffectiveBottom = entry.rootBounds.bottom;
            if (entry.isIntersecting === true) revealTarget(entry.target);
          }
        } catch {
          failOpen("observer-callback-error");
        }
      }, OBSERVER_OPTIONS);

      for (const target of eligible) {
        const delay = targetDelay(target);
        target.style.setProperty("--lds-reveal-delay", `${delay}ms`);
        target.classList.remove(REVEALED, ARRIVING, SETTLED);
        target.classList.add(ARMED);
        armedTargets.add(target);
        observer.observe(target);
      }

      installLifecycleGuards();
      root.classList.remove(ROOT_PENDING);
      root.classList.add(ROOT_READY);
      clearBootstrapWatchdog();
      win.clearTimeout(initializationTimer);
      scheduleAudit();
    } catch {
      failOpen("initialization-error");
    }
  }

  const controller = Object.freeze({
    land(node) {
      try {
        let resolved = node;
        if (typeof node === "string") resolved = doc.querySelector(node);
        if (resolved instanceof win.Element) forceNodeAndWrappersFinal(resolved);
      } catch {
        failOpen("land-api-error");
      }
    },
    landSubtree(node) {
      try {
        forceSubtreeFinal(node);
      } catch {
        failOpen("land-subtree-api-error");
      }
    },
    destroy() {
      failOpen("destroy");
      delete doc[CONTROLLER_KEY];
    }
  });

  doc[CONTROLLER_KEY] = controller;
  initializationTimer = win.setTimeout(() => failOpen("initialization-watchdog"), INIT_WATCHDOG_MS);

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", prepare, { once: true });
  } else {
    prepare();
  }

  return controller;
}
