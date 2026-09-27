# Change: Add Pizza Dough 2

## Why
The baker wants to drop the Miklós universal gluten-free mix from the pizza and bake a
thinner base with an airy rim. The original pizza stays, so the two can be compared.

## What Changes
- Add a "Pizza dough 2" recipe (pizza-count calculator, a 290 g dough ball per pizza)
- Blend from the cupboard: sorghum unimix, potato starch, brown rice (as tangzhong) and
  psyllium husk, at ~40:60 flour to starch and 4.5% total psyllium
- 90% hydration split into tangzhong, psyllium gel and yeast water; 6% oil, 3% honey,
  2.2% salt, 1.5% yeast
- Instructions with par-baking, cooking-mode steps, and notes on tuning the water
- A tangzhong switch, on by default: off bakes the same blend with the brown rice raw at 87% water
- Recipe notes render for any recipe that carries them, not only the cheese sticks

## Impact
- Affected specs: `recipe-catalog`
- Affected code: `src/utils/recipeCalculators.js`, `src/data/recipes.js`,
  `src/screens/DynamicRecipeView.js`, `locales/*.js`, `recipes/pizza-2.md`
