// NusaStat data: published national figures for Indonesia, each with its
// source and year. Figures are the headline numbers BPS — Statistics
// Indonesia publishes in its Statistical Yearbook and news releases; they
// are quoted here as the site's own dataset, with the source named on every
// page so a visitor can check them.

export const META = {
  country: 'Indonesia',
  updated: 'November 2026',
  source: 'BPS — Statistics Indonesia',
};

export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

// Headline indicators, one value per year. `unit` is shown beside the value.
export const INDICATORS = {
  population: {
    label: 'Population',
    unit: 'million people',
    format: (v) => v.toFixed(2),
    source: 'BPS, Population Projection 2020–2024',
    values: { 2019: 266.91, 2020: 270.20, 2021: 272.68, 2022: 275.77, 2023: 278.69, 2024: 281.60 },
  },
  gdpGrowth: {
    label: 'Real GDP growth',
    unit: '% per year',
    format: (v) => (v > 0 ? '+' : '') + v.toFixed(2),
    source: 'BPS, National Accounts 2024',
    values: { 2019: 5.02, 2020: -2.07, 2021: 3.70, 2022: 5.31, 2023: 5.05, 2024: 5.03 },
  },
  gdpNominal: {
    label: 'GDP, current prices',
    unit: 'Rp trillion',
    format: (v) => v.toLocaleString('en-US'),
    source: 'BPS, National Accounts 2024',
    values: { 2019: 15834, 2020: 15443, 2021: 16977, 2022: 19588, 2023: 20892, 2024: 22139 },
  },
  inflation: {
    label: 'Inflation (December, y-on-y)',
    unit: '%',
    format: (v) => v.toFixed(2),
    source: 'BPS, Consumer Price Index, December releases',
    values: { 2019: 2.72, 2020: 1.68, 2021: 1.87, 2022: 5.51, 2023: 2.61, 2024: 1.57 },
  },
  unemployment: {
    label: 'Open unemployment rate (August)',
    unit: '% of labour force',
    format: (v) => v.toFixed(2),
    source: 'BPS, National Labour Force Survey (Sakernas)',
    values: { 2019: 5.28, 2020: 7.07, 2021: 6.49, 2022: 5.86, 2023: 5.32, 2024: 4.91 },
  },
  poverty: {
    label: 'Poverty rate (September)',
    unit: '% of population',
    format: (v) => v.toFixed(2),
    source: 'BPS, Poverty Profile, September releases',
    values: { 2019: 9.22, 2020: 10.19, 2021: 9.71, 2022: 9.57, 2023: 9.36, 2024: 8.57 },
  },
  hdi: {
    label: 'Human Development Index',
    unit: 'index (0–100)',
    format: (v) => v.toFixed(2),
    source: 'BPS, Human Development Index 2024',
    values: { 2019: 71.92, 2020: 71.94, 2021: 72.29, 2022: 73.37, 2023: 74.39, 2024: 75.02 },
  },
  gini: {
    label: 'Gini ratio (September)',
    unit: '0–1',
    format: (v) => v.toFixed(3),
    source: 'BPS, Income Distribution, September releases',
    values: { 2019: 0.380, 2020: 0.385, 2021: 0.381, 2022: 0.381, 2023: 0.379, 2024: 0.379 },
  },
};

export const FACTS_2024 = [
  { label: 'GDP per capita', value: 'Rp 78.6 million', note: 'about US$ 4,960 · BPS, National Accounts 2024' },
  { label: 'Life expectancy at birth', value: '74.2 years', note: 'BPS, Human Development Index 2024' },
  { label: 'Mean years of schooling', value: '9.03 years', note: 'BPS, Human Development Index 2024' },
  { label: 'Exports (goods)', value: 'US$ 264.7 billion', note: 'BPS, Foreign Trade Statistics 2024' },
  { label: 'Imports (goods)', value: 'US$ 233.7 billion', note: 'BPS, Foreign Trade Statistics 2024' },
  { label: 'Trade balance', value: 'US$ 31.0 billion surplus', note: 'BPS, Foreign Trade Statistics 2024' },
  { label: 'Provinces', value: '38', note: 'Four new provinces in Papua since 2022 · Ministry of Home Affairs' },
  { label: 'Regencies and cities', value: '514', note: 'BPS, Statistical Yearbook of Indonesia 2025' },
];

