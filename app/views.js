// The pages of NusaStat, one function per hash route. Each returns HTML;
// main.js inserts it, draws its charts and wires its controls. Every figure
// on a page names its source and year in the footnote under the chart.

import {
  AGE_2024, CPI_GROUPS_2024, FACTS_2024, INDICATORS, META, PROVINCES,
  RELEASES, SECTORS_2024, UNEMP_BY_EDU_2024, YEARS,
} from './data.js';

const SECTOR_COLORS = ['#0e7a6d', '#e08a1e', '#2b6cb0', '#6b46c1', '#c0392b', '#718096', '#38a169', '#d69e2e', '#4a5568'];

function kpiCards(year) {
  const keys = ['population', 'gdpGrowth', 'inflation', 'unemployment', 'poverty', 'hdi'];
  return keys.map((k) => {
    const ind = INDICATORS[k];
    const prev = ind.values[year - 1];
    const cur = ind.values[year];
    const delta = prev === undefined ? '' : `<span class="delta">${cur > prev ? '▲' : cur < prev ? '▼' : '—'} ${Math.abs(cur - prev).toFixed(2)} vs ${year - 1}</span>`;
    return `<article class="kpi"><h3>${ind.label}</h3><p class="big">${ind.format(cur)} <span class="unit">${ind.unit}</span></p>${delta}<p class="src">${ind.source}</p></article>`;
  }).join('');
}

function yearPicker(current) {
  return `<div class="picker" role="group" aria-label="Choose a year">${YEARS.map((y) =>
    `<button type="button" data-year="${y}" class="${y === current ? 'on' : ''}" aria-pressed="${y === current}">${y}</button>`).join('')}</div>`;
}

export function overview() {
  return `
  <section class="hero">
    <p class="eyebrow">Official statistics · ${META.country}</p>
    <h1>Indonesia in numbers</h1>
    <p class="lede">Population, prices, jobs and growth — the headline figures for
    281.6 million people, from the surveys and accounts of BPS, Statistics Indonesia.
    Pick a year, open a topic, and every figure shows where it came from.</p>
    <p class="hero-meta">Latest release: October 2026 · Next release: 1 December 2026 · All figures free to reuse with attribution</p>
  </section>
  <section aria-label="Key indicators for 2024">
    <div class="section-head"><h2>Key indicators, 2024</h2>${yearPicker(2024)}</div>
    <div class="kpis" id="kpis">${kpiCards(2024)}</div>
  </section>
  <section class="split">
    <div class="card">
      <h2>Population, 2019–2024</h2>
      <p class="hint">Growth has slowed to about 1% a year as births fall and the population ages.</p>
      <canvas id="chart-pop" class="chart" height="260" aria-label="Line chart of population 2019 to 2024"></canvas>
      <p class="src">Source: ${INDICATORS.population.source}</p>
    </div>
    <div class="card">
      <h2>Latest releases</h2>
      <ul class="releases">${RELEASES.map((r) =>
        `<li><span class="tag">${r.tag}</span><strong>${r.title}</strong><span class="date">${r.date}</span></li>`).join('')}</ul>
      <p class="src">Release calendar: first working day of each month, 11:00 WIB.</p>
    </div>
  </section>
  <section class="card">
    <h2>At a glance, 2024</h2>
    <dl class="facts">${FACTS_2024.map((f) =>
      `<div><dt>${f.label}</dt><dd>${f.value}</dd><dd class="note">${f.note}</dd></div>`).join('')}</dl>
  </section>`;
}

export function population(year) {
  const pop = INDICATORS.population;
  return `
  <section class="page-head">
    <p class="eyebrow">People · Population</p>
    <h1>281.6 million people, and growing slower</h1>
    <p class="lede">Indonesia is the world's fourth most populous country. The population
    grows by about 2.9 million a year — down from 3.3 million a decade ago — and
    more than half of it lives on Java.</p>
    ${yearPicker(year)}
  </section>
  <section class="split">
    <div class="card">
      <h2>Population in ${year}</h2>
      <p class="big-number">${pop.format(pop.values[year])} <span class="unit">million people</span></p>
      <p class="hint">2020 Census counted 270.20 million; the 2024 figure is the official projection from it.</p>
      <canvas id="chart-pop-line" class="chart" height="240" aria-label="Line chart of population 2019 to 2024"></canvas>
      <p class="src">Source: ${pop.source}</p>
    </div>
    <div class="card">
      <h2>Who we are, 2024</h2>
      <p class="hint">Seven in ten Indonesians are of working age — a demographic dividend that peaks around 2030.</p>
      <canvas id="chart-age" class="chart" height="240" aria-label="Bar chart of age groups 2024"></canvas>
      <p class="src">Source: BPS population projection, 2024.</p>
    </div>
  </section>
  <section class="card">
    <h2>Where people live</h2>
    <p class="hint">Java holds 55% of the population on 7% of the land. Jakarta is the densest province by far.</p>
    <table class="data"><thead><tr><th>Province</th><th>Population (m)</th><th>Density (per km²)</th><th>HDI</th><th>Poverty (%)</th></tr></thead>
    <tbody>${PROVINCES.slice(0, 6).map((p) =>
      `<tr><td>${p.name}</td><td>${p.pop.toFixed(2)}</td><td>${p.density.toLocaleString('en-US')}</td><td>${p.hdi.toFixed(2)}</td><td>${p.poverty.toFixed(2)}</td></tr>`).join('')}</tbody></table>
    <p><a class="more" href="#/regions">See all 12 provinces in the table →</a></p>
    <p class="src">Source: BPS population projection and Human Development Index, 2024.</p>
  </section>`;
}

