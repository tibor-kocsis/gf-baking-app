import { parseCount, scaleAmounts, roundWhole, roundTenth } from './scaling';

// American pancakes calculation logic
// Base recipe (1x): 250g rice flour, 3g baking powder, 1g salt, 50g sugar,
// 3 eggs (~50g each), 80g butter, 100g milk = 634g total batter
// One 6cm-diameter pancake ≈ 28g (volume of a 3cm-radius, ~1cm-thick portion
// of batter at ~1g/cm³) so the base recipe yields ~634/28 ≈ 22 pancakes.
// The stepper scales the whole recipe against that base yield.
const PANCAKE_WEIGHT_G = 28;
const PANCAKE_BASE_COUNT = 22;
const PANCAKE_BASE = {
  riceFlour: 250,
  bakingPowder: 3,
  salt: 1,
  sugar: 50,
  egg: 3, // eggs, to a tenth
  butter: 80,
  milk: 100, // ml
};
const ROUNDING = {
  riceFlour: roundWhole,
  bakingPowder: roundTenth,
  salt: roundTenth,
  sugar: roundWhole,
  egg: roundTenth,
  butter: roundWhole,
  milk: roundWhole,
};

export function calculatePancakeIngredients(pancakeCount) {
  const count = parseCount(pancakeCount);
  if (!count) return null;
  return {
    ...scaleAmounts(PANCAKE_BASE, count / PANCAKE_BASE_COUNT, ROUNDING),
    pancakeCount: count,
    pancakeWeight: PANCAKE_WEIGHT_G,
  };
}