// GDP by sector, share of GDP in 2024 (%). Source: BPS, National Accounts.
export const SECTORS_2024 = [
  { name: 'Manufacturing', share: 18.7 },
  { name: 'Wholesale & retail trade', share: 13.0 },
  { name: 'Agriculture, forestry & fishing', share: 12.5 },
  { name: 'Construction', share: 9.8 },
  { name: 'Mining & quarrying', share: 8.9 },
  { name: 'Transport & storage', share: 5.8 },
  { name: 'Information & communication', share: 4.3 },
  { name: 'Financial services', share: 4.2 },
  { name: 'All other services', share: 22.8 },
];

// Age structure, 2024 (% of population). Source: BPS population projection.
export const AGE_2024 = [
  { group: '0–14 years', share: 24.1 },
  { group: '15–24 years', share: 17.3 },
  { group: '25–54 years', share: 42.0 },
  { group: '55–64 years', share: 9.7 },
  { group: '65+ years', share: 6.9 },
];

// Consumer-price groups, inflation in December 2024 (y-on-y, %).
export const CPI_GROUPS_2024 = [
  { group: 'Food, beverages & tobacco', rate: 2.01 },
  { group: 'Clothing & footwear', rate: 1.10 },
  { group: 'Housing, water & electricity', rate: 0.54 },
  { group: 'Household equipment', rate: 0.92 },
  { group: 'Health', rate: 1.65 },
  { group: 'Transport', rate: 0.45 },
  { group: 'Information & communication', rate: -0.34 },
  { group: 'Recreation, sport & culture', rate: 1.39 },
  { group: 'Education', rate: 1.71 },
  { group: 'Food & beverage services', rate: 2.07 },
  { group: 'Personal care & other services', rate: 4.05 },
];

// Unemployment by highest education completed, August 2024 (%).
export const UNEMP_BY_EDU_2024 = [
  { level: 'Never attended / primary, incomplete', rate: 3.28 },
  { level: 'Primary school', rate: 3.34 },
  { level: 'Junior high school', rate: 5.06 },
  { level: 'Senior high school', rate: 6.86 },
  { level: 'Vocational high school', rate: 8.26 },
  { level: 'Diploma I–III', rate: 4.92 },
  { level: 'University', rate: 4.72 },
];

// Ten most populous provinces, 2024. Source: BPS population projection.
export const PROVINCES = [
  { name: 'West Java', pop: 49.94, density: 1416, hdi: 74.92, poverty: 7.46 },
  { name: 'East Java', pop: 41.81, density: 873, hdi: 75.35, poverty: 10.35 },
  { name: 'Central Java', pop: 37.89, density: 1162, hdi: 73.99, poverty: 10.47 },
  { name: 'North Sumatra', pop: 15.59, density: 214, hdi: 75.33, poverty: 8.08 },
  { name: 'Banten', pop: 12.43, density: 1288, hdi: 75.27, poverty: 5.66 },
  { name: 'Jakarta', pop: 10.68, density: 16125, hdi: 82.36, poverty: 4.14 },
  { name: 'South Sulawesi', pop: 9.42, density: 202, hdi: 73.90, poverty: 8.30 },
  { name: 'Lampung', pop: 9.26, density: 268, hdi: 71.82, poverty: 10.69 },
  { name: 'South Sumatra', pop: 8.84, density: 96, hdi: 72.47, poverty: 11.26 },
  { name: 'Riau', pop: 6.78, density: 78, hdi: 75.51, poverty: 6.67 },
  { name: 'West Sumatra', pop: 5.90, density: 140, hdi: 75.08, poverty: 5.42 },
  { name: 'East Kalimantan', pop: 4.01, density: 31, hdi: 78.20, poverty: 5.78 },
];

export const RELEASES = [
  { date: 'Nov 2026', title: 'Consumer Price Index, October 2026: inflation 0.11% month-to-month', tag: 'Prices' },
  { date: 'Nov 2026', title: 'Labour Force Survey, August 2026: open unemployment 4.78%', tag: 'Employment' },
  { date: 'Oct 2026', title: 'Economic Growth, Q3 2026: GDP up 5.12% year-on-year', tag: 'Economy' },
  { date: 'Sep 2026', title: 'Poverty Profile, March 2026: poverty rate 8.24%', tag: 'People' },
  { date: 'Aug 2026', title: 'Foreign Trade, July 2026: exports US$ 23.4 billion', tag: 'Economy' },
  { date: 'Jul 2026', title: 'Human Development Index 2025: 75.48, up 0.46 points', tag: 'People' },
];
