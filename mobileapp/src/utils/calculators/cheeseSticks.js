import { parseCount, scaleAmounts, roundingTable, roundSpoons } from './scaling';

// Cheese sticks calculation logic
// Recipe version 2.1 (2026-09-27), see recipes/sajtos-rud.md for the changelog.
// The base recipe (250 g cottage cheese) fills 2 trays; the stepper counts trays
// and scales everything against that. Spoon measures stay spoons and round to
// the nearest quarter spoon; everything else is weighed.
const CHEESE_STICK_BASE_TRAYS = 2;
const CHEESE_STICK_BASE = {
  brownRiceFlourFine: 100,
  sorghumFlour: 80,
  tapiocaStarch: 50,
  potatoStarch: 50,
  psylliumHuskGround: 6,
  bakingPowder: 4, // 1 tsp
  salt: 3, // 0.5 tsp
  margarine: 150,
  cottageCheese: 250,
  sourCream: 60, // 3 tbsp
  gratedCheese: 100,
  meltedMargarine: 1, // tbsp
  toppingCheese: 50,
};
export const CHEESE_STICK_SPOON_UNITS = {
  meltedMargarine: 'tbsp',
};
const ROUNDING = roundingTable(Object.keys(CHEESE_STICK_SPOON_UNITS), roundSpoons);

export function calculateCheeseStickIngredients(trays) {
  const trayCount = parseCount(trays);
  if (!trayCount) return null;
  return {
    trayCount,
    ...scaleAmounts(CHEESE_STICK_BASE, trayCount / CHEESE_STICK_BASE_TRAYS, ROUNDING),
  };
}
