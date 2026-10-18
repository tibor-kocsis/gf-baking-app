import { parseCount, roundGrams, sumOf, doughTotals } from './scaling';
import { SORGHUM_UNIMIX, BAMBOO_FIBER_WATER_RATIO, MIN_FREE_WATER_SHARE, psylliumGelWater } from './dough';
import { fillStarch } from '../flourMixCalculator';

// Pizza dough 2 calculation logic
// The first pizza without the Miklos universal mix. That mix is ~80% starch plus
// guar, xanthan, HPMC and potato flakes (0.99 g protein per 100 g), so taking it
// out takes the binder out too: psyllium husk replaces the gums. The flour:starch
// split stays near the original's ~36:64 at 40:60, since that dough is known to work.
//
// No tangzhong: no gluten-free pizza trial measures one, and the only gluten-free
// bread trial found 1% of the flour best and 3% or more worse (dough.js). The
// brown rice it was cooked from goes into the dough raw, so the blend and the
// 40:60 stay as they were; the water loses the 3 points the paste held.
//
// Baker's percentages of the flour + starch base. The unimix is decomposed as in
// the flour mix calculator (48% sorghum, 47% tapioca, 5% psyllium), so 70.83% of
// it gives 34% sorghum flour; 6% brown rice brings the flour to 40%, and potato
// (26.7%) takes the rest of the 60% starch, 44.5% of it, under the 45% potato cap.
const PIZZA2 = {
  unimix: 0.7083,
  brownRiceFlour: 0.06,
  potatoStarch: 0.267,
  psylliumTotal: 0.045,
  bambooFiber: 0.015, // the baker's option, weighed dry with the flours (dough.js)
  hydration: 0.87, // a starting point: 85% if unmanageable, 95% if the rim stays tight
  honey: 0.03,
  oil: 0.06,
  salt: 0.022,
  freshYeast: 0.015,
};
const DOUGH_PER_PIZZA_G = 290; // the baker's 280-300 g ball

// Without the unimix its parts are weighed out one by one: its sorghum share
// (34%) becomes the chosen flour(s), its tapioca share (33.3%) goes to the chosen
// starches and its psyllium goes into the gel. The 87% water was set on the
// unimix blend, so the flour mix's water rules apply only as the difference from
// it: brown rice over 40% of the flour +3, millet over 25% -2.
const MAIN_FLOUR = PIZZA2.unimix * SORGHUM_UNIMIX.sorghum;
const STARCH_TOTAL = PIZZA2.unimix * SORGHUM_UNIMIX.tapioca + PIZZA2.potatoStarch;
const FLOUR_KEYS = {
  unimix: 'sorghumUnimix',
  sorghum: 'sorghumFlour',
  brownRice: 'brownRiceFlour',
  millet: 'milletFlour',
};
const STARCH_KEYS = { tapioca: 'tapiocaStarch', potato: 'potatoStarch', corn: 'cornStarch' };
const FLOUR_WATER = { unimix: 0, sorghum: 0, brownRice: 0.03, millet: -0.02 };

// The flour mix's potato rule: potato over 40% of the starch takes 3 points off.
// The 87% was set with potato at 44.5%, so it already holds them, and a blend
// with less potato (tapioca, corn, or potato beside both) gets them back.
const POTATO_WATER_SHARE = 0.4;
const POTATO_WATER = 0.03;

// The unimix is one of the flours: it takes an equal share of the main flour's
// slot, and brings its own tapioca and psyllium along. That tapioca counts toward
// the starch, so the chosen starches fill only the rest of it, split by the flour
// mix's caps and weights: tapioca + potato 55:45 (the unimix blend's own split),
// corn + potato 55:45, tapioca + corn 50:50, all three corn 50, tapioca 33, potato 17.
function blendFor(flours, starches) {
  const share = 1 / flours.length;
  const unimixShare = flours.includes('unimix') ? PIZZA2.unimix * share : 0;
  const plainStarch = fillStarch(STARCH_TOTAL, starches, unimixShare * SORGHUM_UNIMIX.tapioca);
  const blend = {};
  starches.forEach((starch) => {
    blend[STARCH_KEYS[starch]] = plainStarch[starch];
  });
  flours.forEach((flour) => {
    if (flour !== 'unimix') blend[FLOUR_KEYS[flour]] = MAIN_FLOUR * share;
  });
  if (unimixShare) blend.sorghumUnimix = unimixShare;
  // The 6% brown rice is weighed with the rice chosen as a main flour.
  blend.brownRiceFlour = (blend.brownRiceFlour || 0) + PIZZA2.brownRiceFlour;
  Object.keys(blend).forEach((key) => blend[key] > 0 || delete blend[key]);
  return {
    blend,
    psylliumInBlend: unimixShare * SORGHUM_UNIMIX.psyllium,
    potatoShare: (plainStarch.potato || 0) / STARCH_TOTAL,
  };
}

// The bamboo fibre brings five times its weight in water on top of the dough's
// own; that water goes in with the yeast water, so the gel stays as it is.
export function calculatePizza2Ingredients(
  count,
  { flour = ['unimix'], starch = ['tapioca', 'potato'], bamboo = false } = {}
) {
  const numPizzas = parseCount(count);
  if (!numPizzas) return null;
  const flours = [].concat(flour);
  const { blend, psylliumInBlend, potatoShare } = blendFor(flours, [].concat(starch));
  const bambooFiber = bamboo ? PIZZA2.bambooFiber : 0;
  // Each flour's water adjustment counts in proportion to its share of the main flour.
  const flourWater = flours.reduce((sum, item) => sum + FLOUR_WATER[item], 0) / flours.length;
  const starchWater = potatoShare > POTATO_WATER_SHARE ? 0 : POTATO_WATER;
  const hydration =
    PIZZA2.hydration + flourWater + starchWater + bambooFiber * BAMBOO_FIBER_WATER_RATIO;

  const psylliumAdded = PIZZA2.psylliumTotal - psylliumInBlend;
  const doughPerBase = sumOf({
    ...blend,
    psylliumHusk: psylliumAdded,
    bambooFiber,
    water: hydration,
    honey: PIZZA2.honey,
    oil: PIZZA2.oil,
    salt: PIZZA2.salt,
    freshYeast: PIZZA2.freshYeast,
  });
  const base = (DOUGH_PER_PIZZA_G / doughPerBase) * numPizzas;
  const grams = (share) => roundGrams(share * base);

  const water = Math.round(hydration * base);
  // The flour mix rule: below 10% of the base left for the yeast water, the gel
  // drops to 1:8 so there is enough free water to slurry the yeast.
  const { gel: waterGel, remainder: waterYeast } = psylliumGelWater(
    psylliumAdded * base,
    water,
    0,
    MIN_FREE_WATER_SHARE * base
  );

  const weighed = {
    sorghumUnimix: 0,
    sorghumFlour: 0,
    brownRiceFlour: 0,
    milletFlour: 0,
    tapiocaStarch: 0,
    potatoStarch: 0,
    cornStarch: 0,
    ...Object.fromEntries(Object.keys(blend).map((key) => [key, grams(blend[key])])),
    psylliumHusk: grams(psylliumAdded),
    bambooFiber: grams(bambooFiber),
    waterGel,
    waterYeast,
    oil: grams(PIZZA2.oil),
    honey: grams(PIZZA2.honey),
    salt: grams(PIZZA2.salt),
    freshYeast: grams(PIZZA2.freshYeast),
  };
  return { ...weighed, hydrationPercent: Math.round(hydration * 100), ...doughTotals(weighed, numPizzas) };
}
