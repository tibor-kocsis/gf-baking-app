# Change: Add Waffle Calculator Recipe

## Why
Expand the recipe catalog with a gluten-free waffle (gofri) calculator. This is a dynamic recipe where all ingredients scale based on a multiplier, similar to the existing pizza dough calculator.

## What Changes
- Add a new dynamic "Waffle" recipe to the recipe catalog
- Implement waffle ingredient calculation based on a multiplier (1x, 2x, 3x, etc.)
- Add English and Hungarian translations for the waffle recipe

## Base Recipe (1x multiplier)
- 1 egg
- 100 ml milk
- 100 g flour (GF)
- 25 g butter
- 1 tsp vanilla extract
- 15 g sugar
- 2.5 g baking powder

## Impact
- Affected specs: `recipe-catalog` (adds waffle recipe to initial set)
- Affected code: `App.js` (recipe data, calculation function), `locales/en.js`, `locales/hu.js`
