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
