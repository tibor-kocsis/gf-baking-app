import { parseCount, scaleAmounts, roundSpoons } from './scaling';

// Cheese sticks calculation logic
// Recipe version 2.1 (2026-09-27), see recipes/sajtos-rud.md for the changelog.
// The base recipe yields 30 sticks; the stepper scales everything against that.
// Spoon measures stay spoons and round to the nearest quarter spoon.
const CHEESE_STICK_BASE_COUNT = 30;
const CHEESE_STICK_BASE = {
  brownRiceFlourFine: 100,
  sorghumFlour: 80,
  tapiocaStarch: 50,
  potatoStarch: 50,
  psylliumHuskGround: 6,
  bakingPowder: 1, // tsp
  salt: 0.5, // tsp
  margarine: 150,
  cottageCheese: 250,
  sourCream: 3, // tbsp
  gratedCheese: 100,
  meltedMargarine: 1, // tbsp
  toppingCheese: 50,
};
export const CHEESE_STICK_SPOON_UNITS = {
  bakingPowder: 'tsp',
  salt: 'tsp',
  sourCream: 'tbsp',
  meltedMargarine: 'tbsp',
};
const ROUNDING = {};
Object.keys(CHEESE_STICK_SPOON_UNITS).forEach((key) => {
  ROUNDING[key] = roundSpoons;
});

export function calculateCheeseStickIngredients(stickCount) {
  const count = parseCount(stickCount);
  if (!count) return null;
  return {
    stickCount: count,
    ...scaleAmounts(CHEESE_STICK_BASE, count / CHEESE_STICK_BASE_COUNT, ROUNDING),
  };
}
