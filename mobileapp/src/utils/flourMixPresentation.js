// Turns a solved flour mix formula into the texts its screen shows. Pure:
// translations come in as `t`.
import { FLOUR_CAPS, STARCH_CAPS, FLOUR_MIX_INGREDIENT_KEYS } from './flourMixCalculator';

// Order of the ingredient cards in the percentage table.
export const FORMULA_GROUP_ORDER = ['flour', 'starch', 'psyllium', 'liquid', 'addition'];

export function formulaGroups(formula) {
  return FORMULA_GROUP_ORDER.map((group) => ({
    key: group,
    rows: formula.weighed.filter((row) => row.group === group),
  })).filter((group) => group.rows.length > 0);
}

export function ingredientName(key, t) {
  return t(FLOUR_MIX_INGREDIENT_KEYS[key] || key);
}

// The solver returns notes as keys plus params so they stay translatable.
export function noteText(note, t) {
  const params = { ...note.params };
  if (note.ingredientKey) params.ingredient = t(note.ingredientKey);
  return t(`flourMix.notes.${note.key}`, params);
}

export function bandText(formula, t) {
  if (!formula.inBand) return t('flourMix.bandOutside');
  const style = t(`flourMix.styles.${formula.style}`);
  return t(formula.onStyleTarget ? 'flourMix.bandOnTarget' : 'flourMix.bandInside', { style });
}

const percentOf = (share) => Math.round(share * 100);

// Short annotations under the breakdown bars, keyed by ingredient: { over, hint }.
// The reasoning lives in the notes at the bottom, so these stay terse and never
// repeat that text.
export function capHintsFor(formula, t) {
  const info = {};
  const hint = (key, params) => t(`flourMix.capHints.${key}`, params);
  formula.relaxedCaps.forEach((entry) => {
    info[entry.key] = { over: true, hint: hint('overCap', { excess: entry.excess, cap: entry.cap }) };
  });
  if (formula.flags.potatoAtCap && !info.potato) {
    info.potato = { over: false, hint: hint('potatoHeld', { cap: percentOf(STARCH_CAPS.potato) }) };
  }
  if (formula.flags.milletCapped && !info.millet) {
    info.millet = { over: false, hint: hint('milletHeld', { cap: percentOf(FLOUR_CAPS.millet) }) };
  }
  if (formula.flags.brownRiceRest && !info.brownRice) {
    info.brownRice = { over: false, hint: hint('brownRiceRest') };
  }
  return info;
}
