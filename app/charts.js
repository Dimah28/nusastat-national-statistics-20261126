// Charts drawn on <canvas> with no library: a line chart and a horizontal
// bar chart, both deterministic — same data, same pixels, every run.
// Each chart reads its canvas size from the element and scales for the
// device pixel ratio so the lines stay crisp on desktop and on a phone.

const INK = '#17324a';
const GRID = '#d9e2e8';
const TEAL = '#0e7a6d';
const AMBER = '#e08a1e';
const RED = '#c0392b';

function setup(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);
  return { ctx, w, h };
}

function niceMax(v) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

function niceMin(v) {
  if (v >= 0) return 0;
  const p = Math.pow(10, Math.floor(Math.log10(-v)));
  const n = -v / p;
  return -(n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

// Line chart over years. `points` is [{x: 2019, y: 5.02}, ...].
export function drawLine(canvas, points, opts = {}) {
  const { ctx, w, h } = setup(canvas);
  const padL = 52, padR = 16, padT = 14, padB = 30;
  const ys = points.map((p) => p.y);
  const max = niceMax(Math.max(...ys));
  const min = niceMin(Math.min(...ys));
  const span = max - min || 1;
  const xAt = (i) => padL + (i * (w - padL - padR)) / Math.max(points.length - 1, 1);
  const yAt = (v) => padT + ((max - v) / span) * (h - padT - padB);

  ctx.font = '12px system-ui, sans-serif';
  ctx.fillStyle = '#5a6b78';
  ctx.strokeStyle = GRID;
  ctx.lineWidth = 1;
  const steps = 4;
  for (let s = 0; s <= steps; s++) {
    const v = min + (span * s) / steps;
    const y = yAt(v);
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(opts.tick ? opts.tick(v) : v.toFixed(0), padL - 8, y + 4);
  }
  if (min < 0 && max > 0) {
    ctx.strokeStyle = '#9aa9b5';
    ctx.beginPath(); ctx.moveTo(padL, yAt(0)); ctx.lineTo(w - padR, yAt(0)); ctx.stroke();
  }
  ctx.textAlign = 'center';
  points.forEach((p, i) => ctx.fillText(String(p.x), xAt(i), h - 8));

  ctx.strokeStyle = opts.color || TEAL;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  points.forEach((p, i) => (i === 0 ? ctx.moveTo(xAt(i), yAt(p.y)) : ctx.lineTo(xAt(i), yAt(p.y))));
  ctx.stroke();
  points.forEach((p, i) => {
    ctx.fillStyle = opts.color || TEAL;
    ctx.beginPath(); ctx.arc(xAt(i), yAt(p.y), 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = INK;
    ctx.textAlign = 'center';
    ctx.fillText(opts.label ? opts.label(p.y) : p.y.toFixed(1), xAt(i), yAt(p.y) - 10);
  });
}

// Horizontal bars. `rows` is [{label, value}], drawn largest first.
export function drawBars(canvas, rows, opts = {}) {
  const { ctx, w, h } = setup(canvas);
  const sorted = [...rows].sort((a, b) => b.value - a.value);
  const max = niceMax(Math.max(...sorted.map((r) => r.value)));
  const rowH = (h - 8) / sorted.length;
  const barH = Math.min(22, rowH - 10);
  const labelW = opts.labelWidth || 190;
  ctx.font = '12px system-ui, sans-serif';
  sorted.forEach((r, i) => {
    const y = 4 + i * rowH + (rowH - barH) / 2;
    const bw = ((w - labelW - 70) * r.value) / max;
    ctx.fillStyle = INK;
    ctx.textAlign = 'left';
    ctx.fillText(r.label, 0, y + barH / 2 + 4);
    ctx.fillStyle = opts.color || TEAL;
    ctx.fillRect(labelW, y, Math.max(bw, 2), barH);
    ctx.fillStyle = INK;
    ctx.textAlign = 'left';
    ctx.fillText(opts.label ? opts.label(r.value) : r.value.toFixed(1), labelW + bw + 8, y + barH / 2 + 4);
  });
}

// Donut of shares that add to 100. `rows` is [{label, value, color}].
export function drawDonut(canvas, rows) {
  const { ctx, w, h } = setup(canvas);
  const cx = 92, cy = h / 2, r = Math.min(78, h / 2 - 10), inner = r * 0.58;
  let a = -Math.PI / 2;
  rows.forEach((row) => {
    const sweep = (row.value / 100) * Math.PI * 2;
    ctx.fillStyle = row.color;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, a, a + sweep);
    ctx.closePath(); ctx.fill();
    a += sweep;
  });
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(cx, cy, inner, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = INK;
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('100%', cx, cy - 2);
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = '#5a6b78';
  ctx.fillText('of GDP', cx, cy + 14);
  ctx.font = '12px system-ui, sans-serif';
  ctx.textAlign = 'left';
  let y = 16;
  rows.forEach((row) => {
    ctx.fillStyle = row.color;
    ctx.fillRect(196, y - 9, 10, 10);
    ctx.fillStyle = INK;
    ctx.fillText(`${row.label} — ${row.value.toFixed(1)}%`, 212, y);
    y += 22;
  });
}

export const CHART_COLORS = { teal: TEAL, amber: AMBER, red: RED, ink: INK };
