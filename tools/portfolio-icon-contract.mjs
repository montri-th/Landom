import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

export const ICON_SET_ID = 'iconset.landometer.portfolio.symbol.01';
export const ICON_SOURCE_MANIFEST_SHA = 'aea8f5a7f9793c14a6b183706627e4c2390388b7d8c49129eceacdd9b0bce7a4';
export const ICON_DIRECTORY = 'public/assets/brand/icons';
export const ICON_MANIFEST_PATH = `${ICON_DIRECTORY}/icon-set.json`;
export const PORTFOLIO_ICONS = [
  [16, 'favicon', 768, 'c100627d5e8fc9d21d168dbf15f9fdab7f5d6931b04df5164e58137df77feca8'],
  [32, 'favicon', 1773, '5cd19dee724f1a72b2bdcd41467a26e03f76a4bc2d7bd1fe12de6b8b5de665c9'],
  [48, 'favicon', 2897, '443857069292f6910b9e5cc0383cab6da4273acf1e18a47745864729fc46e08e'],
  [180, 'apple-touch', 8893, '41ac1e302345d29d791fcc26a5e7111aeb3a4e222dff63685743b43d0fdd6ef0'],
  [192, 'manifest', 11929, '1d8bbd3d8656a83f33c51364d333bba7ca328faf3ae713238fa9450f7810bf8e'],
  [512, 'manifest-maskable', 28124, 'd8939f6cc7891c47bbb3dce1ddb04d4c30ce4c7e78e29f6fb0061858dafc881f']
].map(([sizePx, role, bytes, sha256]) => ({ sizePx, role, bytes, sha256, file: `icon-portfolio-${sizePx}-${sha256.slice(0, 12)}.png`, path: `${ICON_DIRECTORY}/icon-portfolio-${sizePx}-${sha256.slice(0, 12)}.png` }));

export const expectedManifestIcons = () => PORTFOLIO_ICONS.filter((icon) => icon.role.startsWith('manifest')).map((icon) => ({
  src: `/Landom/${icon.path}`, sizes: `${icon.sizePx}x${icon.sizePx}`, type: 'image/png', purpose: icon.role === 'manifest-maskable' ? 'maskable' : 'any'
}));

export function validateIconHtml(html) {
  const errors = [];
  const declared = html.match(/<link\b[^>]*\brel=["'](?:icon|apple-touch-icon)["'][^>]*>/gi) || [];
  const expected = PORTFOLIO_ICONS.filter((icon) => icon.role === 'favicon' || icon.role === 'apple-touch');
  if (declared.length !== expected.length) errors.push('Expected exactly three favicons and one approved touch icon.');
  for (const icon of expected) {
    const rel = icon.role === 'favicon' ? 'icon' : 'apple-touch-icon';
    if (!declared.some((link) => link.includes(`rel="${rel}"`) && link.includes('type="image/png"') && link.includes(`sizes="${icon.sizePx}x${icon.sizePx}"`) && link.includes(`href="./${icon.path}"`))) errors.push(`Missing exact ${icon.sizePx}px ${icon.role} declaration.`);
  }
  return errors;
}

export async function validatePortfolioIconSet(root) {
  const errors = [];
  const bytes = await readFile(path.join(root, ICON_MANIFEST_PATH));
  const manifest = JSON.parse(bytes);
  if (manifest.iconSetId !== ICON_SET_ID || manifest.dsVersion !== '0.9.7' || manifest.sourceManifestSha256 !== ICON_SOURCE_MANIFEST_SHA || manifest.files?.length !== 6) errors.push('Invalid current approved portfolio icon manifest.');
  for (const icon of PORTFOLIO_ICONS) {
    const record = manifest.files?.find((item) => item.sizePx === icon.sizePx);
    if (!record || ['role', 'file', 'bytes', 'sha256'].some((key) => record[key] !== icon[key])) errors.push(`Icon manifest differs from approved ${icon.sizePx}px role/bytes.`);
    const image = await readFile(path.join(root, icon.path));
    if (image.length !== icon.bytes || createHash('sha256').update(image).digest('hex') !== icon.sha256 || image.readUInt32BE(16) !== icon.sizePx || image.readUInt32BE(20) !== icon.sizePx) errors.push(`Exact approved ${icon.sizePx}px PNG does not match.`);
  }
  return { errors, manifestSha256: createHash('sha256').update(bytes).digest('hex') };
}
