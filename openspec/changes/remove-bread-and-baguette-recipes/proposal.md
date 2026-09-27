# Change: Remove the Sandwich Bread and Baguette Recipes

## Why
The baker now builds bread and rolls from the flour mix calculator, and the committed
sandwich bread and baguette recipes were already stale against their current practice.
Two fixed bread recipes beside the calculator only invite confusion.

## What Changes
- **BREAKING** Remove the sandwich bread and baguette recipes: catalog entries,
  calculators, screen branches and their texts in all three languages
- Rename the flour mix tile to "Bread, rolls" ("Kenyér, zsemle", "Brot, Brötchen"), with a 🍞 icon in place of ⚖️
- The recipe records in `recipes/gf-bread.md` and `recipes/bagett.md` are kept
- Notes saved against the two removed recipes stay in storage but are no longer reachable

## Impact
- Affected specs: `recipe-catalog`, `cooking-mode`
- Builds on `update-cheese-sticks-recipe`, whose version of the Dynamic Recipe View
  requirement this change modifies further; archive that one first
- Affected code: `src/data/recipes.js`, `src/utils/recipeCalculators.js`,
  `src/screens/DynamicRecipeView.js`, `locales/*.js`
