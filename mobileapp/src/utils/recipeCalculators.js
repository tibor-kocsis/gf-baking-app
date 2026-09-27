// Pizza calculation logic
export function calculatePizzaIngredients(count) {
  const numPizzas = parseInt(count) || 0;
  if (numPizzas <= 0) return null;

  const flourPerPizza = 300 / 1.945;
  const flourRounded = Math.round(flourPerPizza / 25) * 25;
  const totalFlour = flourRounded * numPizzas;

  const sorghumFlour = Math.round(totalFlour * 0.6);
  const glutenFreeFlour = Math.round(totalFlour * 0.4);
  const water = Math.round(flourRounded * 0.8 * numPizzas);
  const salt = Math.round(flourRounded * 0.03 * numPizzas);
  const yeast = Math.round(flourRounded * 0.015 * numPizzas);
  const oil = Math.round(flourRounded * 0.05 * numPizzas);
  const honey = Math.round(flourRounded * 0.05 * numPizzas);

  const totalWeight = sorghumFlour + glutenFreeFlour + water + salt + yeast + oil + honey;
  const weightPerPizza = Math.round(totalWeight / numPizzas);

  return {
    sorghumFlour,
    glutenFreeFlour,
    water,
    salt,
    yeast,
    oil,
    honey,
    totalWeight,
    weightPerPizza,
    numPizzas,
  };
}

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
const PIZZA2_UNIMIX_PSYLLIUM = 0.05;
const PIZZA2_TANGZHONG_RATIO = 5;
const PIZZA2_GEL_RATIO = 10;
const PIZZA2_DOUGH_PER_PIZZA_G = 290; // the baker's 280-300 g ball

// The tangzhong can be switched off to bake the same blend without it: the brown
// rice then goes into the dough raw, and the water drops by the 3 points the
// cooked paste would have held.
export function calculatePizza2Ingredients(count, tangzhong = true) {
  const numPizzas = parseInt(count) || 0;
  if (numPizzas <= 0) return null;
  const hydration = tangzhong ? PIZZA2.hydration : PIZZA2.hydrationNoTangzhong;

  const psylliumAdded = PIZZA2.psylliumTotal - PIZZA2.unimix * PIZZA2_UNIMIX_PSYLLIUM;
  const doughPerBase =
    PIZZA2.unimix +
    PIZZA2.brownRiceFlour +
    PIZZA2.potatoStarch +
    psylliumAdded +
    hydration +
    PIZZA2.honey +
    PIZZA2.oil +
    PIZZA2.salt +
    PIZZA2.yeast;
  const base = (PIZZA2_DOUGH_PER_PIZZA_G / doughPerBase) * numPizzas;

  const grams = (share) => {
    const raw = share * base;
    return raw < 20 ? Math.round(raw * 10) / 10 : Math.round(raw);
  };

  const water = Math.round(hydration * base);
  const waterTangzhong = tangzhong
    ? Math.round(PIZZA2.brownRiceFlour * PIZZA2_TANGZHONG_RATIO * base)
    : 0;
  const waterGel = Math.round(psylliumAdded * PIZZA2_GEL_RATIO * base);
  const waterYeast = water - waterTangzhong - waterGel;

  const result = {
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
    numPizzas,
  };
  const counted = { ...result };
  delete counted.numPizzas;
  result.tangzhong = tangzhong;
  result.totalWeight = Math.round(
    Object.keys(counted).reduce((sum, key) => sum + counted[key], 0)
  );
  result.weightPerPizza = Math.round(result.totalWeight / numPizzas);
  return result;
}

// Pizza dough 3 calculation logic
// Built on the principle of Caputo Fioreglut rather than a copy of it. Fioreglut
// is ~85% starch (gluten-free wheat, corn and rice starch), ~4% buckwheat, ~3.5%
// dextrose and ~6-7% psyllium and guar, going by its label's 0.6 g protein and
// 6.2 g fibre per 100 g. So: a starch-led blend with a heavy binder, 80% water,
// no tangzhong, stretched rather than pressed and baked in one go.
//
// It departs from Fioreglut in two places. The flour is 20% rather than ~5%,
// buckwheat and sorghum, for more flavour. And corn stands in for the wheat
// starch as the largest starch, since both are cereal starches of ~25% amylose;
// no trial compares them directly. The starch split keeps to the flour mix
// calculator's caps (corn 50%, potato 25% against its 45% cap, tapioca 25%).
//
// Baker's percentages of the flour + starch base, plain flours only, no mixes.
const PIZZA3 = {
  buckwheatFlour: 0.1,
  sorghumFlour: 0.1,
  cornStarch: 0.4,
  potatoStarch: 0.2,
  tapiocaStarch: 0.2,
  psylliumHusk: 0.06, // the least certain figure: 5.5% if gummy, 6.5% if it tears
  hydration: 0.8,
  honey: 0.05, // stands in for Fioreglut's dextrose plus Caputo's own 2% honey
  oil: 0.035,
  salt: 0.025,
  freshYeast: 0.015,
};
const PIZZA3_GEL_RATIO = 10;
const PIZZA3_BALL_G = 280;

