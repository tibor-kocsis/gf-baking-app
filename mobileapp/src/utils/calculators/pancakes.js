import { parseCount, scaleAmounts, roundingTable, roundWhole, roundTenth } from './scaling';

// American pancakes calculation logic
// Base recipe (1x): 250g flour + starch, 70% rice flour and 30% starch (the
// starch 2:1 potato to tapioca) for a lighter, less gritty crumb than rice flour
// alone; 6g baking powder, 1g salt, 50g sugar, 3 eggs (~50g each), 80g butter,
// 100g milk = 637g total batter
// One 6cm-diameter pancake ≈ 28g (volume of a 3cm-radius, ~1cm-thick portion
// of batter at ~1g/cm³) so the base recipe yields ~637/28 ≈ 22 pancakes.
// The stepper scales the whole recipe against that base yield.
const PANCAKE_WEIGHT_G = 28;
const PANCAKE_BASE_COUNT = 22;
const PANCAKE_BASE = {
  riceFlour: 175, // 70%
  potatoStarch: 50, // 30% starch, 2:1 potato to tapioca
  tapiocaStarch: 25,
  bakingPowder: 6,
  salt: 1,
  sugar: 50,
  egg: 3, // eggs, to a tenth
  butter: 80,
  milk: 100, // ml
};
const ROUNDING = roundingTable(Object.keys(PANCAKE_BASE), roundWhole, {
  bakingPowder: roundTenth,
  salt: roundTenth,
  egg: roundTenth,
});

export function calculatePancakeIngredients(pancakeCount) {
  const count = parseCount(pancakeCount);
  if (!count) return null;
  return {
    ...scaleAmounts(PANCAKE_BASE, count / PANCAKE_BASE_COUNT, ROUNDING),
    pancakeCount: count,
    pancakeWeight: PANCAKE_WEIGHT_G,
  };
}
