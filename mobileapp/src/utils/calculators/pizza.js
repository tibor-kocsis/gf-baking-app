import { parseCount } from './scaling';

// The original pizza dough: sorghum flour and a universal GF flour at 60:40,
// 80% water, the flour for one pizza rounded to 25 g steps.
const DOUGH_PER_PIZZA_G = 300;
const DOUGH_PER_FLOUR = 1.945; // dough weight per gram of flour at these percentages
const FLOUR_STEP_G = 25;
const PIZZA = {
  sorghumShare: 0.6,
  glutenFreeShare: 0.4,
  water: 0.8,
  salt: 0.03,
  yeast: 0.015,
  oil: 0.05,
  honey: 0.05,
};

export function calculatePizzaIngredients(count) {
  const numPizzas = parseCount(count);
  if (!numPizzas) return null;

  const flourPerPizza = DOUGH_PER_PIZZA_G / DOUGH_PER_FLOUR;
  const flourRounded = Math.round(flourPerPizza / FLOUR_STEP_G) * FLOUR_STEP_G;
  const totalFlour = flourRounded * numPizzas;
  const perFlour = (share) => Math.round(flourRounded * share * numPizzas);

  const sorghumFlour = Math.round(totalFlour * PIZZA.sorghumShare);
  const glutenFreeFlour = Math.round(totalFlour * PIZZA.glutenFreeShare);
  const water = perFlour(PIZZA.water);
  const salt = perFlour(PIZZA.salt);
  const yeast = perFlour(PIZZA.yeast);
  const oil = perFlour(PIZZA.oil);
  const honey = perFlour(PIZZA.honey);

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
