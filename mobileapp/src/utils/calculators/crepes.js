import { parseCount, roundGrams, roundTenth, roundWhole } from './scaling';

// Crêpes (Hungarian palacsinta) calculation logic
// The stepper is the flour + starch weight, and everything else is a share of
// it. The numbers are a tested gluten-free crêpe recipe (The Daring Gourmet:
// brown and white rice flour, potato and tapioca starch), converted from cups,
// so they are approximate: per 100 g of flour + starch about 1 egg - the
// Hungarian "one egg per 100 g of flour" rule too - 125 ml milk, 14 g melted
// butter or oil, 6 g sugar and a pinch of salt.
//
// About 18% of the base is starch, half tapioca and half potato. Tapioca keeps
// the thin sheet flexible and slow to stiffen once rolled and cold; potato makes
// it tender. Corn starch is left out: it carries a cereal off-note and its paste
// firms the fastest, which a rolled, filled crêpe would show first.
//
// No soda water: in a side-by-side test it made no difference to texture or
// thickness, since the gas escapes in the pan.
const CREPES = {
  flour: 0.82,
  tapiocaStarch: 0.09,
  potatoStarch: 0.09,
  egg: 0.01, // eggs per gram of base: one per 100 g
  milk: 1.25, // ml per gram of base
  fat: 0.14,
  sugar: 0.06,
  salt: 0.008,
};
const EGG_GRAMS = 50;
// The yield is counted in millilitres, since a crêpe is a ladle of batter. A
// 24 cm pan takes about 60 ml for a thin crêpe (Krampouz, a crêpe-maker maker;
// 100 ml at 28 cm), so a small ladle is about one crêpe.
const BATTER_PER_CREPE_ML = 60;
// The batter's volume from each ingredient's density, since the solids make it
// heavier than water (~1.15 g/ml): flour and starch ~1.5 g/ml, egg and milk ~1.03,
// butter 0.91, sugar 1.59. The salt is too little to count.
const DENSITY = { flourAndStarch: 1.5, egg: 1.03, fat: 0.91, sugar: 1.59 };

// The chosen flours share the flour part equally; "rice" is half white, half
// brown rice flour, as in the source recipe.
const FLOUR_LINES = {
  rice: ['riceFlour', 'brownRiceFlour'],
  sorghum: ['sorghumFlour'],
  millet: ['milletFlour'],
  buckwheat: ['buckwheatFlour'],
};

export function calculateCrepeIngredients(grams, { flour = ['rice'] } = {}) {
  const base = parseCount(grams);
  if (!base) return null;
  const flours = [].concat(flour).filter((key) => FLOUR_LINES[key]);
  if (flours.length === 0) return null;

  const flourShares = { riceFlour: 0, brownRiceFlour: 0, sorghumFlour: 0, milletFlour: 0, buckwheatFlour: 0 };
  flours.forEach((key) => {
    const lines = FLOUR_LINES[key];
    lines.forEach((line) => {
      flourShares[line] += CREPES.flour / flours.length / lines.length;
    });
  });

  const lines = {
    ...Object.fromEntries(Object.keys(flourShares).map((key) => [key, roundGrams(flourShares[key] * base)])),
    tapiocaStarch: roundGrams(CREPES.tapiocaStarch * base),
    potatoStarch: roundGrams(CREPES.potatoStarch * base),
  };
  // The largest flour line takes up the rounding, so the lines add up to the
  // grams on the stepper; a gram there matters least.
  const drift = base - Object.values(lines).reduce((sum, amount) => sum + amount, 0);
  const largest = Object.keys(flourShares).reduce((best, key) => (lines[key] > lines[best] ? key : best));
  lines[largest] = roundTenth(lines[largest] + drift);

  const weighed = {
    ...lines,
    sugar: roundGrams(CREPES.sugar * base),
    salt: roundTenth(CREPES.salt * base),
    egg: roundTenth(CREPES.egg * base),
    milk: roundWhole(CREPES.milk * base),
    fat: roundGrams(CREPES.fat * base),
  };

  const batterMl =
    base / DENSITY.flourAndStarch +
    CREPES.milk * base +
    (weighed.egg * EGG_GRAMS) / DENSITY.egg +
    (CREPES.fat * base) / DENSITY.fat +
    (CREPES.sugar * base) / DENSITY.sugar;
  return {
    ...weighed,
    // An estimate, so it is shown to the nearest 10 ml.
    totalBatter: Math.round(batterMl / 10) * 10,
    crepeCount: Math.max(1, Math.round(batterMl / BATTER_PER_CREPE_ML)),
  };
}
