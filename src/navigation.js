const FOCUSABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

function visibleFocusableElements(container) {
  return Array.from(container?.querySelectorAll(FOCUSABLE_SELECTOR) || []).filter((element) => {
    const style = window.getComputedStyle(element);
    return element.getClientRects().length > 0 &&
      style.visibility !== 'hidden' &&
      style.display !== 'none' &&
      !element.hidden &&
      !element.closest('[hidden], [inert]');
  });
}

export function initSiteNavigation() {
  const root = document.documentElement;
  const header = document.querySelector('[data-navigation-header]');
  const toggle = document.querySelector('#menu-toggle');
  const toggleIcon = toggle?.querySelector('.menu-toggle-icon');
  const layer = document.querySelector('#site-menu-layer');
  const panel = document.querySelector('#site-menu');
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  if (!header || !toggle || !toggleIcon || !layer || !panel) return { close() {} };

  root.classList.add('navigation-enhanced');

  const documentScroller = document.scrollingElement || document.documentElement;
  const lastYByScroller = new WeakMap();
  const pendingScrollers = new Set();
  let menuOpen = false;
  let pointerIntent = false;
  let focusIntent = false;
  let calmRequested = Math.max(0, window.scrollY) > 24;
  let frame = 0;

  lastYByScroller.set(documentScroller, Math.max(0, window.scrollY));

  function labelFor(state) {
    return state === 'open'
      ? toggle.dataset.closeLabel || toggle.getAttribute('aria-label') || 'Close menu'
      : toggle.dataset.openLabel || toggle.getAttribute('aria-label') || 'Open menu';
  }

  function setCalm(calm) {
    const next = Boolean(calm && !menuOpen && !pointerIntent && !focusIntent && !reducedMotion?.matches);
    header.classList.toggle('is-calm', next);
    if (next) root.dataset.navState = 'calm';
    else delete root.dataset.navState;
  }

  function resolveScroller(target) {
    if (
      !target ||
      target === window ||
      target === document ||
      target === document.documentElement ||
      target === document.body
    ) return documentScroller;
    return typeof target.scrollTop === 'number' ? target : documentScroller;
  }

  function scrollPosition(scroller) {
    if (scroller === documentScroller) return Math.max(0, window.scrollY || documentScroller.scrollTop || 0);
    return Math.max(0, scroller.scrollTop || 0);
  }

  function updateFromScroller(scroller) {
    const currentY = scrollPosition(scroller);
    const previousY = lastYByScroller.get(scroller) ?? 0;
    const delta = currentY - previousY;
    lastYByScroller.set(scroller, currentY);

    if (currentY < 24) calmRequested = false;
    else if (delta > 4) calmRequested = true;
    else if (delta < -4) calmRequested = false;

    setCalm(calmRequested);
  }

  function flushScrollUpdates() {
    frame = 0;
    const scrollers = Array.from(pendingScrollers);
    pendingScrollers.clear();
    scrollers.forEach(updateFromScroller);
  }

  function scheduleScrollUpdate(scroller = documentScroller) {
    pendingScrollers.add(scroller);
    if (!frame) frame = window.requestAnimationFrame(flushScrollUpdates);
  }

  function handleCapturedScroll(event) {
    scheduleScrollUpdate(resolveScroller(event.target));
  }

  function setMenuOpen(next, { returnFocus = true } = {}) {
    menuOpen = Boolean(next);
    layer.hidden = !menuOpen;
    toggle.setAttribute('aria-expanded', String(menuOpen));
    const label = labelFor(menuOpen ? 'open' : 'closed');
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
    toggleIcon.textContent = menuOpen ? 'close' : 'menu';
    document.body.classList.toggle('site-menu-open', menuOpen);
    if (menuOpen || returnFocus) setCalm(false);
    else setCalm(calmRequested);

    if (menuOpen) {
      window.requestAnimationFrame(() => {
        const first = visibleFocusableElements(panel)[0];
        (first || panel).focus({ preventScroll: true });
      });
    } else if (returnFocus) {
      toggle.focus({ preventScroll: true });
      scheduleScrollUpdate();
    }
  }

  function handlePanelKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      setMenuOpen(false);
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = visibleFocusableElements(panel);
    if (!focusable.length) {
      event.preventDefault();
      panel.focus({ preventScroll: true });
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  toggle.addEventListener('click', () => setMenuOpen(!menuOpen));
  layer.addEventListener('click', (event) => {
    const closeTarget = event.target.closest('[data-menu-close]');
    if (!closeTarget) return;
    let destination = null;
    let destinationHash = '';
    if (closeTarget.matches('a[href]')) {
      try {
        const url = new URL(closeTarget.href, window.location.href);
        const here = window.location;
        if (
          url.origin === here.origin &&
          url.pathname === here.pathname &&
          url.hash
        ) {
          destination = document.getElementById(decodeURIComponent(url.hash.slice(1)));
          destinationHash = url.hash;
        }
      } catch {
        destination = null;
      }
    }
    if (destination) event.preventDefault();
    setMenuOpen(false, { returnFocus: !destination });
    if (destination) {
      const nextUrl = new URL(window.location.href);
      const hashChanged = nextUrl.hash !== destinationHash;
      nextUrl.hash = destinationHash;
      if (hashChanged) window.history.pushState({}, '', nextUrl);
      destination.scrollIntoView({ block: 'start' });
      window.requestAnimationFrame(() => destination.focus({ preventScroll: true }));
    }
  });
  panel.addEventListener('keydown', handlePanelKeydown);
  header.addEventListener('pointerenter', () => {
    pointerIntent = true;
    setCalm(false);
  });
  header.addEventListener('pointerleave', () => {
    pointerIntent = false;
    scheduleScrollUpdate(documentScroller);
  });
  header.addEventListener('focusin', () => {
    focusIntent = true;
    setCalm(false);
  });
  header.addEventListener('focusout', () => {
    window.requestAnimationFrame(() => {
      focusIntent = header.contains(document.activeElement);
      scheduleScrollUpdate(documentScroller);
    });
  });
  document.addEventListener('scroll', handleCapturedScroll, true);
  window.addEventListener('resize', () => scheduleScrollUpdate(documentScroller), { passive: true });
  reducedMotion?.addEventListener?.('change', () => {
    if (reducedMotion.matches) setCalm(false);
    else scheduleScrollUpdate(documentScroller);
  });
  window.addEventListener('pageshow', () => {
    const currentY = Math.max(0, window.scrollY);
    lastYByScroller.set(documentScroller, currentY);
    calmRequested = currentY > 24;
    scheduleScrollUpdate(documentScroller);
  });

  scheduleScrollUpdate(documentScroller);
  return {
    close(options) {
      if (menuOpen) setMenuOpen(false, options);
    }
  };
}
