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

// Sandwich bread calculation logic
// Base recipe: 300g flour total
// Water = flour (100% hydration) + psyllium × 6 (600% hydration)
export function calculateSandwichBreadIngredients(flourAmount) {
  const totalFlour = parseInt(flourAmount) || 0;
  if (totalFlour <= 0) return null;

  const ratio = totalFlour / 300; // Scale factor based on 300g base

  // Flour split (56.67% sorghum, 43.33% universal GF)
  const sorghumFlour = Math.round(totalFlour * 0.5667);
  const universalGfFlour = totalFlour - sorghumFlour; // Remainder to ensure exact total

  // Other dry ingredients (scaled by ratio)
  const psylliumHusk = Math.round(5 * ratio);
  const activeYeast = Math.round(8 * ratio);
  const salt = Math.round(5 * ratio);

  // Wet ingredients (scaled by ratio)
  const oil = Math.round(20 * ratio);
  const honey = Math.round(20 * ratio);
  const egg = Math.round(ratio); // 1 egg per 300g, rounded
  const lemonJuice = Math.round(ratio); // 1 tbsp per 300g, rounded

  // Water calculation: 100% flour hydration + 600% psyllium hydration
  const water = totalFlour + (psylliumHusk * 6);

  return {
    sorghumFlour,
    universalGfFlour,
    psylliumHusk,
    activeYeast,
    salt,
    oil,
    honey,
    egg,
    lemonJuice,
    water,
    totalFlour,
  };
}

// Rounds a value to the nearest multiple of `step` (e.g. roundTo(174, 5) === 175)
function roundTo(value, step) {
  return Math.round(value / step) * step;
}

// Baguette calculation logic
// Base recipe: 390g flour (170g sorghum flour mix + 170g brown rice flour + 50g
// tapioca starch) + 8g psyllium husk + 12g yeast + 7g salt + 30g honey + 30g oil
// + 300g water = 800g total ready dough weight (rounded to the nearest 50g so
// the selector's steps always land on a clean multiple of 50).
// A portion of the tapioca starch and water is diverted into a tangzhong (cooked paste) step.
// The selector scales the whole recipe by the total dough weight, not just the flour.
// Flour amounts only need 5g accuracy on a kitchen scale; the small-quantity
// ingredients (yeast, salt, psyllium, etc.) keep 1g accuracy since 5g would be
// a large swing relative to their size.
const BAGUETTE_BASE_DOUGH_WEIGHT_G = 800;

export function calculateBaguetteIngredients(doughWeight) {
  const totalDoughWeight = parseInt(doughWeight) || 0;
  if (totalDoughWeight <= 0) return null;

  const ratio = totalDoughWeight / BAGUETTE_BASE_DOUGH_WEIGHT_G;

  const sorghumFlourMix = roundTo(170 * ratio, 5);
  const brownRiceFlour = roundTo(170 * ratio, 5);
  const tapiocaStarch = roundTo(50 * ratio, 5);

  const psylliumHusk = Math.round(8 * ratio);
  const yeast = Math.round(12 * ratio);
  const salt = Math.round(7 * ratio);
  const honey = Math.round(30 * ratio);
  const oil = Math.round(30 * ratio);
  const water = Math.round(300 * ratio);

  const tangzhongTapioca = Math.round(15 * ratio);
  const tangzhongWater = Math.round(100 * ratio);

  return {
    sorghumFlourMix,
    brownRiceFlour,
    tapiocaStarch,
    psylliumHusk,
    yeast,
    salt,
    honey,
    oil,
    water,
    tangzhongTapioca,
    tangzhongWater,
    totalDoughWeight,
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
// Base recipe (1x): 150g bread flour mix, 250g cottage cheese, 250g grated
// cheese, 85g butter, 5g salt, 3g baking powder.
// One stick requires 50g of the flour blend, so the base recipe yields
// 150 / 50 = 3 sticks. The stepper scales the whole recipe against that.
const CHEESE_STICK_FLOUR_PER_STICK_G = 50;
const CHEESE_STICK_BASE_COUNT = 150 / CHEESE_STICK_FLOUR_PER_STICK_G;

export function calculateCheeseStickIngredients(stickCount) {
  const count = parseInt(stickCount) || 0;
  if (count <= 0) return null;

  const ratio = count / CHEESE_STICK_BASE_COUNT;

  const breadFlourMix = count * CHEESE_STICK_FLOUR_PER_STICK_G;
  const cottageCheese = Math.round(250 * ratio);
  const gratedCheese = Math.round(250 * ratio);
  const butter = Math.round(85 * ratio);
  const salt = Math.round(5 * ratio);
  const bakingPowder = Math.round(3 * ratio * 10) / 10;

  return {
    breadFlourMix,
    cottageCheese,
    gratedCheese,
    butter,
    salt,
    bakingPowder,
    stickCount: count,
  };
}
