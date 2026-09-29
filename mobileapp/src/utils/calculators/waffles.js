import { parseCount, scaleAmounts, roundWhole, roundTenth } from './scaling';

// One batch; the stepper multiplies it.
const WAFFLE_BATCH = {
  egg: 1,
  milk: 100, // ml
  flour: 100,
  butter: 25,
  vanilla: 1, // tsp
  sugar: 15,
  bakingPowder: 2.5,
};
const ROUNDING = {
  egg: roundWhole,
  milk: roundWhole,
  flour: roundWhole,
  butter: roundWhole,
  vanilla: roundWhole,
  sugar: roundWhole,
  bakingPowder: roundTenth,
};

export function calculateWaffleIngredients(multiplier) {
  const batches = parseCount(multiplier);
  if (!batches) return null;
  return { ...scaleAmounts(WAFFLE_BATCH, batches, ROUNDING), multiplier: batches };
}
