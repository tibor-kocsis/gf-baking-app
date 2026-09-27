# Change: Update Cheese Sticks Recipe to Version 2.1

## Why
The app's cheese stick recipe is an early version built on the bread flour mix. The
baker's current recipe (v2.1, 2026-09-27) is egg-free, uses its own brown rice,
sorghum, tapioca and potato blend with ground psyllium, margarine, cottage cheese and
sour cream, and was revised because the finished sticks came out dry.

## What Changes
- Replace the cheese stick formula with v2.1, scaled from a 30-stick base (default 30, steps of 5)
- Keep spoon measures (baking powder, salt, sour cream, melted margarine) in spoons, rounded to quarter spoons
- Group ingredients as dough and topping; show prep, rest and bake times and the oven setting
- Replace the instructions with the seven titled v2.1 steps and show each timed step's duration
- Show the recipe's three notes below the instructions
- Cooking mode shows step titles and durations, and recipe-specific ingredient names and spoon units
- Hungarian text is taken verbatim from the recipe; English and German are translations

## Impact
- Affected specs: `recipe-catalog`, `cooking-mode`
- Affected code: `src/utils/recipeCalculators.js`, `src/data/recipes.js`,
  `src/screens/DynamicRecipeView.js`, `src/screens/CookingModeView.js`,
  `locales/hu.js`, `locales/en.js`, `locales/de.js`, `recipes/sajtos-rud.md`
