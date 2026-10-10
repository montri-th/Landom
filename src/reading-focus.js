// Local reading assistance: never hides content, blocks input or moves focus.
const CARD = '.person-card-shell, .recruitment-card, .public-person';
const EXEMPT = '.site-header, [data-navigation-header], .site-menu-layer, .skip-link, dialog, script, style, link';

function visibleCard(node) {
  const card = node?.closest?.(CARD);
  return card?.isConnected && !card.closest('[hidden]') ? card : null;
}

// Quiet only sibling branches, never an ancestor of the chosen card or navbar.
export function readingQuietBranches(card, body) {
  const branches = [];
  function include(node) {
    if (node.matches(EXEMPT)) return;
    if (node.querySelector(EXEMPT)) {
      for (const child of node.children) include(child);
    } else branches.push(node);
  }
  for (let branch = card; branch && branch !== body; branch = branch.parentElement) {
    for (const sibling of branch.parentElement?.children || []) {
      if (sibling !== branch) include(sibling);
    }
  }
  return branches;
}

export function initReadingFocus({ doc = document, win = window } = {}) {
  let hover = null;
  let focus = null;
  let touch = null;
  let keyboard = false;
  let suspended = false;
  let viewportFrame = 0;
  const expanded = new Set();
  const quiet = new Set();
  const listeners = [];
  const hoverQuery = win.matchMedia?.('(any-hover: hover) and (any-pointer: fine)');

  function isInViewport(card) {
    const rect = card.getBoundingClientRect();
    const viewport = win.visualViewport;
    const left = viewport?.offsetLeft || 0;
    const top = viewport?.offsetTop || 0;
    const right = left + (viewport?.width || win.innerWidth);
    const bottom = top + (viewport?.height || win.innerHeight);
    return rect.width > 0 && rect.height > 0 && rect.right > left && rect.bottom > top && rect.left < right && rect.top < bottom;
  }

  function clearQuiet() {
    for (const node of quiet) node.removeAttribute('data-reading-quiet');
    quiet.clear();
  }
  function refresh() {
    clearQuiet();
    hover = visibleCard(hover);
    focus = visibleCard(focus);
    touch = visibleCard(touch);
    for (const card of expanded) if (!visibleCard(card)) expanded.delete(card);
    if (suspended) return;
    const lastExpanded = [...expanded].at(-1);
    const active = (keyboard ? focus : hover || touch || focus) || lastExpanded;
    // Keep the disclosure state, but never dim the only content now on screen.
    if (!active || !isInViewport(active)) return;
    for (const branch of readingQuietBranches(active, doc.body)) {
      branch.setAttribute('data-reading-quiet', '');
      quiet.add(branch);
    }
  }
  function clear() {
    suspended = true;
    hover = focus = touch = null;
    if (viewportFrame) win.cancelAnimationFrame(viewportFrame);
    viewportFrame = 0;
    clearQuiet();
  }
  function scheduleRefresh() {
    if (viewportFrame) return;
    viewportFrame = win.requestAnimationFrame(() => {
      viewportFrame = 0;
      refresh();
    });
  }
  function on(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    listeners.push(() => target.removeEventListener(type, handler, options));
  }
  on(doc, 'pointerover', (event) => {
    if (event.pointerType === 'touch' || !hoverQuery?.matches) return;
    const card = visibleCard(event.target);
    if (!card || card === visibleCard(event.relatedTarget)) return;
    keyboard = false;
    suspended = false;
    hover = card;
    touch = null;
    refresh();
  });
  on(doc, 'pointerout', (event) => {
    if (event.pointerType === 'touch' || !hoverQuery?.matches) return;
    const card = visibleCard(event.target);
    if (!card || card === visibleCard(event.relatedTarget)) return;
    hover = null;
    refresh();
  });
  on(doc, 'pointerdown', (event) => {
    const card = visibleCard(event.target);
    if (!card) { clear(); return; }
    keyboard = false;
    suspended = false;
    touch = event.pointerType === 'touch' || event.pointerType === 'pen' ? card : null;
    refresh();
  }, { passive: true });
  on(doc, 'keydown', (event) => {
    if (event.key === 'Escape') { clear(); return; }
    keyboard = true;
    if (event.key === 'Tab' || visibleCard(event.target)) suspended = false;
  }, true);
  on(doc, 'focusin', (event) => {
    const card = visibleCard(event.target);
    if (!card) { clear(); return; }
    focus = card;
    // Escape may synchronously return focus to the collapsed card's button.
    // Leave the page restored until the next explicit keyboard/pointer intent.
    refresh();
  });
  on(doc, 'focusout', (event) => {
    if (visibleCard(event.target) === visibleCard(event.relatedTarget)) return;
    focus = visibleCard(event.relatedTarget);
    if (event.relatedTarget && !focus) clear();
    else refresh();
  });
  function setExpanded(node, open) {
    const card = visibleCard(node);
    if (!card) { refresh(); return; }
    expanded.delete(card);
    if (open) {
      expanded.add(card);
      suspended = false;
    }
    refresh();
  }
  on(doc, 'toggle', (event) => {
    if (!event.target.matches?.('details')) return;
    const card = visibleCard(event.target);
    if (card) setExpanded(card, Boolean(card.querySelector('details[open]')));
  }, true);
  on(win, 'blur', clear);
  on(win, 'pagehide', clear);
  on(win, 'hashchange', clear);
  on(doc, 'scroll', scheduleRefresh, { passive: true, capture: true });
  on(win, 'resize', scheduleRefresh, { passive: true });
  if (win.visualViewport) {
    on(win.visualViewport, 'scroll', scheduleRefresh, { passive: true });
    on(win.visualViewport, 'resize', scheduleRefresh, { passive: true });
  }
  return {
    refresh,
    setExpanded,
    clear,
    destroy() { clear(); for (const remove of listeners) remove(); expanded.clear(); }
  };
}
