import { parseCount, roundGrams, sumOf } from './scaling';

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
const UNIMIX_PSYLLIUM = 0.05;
const TANGZHONG_RATIO = 5;
const GEL_RATIO = 10;
const DOUGH_PER_PIZZA_G = 290; // the baker's 280-300 g ball

// The tangzhong can be switched off to bake the same blend without it: the brown
// rice then goes into the dough raw, and the water drops by the 3 points the
// cooked paste would have held.
export function calculatePizza2Ingredients(count, tangzhong = true) {
  const numPizzas = parseCount(count);
  if (!numPizzas) return null;
  const hydration = tangzhong ? PIZZA2.hydration : PIZZA2.hydrationNoTangzhong;

  const psylliumAdded = PIZZA2.psylliumTotal - PIZZA2.unimix * UNIMIX_PSYLLIUM;
  const doughPerBase = sumOf({
    unimix: PIZZA2.unimix,
    brownRiceFlour: PIZZA2.brownRiceFlour,
    potatoStarch: PIZZA2.potatoStarch,
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
    ? Math.round(PIZZA2.brownRiceFlour * TANGZHONG_RATIO * base)
    : 0;
  const waterGel = Math.round(psylliumAdded * GEL_RATIO * base);
  const waterYeast = water - waterTangzhong - waterGel;

  const weighed = {
    sorghumUnimix: grams(PIZZA2.unimix),
    potatoStarch: grams(PIZZA2.potatoStarch),
    brownRiceFlour: grams(PIZZA2.brownRiceFlour),
    psylliumHusk: grams(psylliumAdded),
    waterTangzhong,
    waterGel,
    waterYeast,
    oil: grams(PIZZA2.oil),
    honey: grams(PIZZA2.honey),
    salt: grams(PIZZA2.salt),
    yeast: grams(PIZZA2.yeast),
  };
  const totalWeight = Math.round(sumOf(weighed));
  return {
    ...weighed,
    numPizzas,
    tangzhong,
    totalWeight,
    weightPerPizza: Math.round(totalWeight / numPizzas),
  };
}
