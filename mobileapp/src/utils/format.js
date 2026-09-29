// Text helpers shared by every screen. Pure: translations come in as `t`.

// Replaces {name} placeholders with params[name]; unknown placeholders stay as
// written so a missing value shows up rather than vanishing. Recipe steps use
// this to quote a scaled amount, e.g. "{psylliumHusk} g of psyllium husk".
export function interpolate(text, params) {
  if (!params || typeof text !== 'string') return text;
  return text.replace(/\{(\w+)\}/g, (match, key) =>
    params[key] !== undefined && params[key] !== null ? String(params[key]) : match
  );
}

// Whole minutes, which is how every recipe states its times.
export function formatDuration(seconds, t) {
  return t('common.durationMinutes', { minutes: Math.round(seconds / 60) });
}

// Unit tokens used by the catalog and the cooking plans. Grams and millilitres
// print as symbols right after the number; spoons and pieces are words.
const WORD_UNITS = { tsp: 'common.unitTsp', tbsp: 'common.unitTbsp', pcs: 'common.unitPcs' };

export function formatUnit(unit, t) {
  if (unit === 'count') return '';
  if (WORD_UNITS[unit]) return ` ${t(WORD_UNITS[unit])}`;
  return unit || 'g';
}
