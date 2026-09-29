import { parseCount, roundGrams, sumOf, doughTotals } from './scaling';
import { SORGHUM_UNIMIX, TANGZHONG_WATER_RATIO, MIN_FREE_WATER_SHARE, psylliumGelWater } from './dough';

// Pizza dough 2 calculation logic
// The first pizza without the Miklos universal mix. That mix is ~80% starch plus
// guar, xanthan, HPMC and potato flakes (0.99 g protein per 100 g), so taking it
// out takes the binder out too: psyllium husk replaces the gums and a brown rice
// tangzhong replaces the pre-cooked potato flakes. The flour:starch split stays
// near the original's ~36:64 at 40:60, since that dough is known to work.
//
// Baker's percentages of the flour + starch base. The unimix is decomposed as in
// the flour mix calculator (48% sorghum, 47% tapioca, 5% psyllium), so 68.75% of
// it gives 33% sorghum flour; 7% brown rice brings the flour to 40%, and potato
// (27.7%) sits at the 45% potato cap of the starch fraction.
const PIZZA2 = {
  unimix: 0.6875,
  brownRiceFlour: 0.07, // all of it goes into the tangzhong, or raw into the dough without one
  potatoStarch: 0.277,
  psylliumTotal: 0.045,
  hydration: 0.9, // a starting point: 85% if unmanageable, 95% if the rim stays tight
  hydrationNoTangzhong: 0.87, // the flour mix rule: a tangzhong adds 3 points
  honey: 0.03,
  oil: 0.06,
  salt: 0.022,
  yeast: 0.015,
};
const DOUGH_PER_PIZZA_G = 290; // the baker's 280-300 g ball

// Without the unimix its parts are weighed out one by one: its sorghum share
// (33%) becomes the chosen flour, its tapioca share (32.3%) the chosen starch and
// its psyllium goes into the gel. The 90% water was set on the unimix blend, so
// the flour mix's water rules apply only as the difference from it: brown rice
// over 40% of the flour +3, millet over 25% -2, and the potato-over-40% -3 is
// already in the 90%, so all potato changes nothing and all tapioca gives it back.
const MAIN_FLOUR = PIZZA2.unimix * SORGHUM_UNIMIX.sorghum;
const UNIMIX_STARCH = PIZZA2.unimix * SORGHUM_UNIMIX.tapioca;
const FLOUR_KEYS = { sorghum: 'sorghumFlour', brownRice: 'brownRiceFlourDough', millet: 'milletFlour' };
const FLOUR_WATER = { sorghum: 0, brownRice: 0.03, millet: -0.02 };
const STARCH_WATER = { both: 0, potato: 0, tapioca: 0.03 };

function blendFor(unimix, flour, starch) {
  if (unimix) {
    return { sorghumUnimix: PIZZA2.unimix, potatoStarch: PIZZA2.potatoStarch, psylliumInBlend: PIZZA2.unimix * SORGHUM_UNIMIX.psyllium };
  }
  const starchTotal = UNIMIX_STARCH + PIZZA2.potatoStarch;
  const starches = {
    both: { tapiocaStarch: UNIMIX_STARCH, potatoStarch: PIZZA2.potatoStarch },
    potato: { potatoStarch: starchTotal },
    tapioca: { tapiocaStarch: starchTotal },
  }[starch];
  return { [FLOUR_KEYS[flour]]: MAIN_FLOUR, ...starches, psylliumInBlend: 0 };
}

// The tangzhong can be switched off to bake the same blend without it: the brown
// rice then goes into the dough raw, and the water drops by the 3 points the
// cooked paste would have held.
export function calculatePizza2Ingredients(
  count,
  { tangzhong = true, unimix = true, flour = 'sorghum', starch = 'both' } = {}
) {
  const numPizzas = parseCount(count);
  if (!numPizzas) return null;
  const { psylliumInBlend, ...blend } = blendFor(unimix, flour, starch);
  const hydration =
    (tangzhong ? PIZZA2.hydration : PIZZA2.hydrationNoTangzhong) +
    (unimix ? 0 : FLOUR_WATER[flour] + STARCH_WATER[starch]);

  const psylliumAdded = PIZZA2.psylliumTotal - psylliumInBlend;
  const doughPerBase = sumOf({
    ...blend,
    brownRiceFlour: PIZZA2.brownRiceFlour,
    psylliumHusk: psylliumAdded,
    water: hydration,
    honey: PIZZA2.honey,
    oil: PIZZA2.oil,
    salt: PIZZA2.salt,
    yeast: PIZZA2.yeast,
  });
  const base = (DOUGH_PER_PIZZA_G / doughPerBase) * numPizzas;
  const grams = (share) => roundGrams(share * base);

  const water = Math.round(hydration * base);
  const waterTangzhong = tangzhong
    ? Math.round(PIZZA2.brownRiceFlour * TANGZHONG_WATER_RATIO * base)
    : 0;
  // The flour mix rule: below 10% of the base left for the yeast water, the gel
  // drops to 1:8 so there is enough free water to slurry the yeast.
  const { gel: waterGel, remainder: waterYeast } = psylliumGelWater(
    psylliumAdded * base,
    water,
    waterTangzhong,
    MIN_FREE_WATER_SHARE * base
  );

  // Raw brown rice as the chosen flour takes in the tangzhong's share too.
  const rawBrownRice = !tangzhong && blend.brownRiceFlourDough;
  const weighed = {
    sorghumUnimix: 0,
    sorghumFlour: 0,
    brownRiceFlourDough: 0,
    milletFlour: 0,
    tapiocaStarch: 0,
    potatoStarch: 0,
    ...Object.fromEntries(Object.keys(blend).map((key) => [key, grams(blend[key])])),
    brownRiceFlour: rawBrownRice ? 0 : grams(PIZZA2.brownRiceFlour),
    psylliumHusk: grams(psylliumAdded),
    waterTangzhong,
    waterGel,
    waterYeast,
    oil: grams(PIZZA2.oil),
    honey: grams(PIZZA2.honey),
    salt: grams(PIZZA2.salt),
    yeast: grams(PIZZA2.yeast),
  };
  if (rawBrownRice) {
    weighed.brownRiceFlourDough = grams(blend.brownRiceFlourDough + PIZZA2.brownRiceFlour);
  }
  return { ...weighed, tangzhong, ...doughTotals(weighed, numPizzas) };
}