export function economy() {
  return `
  <section class="page-head">
    <p class="eyebrow">Economy · Growth &amp; trade</p>
    <h1>An economy of Rp 22,139 trillion</h1>
    <p class="lede">Indonesia's economy grew 5.03% in 2024 — its fifth straight year above 5%
    outside the pandemic slump of 2020 — driven by household spending and manufacturing.</p>
  </section>
  <section class="split">
    <div class="card">
      <h2>Real GDP growth, 2019–2024</h2>
      <p class="hint">The 2020 contraction (−2.07%) was the first since the 1998 crisis; growth has held above 5% since 2022.</p>
      <canvas id="chart-gdp" class="chart" height="260" aria-label="Line chart of real GDP growth 2019 to 2024"></canvas>
      <p class="src">Source: ${INDICATORS.gdpGrowth.source}</p>
    </div>
    <div class="card">
      <h2>What makes the economy, 2024</h2>
      <p class="hint">Manufacturing is the largest single sector, but services together are more than half of GDP.</p>
      <canvas id="chart-sectors" class="chart" height="260" aria-label="Donut chart of GDP by sector 2024"></canvas>
      <p class="src">Source: BPS, National Accounts 2024.</p>
    </div>
  </section>
  <section class="card">
    <h2>Trade, 2024</h2>
    <dl class="facts">${FACTS_2024.slice(3, 6).map((f) =>
      `<div><dt>${f.label}</dt><dd>${f.value}</dd><dd class="note">${f.note}</dd></div>`).join('')}</dl>
    <p class="hint">The surplus has run for 56 straight months, led by coal, palm oil and nickel products.
    China takes about a quarter of exports; the United States and Japan follow.</p>
    <p class="src">Source: BPS, Foreign Trade Statistics 2024.</p>
  </section>`;
}

export function prices() {
  return `
  <section class="page-head">
    <p class="eyebrow">Prices · Inflation</p>
    <h1>Inflation back inside target</h1>
    <p class="lede">Consumer prices rose 1.57% in December 2024 — the lowest year-end inflation
    in five years and inside Bank Indonesia's 1.5–3.5% target band, after the 5.51% spike of 2022.</p>
  </section>
  <section class="split">
    <div class="card">
      <h2>Inflation, December, 2019–2024</h2>
      <p class="hint">The 2022 peak followed the subsidised-fuel price rise in September that year.</p>
      <canvas id="chart-cpi" class="chart" height="260" aria-label="Line chart of inflation 2019 to 2024"></canvas>
      <p class="src">Source: ${INDICATORS.inflation.source}</p>
    </div>
    <div class="card">
      <h2>What pushed prices in 2024</h2>
      <p class="hint">Personal care led the rise; information and communication was the only group to fall.</p>
      <canvas id="chart-cpi-groups" class="chart" height="260" aria-label="Bar chart of inflation by spending group, December 2024"></canvas>
      <p class="src">Source: BPS, Consumer Price Index, December 2024.</p>
    </div>
  </section>
  <section class="card">
    <h2>How inflation is measured</h2>
    <p class="hint">BPS prices a fixed basket of goods and services in 90 cities every month, weighted by
    what households actually spend. The basket was last rebased in 2018; food is about a fifth of it,
    housing about a quarter. The monthly release lands on the first working day of the next month.</p>
    <p class="src">Source: BPS, Consumer Price Index methodology.</p>
  </section>`;
}

export function employment() {
  return `
  <section class="page-head">
    <p class="eyebrow">Jobs · Employment</p>
    <h1>Unemployment at its lowest in six years</h1>
    <p class="lede">4.91% of the labour force was out of work in August 2024 — down from the pandemic
    peak of 7.07% in 2020 — but six in ten workers are still in informal jobs.</p>
  </section>
  <section class="split">
    <div class="card">
      <h2>Open unemployment, August, 2019–2024</h2>
      <p class="hint">The labour force is about 152 million people; 144.6 million were working in August 2024.</p>
      <canvas id="chart-unemp" class="chart" height="260" aria-label="Line chart of unemployment 2019 to 2024"></canvas>
      <p class="src">Source: ${INDICATORS.unemployment.source}</p>
    </div>
    <div class="card">
      <h2>Unemployment by schooling, Aug 2024</h2>
      <p class="hint">Vocational high-school graduates face the highest rate — 8.26% — a long-running
      mismatch between what schools teach and what employers need.</p>
      <canvas id="chart-edu" class="chart" height="260" aria-label="Bar chart of unemployment by education, August 2024"></canvas>
      <p class="src">Source: BPS, National Labour Force Survey, August 2024.</p>
    </div>
  </section>
  <section class="card">
    <h2>Where Indonesians work</h2>
    <p class="hint">Agriculture still employs 28% of workers, services 50%, and manufacturing 19%.
    Informal work — self-employed without help, unpaid family workers, casual labour — is 59% of all jobs,
    and it pays less and carries no social security. Formalising work is the labour market's biggest task.</p>
    <p class="src">Source: BPS, National Labour Force Survey, August 2024.</p>
  </section>`;
}

