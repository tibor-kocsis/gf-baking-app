# Change: Add Pizza Dough 3

## Why
The baker wants a pizza on the principle of Caputo's gluten-free flour (Fioreglut):
a starch-led dough with a heavy binder that is stretched rather than pressed and baked
in one go. Buckwheat flour is now in the cupboard, and the recipe uses plain flours and
starches only, no mixes.

## What Changes
- Add a "Pizza dough 3" recipe (pizza-count calculator, 280 g balls)
- 20:80 flour to starch: buckwheat and sorghum 10% each; corn 40%, potato 20%, tapioca 20%
- 6% psyllium husk gelled 1:10, 80% water, 5% honey, 3.5% olive oil, 2.5% salt, 1.5% fresh yeast
- Same-day process: rest, warm ball proof, stretch on rice flour, bake in one go at 250-275 °C
- Pizza dough 2 and 3 share one grouped-ingredient and instruction rendering

## Impact
- Affected specs: `recipe-catalog`
- Affected code: `src/utils/recipeCalculators.js`, `src/data/recipes.js`,
  `src/screens/DynamicRecipeView.js`, `locales/*.js`, `recipes/pizza-3.md`
