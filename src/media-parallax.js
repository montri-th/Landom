/**
 * Component-local parallax for explicitly allowlisted photographic media.
 *
 * The source page remains static by default. Motion is enabled only when all
 * required browser APIs are available and the user has not requested reduced
 * motion, print output, or data saving. Any unsupported or lifecycle state
 * restores the image's original inline transform.
 */

const MEDIA_SELECTOR = "img[data-parallax-media]";
const ROOT_CLASS = "media-parallax-enabled";
const ACTIVE_CLASS = "is-media-parallax-active";
const MAX_DEPTH = 24;
const CONTROLLER_KEY = Symbol.for("landometer.mediaParallax.controller");

/**
 * Clamp a finite value to an inclusive range.
 *
 * @param {number} value
 * @param {number} minimum
 * @param {number} maximum
 * @returns {number}
 */
export function clamp(value, minimum, maximum) {
  const lower = Number(minimum);
  const upper = Number(maximum);
  if (!Number.isFinite(lower) || !Number.isFinite(upper)) return 0;

  const low = Math.min(lower, upper);
  const high = Math.max(lower, upper);
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return low;
  return Math.min(high, Math.max(low, numericValue));
}

/**
 * Calculate a bounded vertical parallax offset from viewport geometry.
 *
 * @param {{ elementTop?: number, elementHeight?: number, viewportHeight?: number, depth?: number }} [metrics]
 * @returns {number}
 */
export function parallaxOffset(metrics = {}) {
  const elementTop = Number(metrics.elementTop);
  const elementHeight = Number(metrics.elementHeight);
  const viewportHeight = Number(metrics.viewportHeight);
  const depth = clamp(metrics.depth, 0, MAX_DEPTH);

  if (
    !Number.isFinite(elementTop) ||
    !Number.isFinite(elementHeight) ||
    !Number.isFinite(viewportHeight) ||
    elementHeight <= 0 ||
    viewportHeight <= 0 ||
    depth === 0
  ) {
    return 0;
  }

  const elementCenter = elementTop + elementHeight / 2;
  const viewportCenter = viewportHeight / 2;
  const travelRadius = (viewportHeight + elementHeight) / 2;
  const normalizedPosition = clamp((elementCenter - viewportCenter) / travelRadius, -1, 1);
  const offset = -normalizedPosition * depth;
  return Math.abs(offset) < 0.005 ? 0 : offset;
}

function staticController() {
  return Object.freeze({ refresh() {}, destroy() {} });
}

/**
 * Initialize parallax for `img[data-parallax-media]` descendants.
 *
 * @param {{ document?: Document }} [options]
 * @returns {{ refresh: (scope?: Element|Document) => void, destroy: () => void }}
 */