export function regions(state) {
  const q = (state.q || '').toLowerCase();
  const rows = PROVINCES.filter((p) => p.name.toLowerCase().includes(q));
  const sorted = [...rows].sort((a, b) => {
    const k = state.sort || 'pop';
    if (k === 'name') return state.dir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    return state.dir === 'asc' ? a[k] - b[k] : b[k] - a[k];
  });
  const arrow = (k) => (state.sort === k ? (state.dir === 'asc' ? ' ↑' : ' ↓') : '');
  return `
  <section class="page-head">
    <p class="eyebrow">Regions · Provinces</p>
    <h1>38 provinces, one table</h1>
    <p class="lede">Search a province, sort any column. The twelve most populous provinces below
    hold 87% of the country; the other 26 — including all of Papua and Maluku — hold the rest.</p>
    <div class="toolbar">
      <label>Search provinces <input id="prov-search" type="search" placeholder="e.g. Java" value="${state.q || ''}"></label>
      <span class="count">${sorted.length} of ${PROVINCES.length} shown</span>
    </div>
  </section>
  <section class="card">
    <table class="data sortable"><thead><tr>
      <th><button type="button" data-sort="name">Province${arrow('name')}</button></th>
      <th><button type="button" data-sort="pop">Population (m)${arrow('pop')}</button></th>
      <th><button type="button" data-sort="density">Density (per km²)${arrow('density')}</button></th>
      <th><button type="button" data-sort="hdi">HDI${arrow('hdi')}</button></th>
      <th><button type="button" data-sort="poverty">Poverty (%)${arrow('poverty')}</button></th>
    </tr></thead>
    <tbody>${sorted.map((p) =>
      `<tr><td>${p.name}</td><td>${p.pop.toFixed(2)}</td><td>${p.density.toLocaleString('en-US')}</td><td>${p.hdi.toFixed(2)}</td><td>${p.poverty.toFixed(2)}</td></tr>`).join('') || '<tr><td colspan="5">No province matches that search.</td></tr>'}</tbody></table>
    <p class="src">Sources: BPS population projection 2024; BPS Human Development Index 2024; BPS Poverty Profile, September 2024. Density = people per km² of land area.</p>
  </section>
  <section class="card">
    <h2>Reading the table</h2>
    <p class="hint">Jakarta's HDI (82.36) is the highest in the country and its poverty rate (4.14%) the lowest —
    but it is also the densest, at 16,125 people per km². At the other end, Lampung's poverty rate (10.69%)
    is nearly triple Jakarta's, and East Kalimantan's HDI (78.20) leads outside Java.</p>
  </section>`;
}

export function about() {
  return `
  <section class="page-head">
    <p class="eyebrow">About · Sources &amp; method</p>
    <h1>Where every number comes from</h1>
    <p class="lede">NusaStat is an independent reader's guide to Indonesia's official statistics.
    It is not affiliated with BPS. Every figure on this site is a published BPS figure, named with its
    release so you can check it — nothing here is estimated by us.</p>
  </section>
  <section class="card">
    <h2>Sources</h2>
    <ul class="sources">
      <li><strong>Population</strong> — 2020 Population Census and the official 2020–2024 projection.</li>
      <li><strong>Economy</strong> — National Accounts (quarterly GDP) and Foreign Trade Statistics.</li>
      <li><strong>Prices</strong> — Consumer Price Index, priced monthly in 90 cities.</li>
      <li><strong>Jobs</strong> — National Labour Force Survey (Sakernas), every February and August.</li>
      <li><strong>People</strong> — Human Development Index and Poverty Profile, annual and semiannual.</li>
    </ul>
    <p class="hint">Figures are rounded as published. Where a release revises an earlier figure — GDP is
    revised each quarter — this site shows the latest vintage. Last updated ${META.updated}.</p>
  </section>
  <section class="card">
    <h2>Reuse</h2>
    <p class="hint">All figures are free to reuse with attribution to BPS — Statistics Indonesia.
    Charts on this site are drawn from the published figures; download the underlying numbers from the
    BPS website (bps.go.id) or the release pages linked in each section's source note.</p>
  </section>`;
}

export function missing() {
  return `<section class="page-head"><h1>Page not found</h1>
  <p class="lede">That section does not exist. Try one of the topics above.</p>
  <p><a class="more" href="#/">Back to the overview →</a></p></section>`;
}

export { AGE_2024, CPI_GROUPS_2024, SECTORS_2024, SECTOR_COLORS, UNEMP_BY_EDU_2024 };
