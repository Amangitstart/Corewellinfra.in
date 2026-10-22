// Turns the on-screen business card (an SVG) into a PNG in the browser.

import { site } from '../config/site.js';

export const CARD_WIDTH = 1050;
export const CARD_HEIGHT = 600;
const SCALE = 2; // 2100 x 1200 pixels

export const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
export const cardFileName = (extension) => `business-card-${slugify(site.name)}.${extension}`;

// Draws the SVG onto a canvas.
function renderCard(svgElement) {
  return new Promise((resolve, reject) => {
    const copy = svgElement.cloneNode(true);
    copy.removeAttribute('id');
    copy.setAttribute('width', CARD_WIDTH);
    copy.setAttribute('height', CARD_HEIGHT);
    if (!copy.getAttribute('xmlns')) copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const xml = new XMLSerializer().serializeToString(copy);
    const image = new Image();
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = CARD_WIDTH * SCALE;
        canvas.height = CARD_HEIGHT * SCALE;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas);
      } catch (error) { reject(error); }
    };
    image.onerror = () => reject(new Error('Could not draw the card'));
    image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
  });
}

export const canvasToBlob = (canvas, type, quality) =>
  new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not create the file'))), type, quality));

export const makePng = async (svg) => canvasToBlob(await renderCard(svg), 'image/png');

export function downloadBlob(blob, fileName) {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url; link.download = fileName; link.rel = 'noopener';
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try { await navigator.clipboard.writeText(text); return true; } catch { /* fall through */ }
  }
  const box = document.createElement('textarea');
  box.value = text; box.setAttribute('readonly', '');
  box.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
  document.body.appendChild(box); box.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch { ok = false; }
  box.remove();
  return ok;
}
