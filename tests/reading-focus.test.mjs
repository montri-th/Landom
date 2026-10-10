import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { initReadingFocus, readingQuietBranches } from '../src/reading-focus.js';

// A small event/DOM fixture exercises the real controller, including containment,
// replacement and attribute cleanup. No browser API is replaced in production.
class Element {
  constructor(tag = 'div', classes = '') {
    this.tag = tag; this.classes = classes.split(' '); this.children = [];
    this.parentElement = null; this.attributes = new Map();
    this.rect = { top: 100, left: 10, right: 310, bottom: 500, width: 300, height: 400 };
  }
  append(...nodes) { for (const node of nodes) { node.parentElement = this; this.children.push(node); } return this; }
  get isConnected() { return this.tag === 'body' || Boolean(this.parentElement?.isConnected); }
  getBoundingClientRect() { return this.rect; }
  matches(selector) {
    return selector.split(',').some((part) => {
      part = part.trim();
      if (part.startsWith('.')) return this.classes.includes(part.slice(1));
      if (part.startsWith('[')) return this.attributes.has(part.slice(1, -1).split('=')[0]);
      if (part === 'details[open]') return this.tag === 'details' && this.open;
      return this.tag === part;
    });
  }
  closest(selector) { return this.matches(selector) ? this : this.parentElement?.closest(selector); }
  querySelector(selector) {
    for (const child of this.children) { if (child.matches(selector)) return child; const nested = child.querySelector(selector); if (nested) return nested; }
    return null;
  }
  setAttribute(name, value) { this.attributes.set(name, value); }
  removeAttribute(name) { this.attributes.delete(name); }
}
function eventTarget(extra = {}) {
  const events = new Map();
  return {
    ...extra,
    addEventListener(type, listener) { events.set(type, listener); },
    removeEventListener(type) { events.delete(type); },
    emit(type, fields = {}) { events.get(type)?.({ preventDefault() { assert.fail('reading assistance must not intercept input'); }, ...fields }); },
    events
  };
}
function fixture({ hover = true, cardClass = 'person-card-shell' } = {}) {
  const body = new Element('body');
  const nav = new Element('header', 'site-header');
  const menu = new Element('div', 'site-menu-layer');
  const main = new Element('main');
  const hero = new Element('section');
  const section = new Element('section');
  const controls = new Element();
  const search = new Element('input');
  const board = new Element();
  const a = new Element('article', cardClass); const b = new Element('article', cardClass);
  const buttonA = new Element('button'); const buttonB = new Element('button');
  const labelA = new Element('span');
  const details = new Element('details');
  const footer = new Element('footer'); const dialog = new Element('dialog');
  body.append(nav, menu, main, footer, dialog);
  main.append(hero, section); section.append(controls, board); controls.append(search);
  board.append(a, b); a.append(buttonA, details); buttonA.append(labelA); b.append(buttonB);
  const doc = eventTarget({ body });
  const frames = new Map(); let frameId = 0;
  const win = eventTarget({
    matchMedia: () => ({ matches: hover }), innerWidth: 1440, innerHeight: 900,
    visualViewport: eventTarget({ offsetLeft: 0, offsetTop: 0, width: 1440, height: 900 }),
    requestAnimationFrame: (callback) => { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame: (id) => frames.delete(id)
  });
  const flushFrame = () => { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach((callback) => callback()); };
  const controller = initReadingFocus({ doc, win });
  const isQuiet = (node) => node.attributes.has('data-reading-quiet');
  const assertReading = (card) => {
    for (const node of [nav, menu, main, section, board, card, dialog]) assert.equal(isQuiet(node), false);
    for (const node of [hero, controls, footer, card === a ? b : a]) assert.equal(isQuiet(node), true);
  };
  const assertRestored = () => { for (const node of [nav, menu, main, hero, section, controls, board, a, b, footer, dialog]) assert.equal(isQuiet(node), false); };
  return { body, nav, menu, main, hero, section, controls, search, board, a, b, buttonA, buttonB, labelA, details, footer, dialog, doc, win, controller, assertReading, assertRestored, frames, flushFrame };
}

test('hover quiets the whole sibling page but preserves navigation and internal pointer transitions', () => {
  const f = fixture(); f.assertRestored();
  f.doc.emit('pointerover', { target: f.labelA, pointerType: 'mouse' }); f.assertReading(f.a);
  f.doc.emit('pointerout', { target: f.labelA, relatedTarget: f.buttonA, pointerType: 'mouse' }); f.assertReading(f.a);
  f.doc.emit('pointerout', { target: f.a, relatedTarget: f.body, pointerType: 'mouse' }); f.assertRestored();
});

test('an expanded profile remains readable after hover leaves, but another card can be explored', () => {
  const f = fixture(); f.controller.setExpanded(f.a, true); f.assertReading(f.a);
  f.doc.emit('pointerover', { target: f.b, pointerType: 'mouse' }); f.assertReading(f.b);
  f.doc.emit('pointerout', { target: f.b, relatedTarget: f.body, pointerType: 'mouse' }); f.assertReading(f.a);
  f.controller.setExpanded(f.a, false); f.assertRestored();
});

test('keyboard navigation and outside controls are free; Escape stays cleared across restored button focus', () => {
  const f = fixture();
  f.doc.emit('keydown', { key: 'Tab', target: f.body });
  f.doc.emit('focusin', { target: f.buttonA }); f.assertReading(f.a);
  f.controller.setExpanded(f.a, true);
  f.doc.emit('keydown', { key: 'Escape', target: f.buttonA });
  f.controller.setExpanded(f.a, false);
  f.doc.emit('focusin', { target: f.buttonA }); f.assertRestored();
  f.doc.emit('keydown', { key: 'Tab', target: f.buttonA });
  f.doc.emit('focusout', { target: f.buttonA, relatedTarget: f.buttonB });
  f.doc.emit('focusin', { target: f.buttonB }); f.assertReading(f.b);
  f.doc.emit('focusout', { target: f.buttonB, relatedTarget: f.search });
  f.doc.emit('focusin', { target: f.search }); f.assertRestored();
});

test('touch ignores synthetic hover, selects the tapped card and restores the page on an outside tap', () => {
  const f = fixture({ hover: false, cardClass: 'recruitment-card' });
  f.doc.emit('pointerover', { target: f.a, pointerType: 'touch' }); f.assertRestored();
  f.doc.emit('pointerdown', { target: f.a, pointerType: 'touch' }); f.assertReading(f.a);
  f.doc.emit('pointerdown', { target: f.nav, pointerType: 'touch' }); f.assertRestored();
});

test('native disclosures work for static fallback and recruitment, including close and cleanup', () => {
  for (const cardClass of ['public-person', 'recruitment-card']) {
    const f = fixture({ cardClass });
    f.details.open = true; f.doc.emit('toggle', { target: f.details }); f.assertReading(f.a);
    f.details.open = false; f.doc.emit('toggle', { target: f.details }); f.assertRestored();
    f.details.open = true; f.doc.emit('toggle', { target: f.details });
    f.a.parentElement = null; f.board.children = [f.b];
    f.controller.refresh(); f.assertRestored();
    f.controller.destroy(); assert.equal(f.doc.events.size, 0); assert.equal(f.win.events.size, 0);
  }
});

test('scrolling an expanded or touched card offscreen restores content without closing it, then resumes on return', () => {
  for (const activation of ['expanded', 'touch']) {
    const f = fixture();
    if (activation === 'expanded') f.controller.setExpanded(f.a, true);
    else f.doc.emit('pointerdown', { target: f.a, pointerType: 'touch' });
    f.assertReading(f.a);
    const visibleRect = f.a.rect;
    f.a.rect = { ...visibleRect, top: -600, bottom: -200 };
    f.doc.emit('scroll'); f.doc.emit('scroll'); f.win.emit('resize');
    assert.equal(f.frames.size, 1, 'scroll/resize work is batched to one frame');
    f.flushFrame(); f.assertRestored();
    f.a.rect = visibleRect;
    f.doc.emit('scroll'); f.flushFrame(); f.assertReading(f.a);
    f.win.visualViewport.height = 80;
    f.win.visualViewport.emit('resize'); f.flushFrame(); f.assertRestored();
    f.win.visualViewport.height = 900;
    f.win.visualViewport.emit('scroll'); f.flushFrame(); f.assertReading(f.a);
    f.doc.emit('scroll'); f.controller.destroy();
    assert.equal(f.frames.size, 0);
    assert.equal(f.win.visualViewport.events.size, 0);
  }
});

test('nested dialog does not exempt its entire section; blur, navigation and hidden fallback fail open', () => {
  const f = fixture();
  const outsideSection = new Element('section'); const outsideCopy = new Element('p'); const nestedDialog = new Element('dialog');
  outsideSection.append(outsideCopy, nestedDialog); f.main.append(outsideSection);
  const branches = readingQuietBranches(f.a, f.body);
  assert.ok(branches.includes(outsideCopy)); assert.ok(!branches.includes(outsideSection)); assert.ok(!branches.includes(nestedDialog));
  for (const event of ['blur', 'pagehide', 'hashchange']) {
    f.controller.setExpanded(f.a, true); f.assertReading(f.a); f.win.emit(event); f.assertRestored();
  }
  f.controller.setExpanded(f.a, true); f.board.setAttribute('hidden', ''); f.controller.refresh(); f.assertRestored();
});

test('reading assistance has no overlay, content hiding, focus trap or animated dimming', async () => {
  const css = await readFile(new URL('../src/reading-focus.css', import.meta.url), 'utf8');
  assert.match(css, /\[data-theme="dark"\]/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /forced-colors/);
  assert.doesNotMatch(css, /pointer-events|position:|filter:|visibility:|display:\s*none|border-left|border-inline-start/);
  const js = await readFile(new URL('../src/reading-focus.js', import.meta.url), 'utf8');
  assert.doesNotMatch(js, /preventDefault\(|stopPropagation\(|\.focus\(|setAttribute\(['"](?:hidden|inert|aria-hidden|tabindex)/);
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  assert.match(app, /function setCardExpanded[^]*?readingFocusController\?\.setExpanded\(shell, expanded\)/);
  assert.match(app, /function renderDirectory[^]*?readingFocusController\?\.refresh\(\)/);
  const entry = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.ok(entry.includes('href="./src/reading-focus.css"'));
  assert.ok(app.includes('from "./reading-focus.js"'));
  const release = await readFile(new URL('../.github/workflows/pages.yml', import.meta.url), 'utf8');
  assert.ok(release.includes("await verifiedFile('src/reading-focus.js'"));
  assert.ok(release.includes("await verifiedFile('src/reading-focus.css'"));
});
