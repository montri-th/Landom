import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { clamp, parallaxBleedLimit, parallaxOffset } from "../src/media-parallax.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "src/media-parallax.js"), "utf8");

test("clamp handles bounds, reversed ranges, and non-finite input", () => {
  assert.equal(clamp(12, 0, 24), 12);
  assert.equal(clamp(40, 0, 24), 24);
  assert.equal(clamp(-4, 0, 24), 0);
  assert.equal(clamp(12, 24, 0), 12);
  assert.equal(clamp(Number.NaN, 3, 9), 3);
  assert.equal(clamp(4, Number.NaN, 9), 0);
});

test("parallax offset is centered, directional, and bounded by depth", () => {
  const centered = parallaxOffset({
    elementTop: 300,
    elementHeight: 200,
    viewportHeight: 800,
    depth: 18
  });
  const above = parallaxOffset({
    elementTop: -200,
    elementHeight: 200,
    viewportHeight: 800,
    depth: 18
  });
  const below = parallaxOffset({
    elementTop: 800,
    elementHeight: 200,
    viewportHeight: 800,
    depth: 18
  });

  assert.equal(centered, 0);
  assert.ok(above > 0);
  assert.ok(below < 0);
  assert.ok(Math.abs(above) <= 18);
  assert.ok(Math.abs(below) <= 18);
});

test("parallax depth is capped at 36px and malformed geometry is static", () => {
  assert.equal(parallaxOffset({
    elementTop: 10000,
    elementHeight: 200,
    viewportHeight: 800,
    depth: 200
  }), -36);
  assert.equal(parallaxOffset({
    elementTop: -10000,
    elementHeight: 200,
    viewportHeight: 800,
    depth: 200
  }), 36);
  assert.equal(parallaxOffset({ elementTop: 0, elementHeight: 0, viewportHeight: 800, depth: 18 }), 0);
  assert.equal(parallaxOffset({ elementTop: 0, elementHeight: 200, viewportHeight: 0, depth: 18 }), 0);
  assert.equal(parallaxOffset({ elementTop: Number.NaN, elementHeight: 200, viewportHeight: 800, depth: 18 }), 0);
});

test("parallax motion stays inside the visual bleed supplied by image scale", () => {
  assert.ok(Math.abs(parallaxBleedLimit(200, 1.1) - 9) < Number.EPSILON * 64);
  assert.equal(parallaxBleedLimit(200, 1), 0);
  assert.equal(parallaxBleedLimit(0, 1.2), 0);

  assert.ok(Math.abs(parallaxOffset({
    elementTop: 10000,
    elementHeight: 200,
    viewportHeight: 800,
    depth: 36,
    maxOffset: 9
  }) + 9) < Number.EPSILON * 64);
});

test("runtime contract is explicit, passive, gated, lifecycle-safe, and non-intercepting", () => {
  assert.match(source, /const MEDIA_SELECTOR = "img\[data-parallax-media\]";/);
  assert.match(source, /new win\.IntersectionObserver/);
  assert.match(source, /addWindowListener\("scroll", onScroll, \{ passive: true \}\)/);
  assert.match(source, /if \(frame \|\| isMotionBlocked\(\)\) return;\s*frame = win\.requestAnimationFrame\(updateVisibleImages\);/);
  assert.match(source, /clamp\(image\.dataset\.parallaxDepth, 0, MAX_DEPTH\)/);
  assert.match(source, /maxOffset: parallaxBleedLimit\(frameRect\.height, scale\)/);
  assert.match(source, /image\.parentElement\?\.getBoundingClientRect\?\.\(\)/);
  assert.match(source, /MAX_DEPTH = 36/);
  assert.match(source, /translate3d\(0, \$\{offset\.toFixed\(2\)\}px, 0\) scale\(var\(--media-parallax-scale, 1\.06\)\)/);
  assert.match(source, /connection\?\.saveData === true/);
  assert.match(source, /onBeforePrint[\s\S]*?onPageHide[\s\S]*?clearMotionState/);
  assert.match(source, /refresh\(scope = doc\)/);
  assert.match(source, /destroy\(\)/);
  assert.doesNotMatch(source, /preventDefault|scrollTo|scrollBy|scrollIntoView/);
});