export function calculatePizza3Ingredients(count) {
  const numPizzas = parseInt(count) || 0;
  if (numPizzas <= 0) return null;

  const { hydration, ...weighed } = PIZZA3;
  const doughPerBase =
    hydration + Object.keys(weighed).reduce((sum, key) => sum + weighed[key], 0);
  const base = (PIZZA3_BALL_G / doughPerBase) * numPizzas;

  const result = {};
  Object.keys(weighed).forEach((key) => {
    const raw = weighed[key] * base;
    result[key] = raw < 20 ? Math.round(raw * 10) / 10 : Math.round(raw);
  });
  const water = Math.round(hydration * base);
  result.waterGel = Math.round(PIZZA3.psylliumHusk * PIZZA3_GEL_RATIO * base);
  result.waterYeast = water - result.waterGel;

  result.totalWeight = Math.round(Object.keys(result).reduce((sum, key) => sum + result[key], 0));
  result.weightPerPizza = Math.round(result.totalWeight / numPizzas);
  result.numPizzas = numPizzas;
  return result;
}

// Waffle calculation logic
export function calculateWaffleIngredients(multiplier) {
  const mult = parseInt(multiplier) || 0;
  if (mult <= 0) return null;

  // Base recipe (1x)
  const egg = mult;
  const milk = 100 * mult;
  const flour = 100 * mult;
  const butter = 25 * mult;
  const vanilla = mult;
  const sugar = 15 * mult;
  const bakingPowder = Math.round(2.5 * mult * 10) / 10;

  return {
    egg,
    milk,
    flour,
    butter,
    vanilla,
    sugar,
    bakingPowder,
    multiplier: mult,
  };
}

// American pancakes calculation logic
// Base recipe (1x): 250g rice flour, 3g baking powder, 1g salt, 50g sugar,
// 3 eggs (~50g each), 80g butter, 100g milk = 634g total batter
// One 6cm-diameter pancake ≈ 28g (volume of a 3cm-radius, ~1cm-thick portion
// of batter at ~1g/cm³) so the base recipe yields ~634/28 ≈ 22 pancakes.
// The stepper scales the whole recipe against that base yield.
const PANCAKE_WEIGHT_G = 28;
const PANCAKE_BASE_COUNT = 22;

export function calculatePancakeIngredients(pancakeCount) {
  const count = parseInt(pancakeCount) || 0;
  if (count <= 0) return null;

  const ratio = count / PANCAKE_BASE_COUNT;

  const riceFlour = Math.round(250 * ratio);
  const bakingPowder = Math.round(3 * ratio * 10) / 10;
  const salt = Math.round(ratio * 10) / 10;
  const sugar = Math.round(50 * ratio);
  const egg = Math.round(3 * ratio * 10) / 10;
  const butter = Math.round(80 * ratio);
  const milk = Math.round(100 * ratio);

  return {
    riceFlour,
    bakingPowder,
    salt,
    sugar,
    egg,
    butter,
    milk,
    pancakeCount: count,
    pancakeWeight: PANCAKE_WEIGHT_G,
  };
}

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

export function calculateCheeseStickIngredients(stickCount) {
  const count = parseInt(stickCount) || 0;
  if (count <= 0) return null;

  const ratio = count / CHEESE_STICK_BASE_COUNT;
  const result = { stickCount: count };
  Object.keys(CHEESE_STICK_BASE).forEach((key) => {
    const raw = CHEESE_STICK_BASE[key] * ratio;
    if (CHEESE_STICK_SPOON_UNITS[key]) {
      result[key] = Math.max(0.25, Math.round(raw * 4) / 4);
    } else {
      result[key] = raw < 20 ? Math.round(raw * 10) / 10 : Math.round(raw);
    }
  });
  return result;
}
