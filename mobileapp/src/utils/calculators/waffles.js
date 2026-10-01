import { parseCount, scaleAmounts, roundingTable, roundWhole, roundTenth } from './scaling';

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

// Optional starch for a single-grain flour, which has none of its own: it
// lightens the batter and crisps the crust. It replaces 20% of the flour (the
// batch stays 100 g of flour + starch) and, from the baker's experience, the
// batter then needs 80 ml of milk instead of 100.
const STARCH_SHARE = 0.2;
const MILK_WITH_STARCH = 80; // ml
const STARCHES = {
  tapioca: { tapiocaStarch: 1 },
  potato: { potatoStarch: 1 },
  both: { tapiocaStarch: 0.5, potatoStarch: 0.5 },
};
const ROUNDING = roundingTable(
  [...Object.keys(WAFFLE_BATCH), 'tapiocaStarch', 'potatoStarch'],
  roundWhole,
  { bakingPowder: roundTenth }
);

export function calculateWaffleIngredients(multiplier, { starch = false, starchType = 'both' } = {}) {
  const batches = parseCount(multiplier);
  if (!batches) return null;
  if (!starch) return { ...scaleAmounts(WAFFLE_BATCH, batches, ROUNDING), multiplier: batches };

  const { flour, milk, ...rest } = WAFFLE_BATCH;
  const starches = {};
  Object.entries(STARCHES[starchType]).forEach(([key, part]) => {
    starches[key] = flour * STARCH_SHARE * part;
  });
  // Key order is the card order: flour, then the starches, then the rest.
  const base = { flour: flour * (1 - STARCH_SHARE), ...starches, milk: MILK_WITH_STARCH, ...rest };
  return { ...scaleAmounts(base, batches, ROUNDING), multiplier: batches };
}