export function initMediaParallax(options = {}) {
  const doc = options.document ?? globalThis.document;
  if (!doc?.documentElement) return staticController();
  if (doc[CONTROLLER_KEY]) return doc[CONTROLLER_KEY];

  const win = doc.defaultView ?? globalThis.window;
  const root = doc.documentElement;
  const reducedMotion = win?.matchMedia?.("(prefers-reduced-motion: reduce)");
  const printMedia = win?.matchMedia?.("print");
  const connection = win?.navigator?.connection;

  const supported = Boolean(
    win?.Element &&
    typeof win.IntersectionObserver === "function" &&
    typeof win.requestAnimationFrame === "function" &&
    typeof win.cancelAnimationFrame === "function" &&
    reducedMotion &&
    printMedia
  );

  if (!supported) {
    root.classList.remove(ROOT_CLASS);
    return staticController();
  }

  const images = new Set();
  const visibleImages = new Set();
  const originalTransforms = new WeakMap();
  const listenerCleanup = [];

  let frame = 0;
  let destroyed = false;
  let pageHidden = false;
  let printing = false;

  function isMotionBlocked() {
    return Boolean(
      destroyed ||
      pageHidden ||
      printing ||
      reducedMotion.matches ||
      printMedia.matches ||
      connection?.saveData === true
    );
  }

  function rememberTransform(image) {
    if (originalTransforms.has(image)) return;
    originalTransforms.set(image, {
      value: image.style.getPropertyValue("transform"),
      priority: image.style.getPropertyPriority("transform")
    });
  }

  function restoreImage(image) {
    const original = originalTransforms.get(image);
    if (original?.value) {
      image.style.setProperty("transform", original.value, original.priority);
    } else {
      image.style.removeProperty("transform");
    }
    image.classList.remove(ACTIVE_CLASS);
  }

  function cancelScheduledFrame() {
    if (!frame) return;
    win.cancelAnimationFrame(frame);
    frame = 0;
  }

  function clearMotionState() {
    cancelScheduledFrame();
    images.forEach(restoreImage);
    root.classList.remove(ROOT_CLASS);
  }

  function updateVisibleImages() {
    frame = 0;
    if (isMotionBlocked()) {
      clearMotionState();
      return;
    }

    const viewportHeight = doc.documentElement.clientHeight || win.innerHeight || 0;
    const updates = [];

    for (const image of [...visibleImages]) {
      if (!image.isConnected || !image.matches(MEDIA_SELECTOR)) {
        visibleImages.delete(image);
        images.delete(image);
        restoreImage(image);
        continue;
      }

      const rect = image.getBoundingClientRect();
      const depth = clamp(image.dataset.parallaxDepth, 0, MAX_DEPTH);
      updates.push({
        image,
        offset: parallaxOffset({
          elementTop: rect.top,
          elementHeight: rect.height,
          viewportHeight,
          depth
        })
      });
    }

    for (const { image, offset } of updates) {
      image.style.setProperty(
        "transform",
        `translate3d(0, ${offset.toFixed(2)}px, 0) scale(var(--media-parallax-scale, 1.06))`
      );
      image.classList.add(ACTIVE_CLASS);
    }
  }

  function scheduleUpdate() {
    if (frame || isMotionBlocked()) return;
    frame = win.requestAnimationFrame(updateVisibleImages);
  }

  const observer = new win.IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!images.has(entry.target)) continue;
      if (entry.isIntersecting === true) {
        visibleImages.add(entry.target);
      } else {
        visibleImages.delete(entry.target);
        restoreImage(entry.target);
      }
    }

    if (isMotionBlocked()) {
      clearMotionState();
      return;
    }
    scheduleUpdate();
  }, { threshold: 0, rootMargin: "8% 0px" });

  function cleanupDisconnectedImages() {
    for (const image of [...images]) {
      if (image.isConnected && image.matches(MEDIA_SELECTOR)) continue;
      observer.unobserve(image);
      visibleImages.delete(image);
      images.delete(image);
      restoreImage(image);
    }
  }

  function registerScope(scope) {
    if (!scope) return;
    const candidates = [];
    if (scope instanceof win.Element && scope.matches(MEDIA_SELECTOR)) candidates.push(scope);
    scope.querySelectorAll?.(MEDIA_SELECTOR).forEach((image) => candidates.push(image));

    for (const image of candidates) {
      if (images.has(image)) continue;
      rememberTransform(image);
      images.add(image);
      observer.observe(image);
    }
  }

  function syncMotionPreference() {
    if (isMotionBlocked()) {
      clearMotionState();
      return;
    }
    root.classList.add(ROOT_CLASS);
    scheduleUpdate();
  }

  function addWindowListener(type, listener, options) {
    win.addEventListener(type, listener, options);
    listenerCleanup.push(() => win.removeEventListener(type, listener, options));
  }

  function addChangeListener(target, listener) {
    if (!target) return;
    if (target.addEventListener) {
      target.addEventListener("change", listener);
      listenerCleanup.push(() => target.removeEventListener("change", listener));
    } else if (target.addListener) {
      target.addListener(listener);
      listenerCleanup.push(() => target.removeListener(listener));
    }
  }

  function onScroll() {
    scheduleUpdate();
  }

  function onResize() {
    scheduleUpdate();
  }

  function onPreferenceChange() {
    syncMotionPreference();
  }

  function onBeforePrint() {
    printing = true;
    clearMotionState();
  }

  function onAfterPrint() {
    printing = false;
    syncMotionPreference();
  }

  function onPageHide() {
    pageHidden = true;
    clearMotionState();
  }

  function onPageShow() {
    pageHidden = false;
    syncMotionPreference();
  }

  const controller = Object.freeze({
    refresh(scope = doc) {
      if (destroyed) return;
      cleanupDisconnectedImages();
      registerScope(scope);
      syncMotionPreference();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      observer.disconnect();
      listenerCleanup.splice(0).forEach((cleanup) => cleanup());
      clearMotionState();
      visibleImages.clear();
      images.clear();
      delete doc[CONTROLLER_KEY];
    }
  });

  doc[CONTROLLER_KEY] = controller;
  addWindowListener("scroll", onScroll, { passive: true });
  addWindowListener("resize", onResize, { passive: true });
  addWindowListener("beforeprint", onBeforePrint);
  addWindowListener("afterprint", onAfterPrint);
  addWindowListener("pagehide", onPageHide);
  addWindowListener("pageshow", onPageShow);
  addChangeListener(reducedMotion, onPreferenceChange);
  addChangeListener(printMedia, onPreferenceChange);
  addChangeListener(connection, onPreferenceChange);
  controller.refresh(doc);

  return controller;
}
