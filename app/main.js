// NusaStat router: one page per hash route, charts drawn after each render,
// controls wired after each render. No network anywhere: all data is in
// data.js and every chart is drawn on <canvas> by charts.js.
//
//   #/               overview — key indicators, population chart, releases
//   #/population     people, with a year picker
//   #/economy        growth, sectors, trade
//   #/prices         inflation and its drivers
//   #/employment     jobs and schooling
//   #/regions        searchable, sortable province table
//   #/about          sources and method
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { AGE_2024, CPI_GROUPS_2024, INDICATORS, SECTORS_2024, UNEMP_BY_EDU_2024, YEARS } from './data.js';
import { drawBars, drawDonut, drawLine } from './charts.js';
import { about, economy, employment, missing, overview, population, prices, regions, SECTOR_COLORS } from './views.js';

const app = document.getElementById('app');
const state = { year: 2024, q: '', sort: 'pop', dir: 'desc' };

function series(ind) {
  return YEARS.map((y) => ({ x: y, y: ind.values[y] }));
}

function draw(id, fn) {
  const el = document.getElementById(id);
  if (el) fn(el);
}

function render() {
  window.__shotReady = false;
  const hash = location.hash || '#/';
  const nav = document.querySelectorAll('nav a');
  nav.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === hash || (hash === '#/' && a.getAttribute('href') === '#/')));

  if (hash === '#/' || hash === '') {
    app.innerHTML = overview();
    draw('chart-pop', (c) => drawLine(c, series(INDICATORS.population), { label: (v) => v.toFixed(1), tick: (v) => v.toFixed(0) }));
    wireYearPicker((y) => { state.year = y; renderYearKpis(y); });
  } else if (hash === '#/population') {
    app.innerHTML = population(state.year);
    draw('chart-pop-line', (c) => drawLine(c, series(INDICATORS.population), { label: (v) => v.toFixed(1), tick: (v) => v.toFixed(0) }));
    draw('chart-age', (c) => drawBars(c, AGE_2024.map((a) => ({ label: a.group, value: a.share })), { label: (v) => v.toFixed(1) + '%', labelWidth: 110 }));
    wireYearPicker((y) => { state.year = y; render(); });
  } else if (hash === '#/economy') {
    app.innerHTML = economy();
    draw('chart-gdp', (c) => drawLine(c, series(INDICATORS.gdpGrowth), { label: (v) => v.toFixed(2) + '%', tick: (v) => v.toFixed(0) + '%' }));
    draw('chart-sectors', (c) => drawDonut(c, SECTORS_2024.map((s, i) => ({ label: s.name, value: s.share, color: SECTOR_COLORS[i % SECTOR_COLORS.length] }))));
  } else if (hash === '#/prices') {
    app.innerHTML = prices();
    draw('chart-cpi', (c) => drawLine(c, series(INDICATORS.inflation), { label: (v) => v.toFixed(2) + '%', tick: (v) => v.toFixed(0) + '%' }));
    draw('chart-cpi-groups', (c) => drawBars(c, CPI_GROUPS_2024.map((g) => ({ label: g.group, value: g.rate })), { label: (v) => v.toFixed(2) + '%', labelWidth: 210 }));
  } else if (hash === '#/employment') {
    app.innerHTML = employment();
    draw('chart-unemp', (c) => drawLine(c, series(INDICATORS.unemployment), { label: (v) => v.toFixed(2) + '%', tick: (v) => v.toFixed(0) + '%' }));
    draw('chart-edu', (c) => drawBars(c, UNEMP_BY_EDU_2024.map((e) => ({ label: e.level, value: e.rate })), { label: (v) => v.toFixed(2) + '%', labelWidth: 210 }));
  } else if (hash === '#/regions') {
    app.innerHTML = regions(state);
    const input = document.getElementById('prov-search');
    if (input) {
      input.addEventListener('input', () => { state.q = input.value; rerenderRegions(input); });
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') e.preventDefault(); });
    }
    document.querySelectorAll('[data-sort]').forEach((b) => b.addEventListener('click', () => {
      const k = b.dataset.sort;
      if (state.sort === k) state.dir = state.dir === 'asc' ? 'desc' : 'asc';
      else { state.sort = k; state.dir = k === 'name' ? 'asc' : 'desc'; }
      render();
    }));
  } else if (hash === '#/about') {
    app.innerHTML = about();
  } else {
    app.innerHTML = missing();
  }
  document.title = `${document.querySelector('h1')?.textContent || 'NusaStat'} | NusaStat — Statistik Indonesia`;
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

// Re-render only the regions table body on search, keeping focus in the box.
function rerenderRegions(input) {
  const pos = input.selectionStart;
  render();
  const next = document.getElementById('prov-search');
  if (next) { next.focus(); next.setSelectionRange(pos, pos); }
}

function wireYearPicker(onPick) {
  document.querySelectorAll('[data-year]').forEach((b) => b.addEventListener('click', () => onPick(Number(b.dataset.year))));
}

// On the overview the year picker swaps just the KPI cards, not the page.
function renderYearKpis(year) {
  const keys = ['population', 'gdpGrowth', 'inflation', 'unemployment', 'poverty', 'hdi'];
  const wrap = document.getElementById('kpis');
  if (!wrap) return;
  wrap.innerHTML = keys.map((k) => {
    const ind = INDICATORS[k];
    const prev = ind.values[year - 1];
    const cur = ind.values[year];
    const delta = prev === undefined ? '' : `<span class="delta">${cur > prev ? '▲' : cur < prev ? '▼' : '—'} ${Math.abs(cur - prev).toFixed(2)} vs ${year - 1}</span>`;
    return `<article class="kpi"><h3>${ind.label}</h3><p class="big">${ind.format(cur)} <span class="unit">${ind.unit}</span></p>${delta}<p class="src">${ind.source}</p></article>`;
  }).join('');
  document.querySelectorAll('[data-year]').forEach((b) => {
    b.classList.toggle('on', Number(b.dataset.year) === year);
    b.setAttribute('aria-pressed', String(Number(b.dataset.year) === year));
  });
  document.querySelector('.section-head h2').textContent = `Key indicators, ${year}`;
}

window.addEventListener('hashchange', render);
render();
