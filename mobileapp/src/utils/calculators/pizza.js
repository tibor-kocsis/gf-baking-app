import { parseCount, doughTotals } from './scaling';

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

  const weighed = {
    sorghumFlour: Math.round(totalFlour * PIZZA.sorghumShare),
    glutenFreeFlour: Math.round(totalFlour * PIZZA.glutenFreeShare),
    water: perFlour(PIZZA.water),
    salt: perFlour(PIZZA.salt),
    yeast: perFlour(PIZZA.yeast),
    oil: perFlour(PIZZA.oil),
    honey: perFlour(PIZZA.honey),
  };
  return { ...weighed, hydrationPercent: Math.round(PIZZA.water * 100), ...doughTotals(weighed, numPizzas) };
}
