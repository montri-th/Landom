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
  const railLinks = Array.from(document.querySelectorAll('[data-scrollspy-link]'));
  const railSections = railLinks
    .map((link) => ({ link, section: document.getElementById(link.dataset.scrollspyLink || '') }))
    .filter((record) => record.section);

  if (!header || !toggle || !toggleIcon || !layer || !panel) return { close() {} };

  root.classList.add('navigation-enhanced');

  let menuOpen = false;
  let pointerIntent = false;
  let focusIntent = false;
  let lastScrollY = Math.max(0, window.scrollY);
  let frame = 0;

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

  function syncScrollspy() {
    const headerHeight = header.getBoundingClientRect().height;
    const readingLine = Math.max(headerHeight + 24, window.innerHeight * 0.42);
    let active = null;

    railSections.forEach((record) => {
      const rect = record.section.getBoundingClientRect();
      if (rect.top <= readingLine && rect.bottom > headerHeight + 16) active = record;
    });

    railSections.forEach((record) => {
      if (record === active) record.link.setAttribute('aria-current', 'location');
      else record.link.removeAttribute('aria-current');
    });
  }

  function updateFromScroll() {
    frame = 0;
    const currentScrollY = Math.max(0, window.scrollY);
    const movingUp = currentScrollY < lastScrollY - 2;
    const nearTop = currentScrollY <= 24;
    setCalm(!nearTop && !movingUp);
    lastScrollY = currentScrollY;
    syncScrollspy();
  }

  function scheduleScrollUpdate() {
    if (!frame) frame = window.requestAnimationFrame(updateFromScroll);
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
    setCalm(false);

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
    if (closeTarget.matches('a[href]')) {
      try {
        const url = new URL(closeTarget.href, window.location.href);
        const here = window.location;
        if (
          url.origin === here.origin &&
          url.pathname === here.pathname &&
          url.search === here.search &&
          url.hash
        ) {
          destination = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        }
      } catch {
        destination = null;
      }
    }
    setMenuOpen(false, { returnFocus: !destination });
    if (destination) {
      window.requestAnimationFrame(() => destination?.focus({ preventScroll: true }));
    }
  });
  panel.addEventListener('keydown', handlePanelKeydown);
  header.addEventListener('pointerenter', () => {
    pointerIntent = true;
    setCalm(false);
  });
  header.addEventListener('pointerleave', () => {
    pointerIntent = false;
    scheduleScrollUpdate();
  });
  header.addEventListener('focusin', () => {
    focusIntent = true;
    setCalm(false);
  });
  header.addEventListener('focusout', () => {
    window.requestAnimationFrame(() => {
      focusIntent = header.contains(document.activeElement);
      scheduleScrollUpdate();
    });
  });
  window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
  window.addEventListener('resize', scheduleScrollUpdate, { passive: true });
  reducedMotion?.addEventListener?.('change', () => {
    if (reducedMotion.matches) setCalm(false);
    else scheduleScrollUpdate();
  });
  window.addEventListener('pageshow', () => {
    lastScrollY = Math.max(0, window.scrollY);
    scheduleScrollUpdate();
  });

  updateFromScroll();
  return {
    close(options) {
      if (menuOpen) setMenuOpen(false, options);
    }
  };
}
