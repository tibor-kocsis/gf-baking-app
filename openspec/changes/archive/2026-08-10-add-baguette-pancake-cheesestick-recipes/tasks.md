# Implementation Tasks

## 1. Add Calculation Logic
- [x] 1.1 Create `calculateBaguetteIngredients(flourAmount)` in `src/utils/recipeCalculators.js` (390g base flour, proportional scaling)
- [x] 1.2 Create `calculatePancakeIngredients(multiplier)` in `src/utils/recipeCalculators.js` (batch scaling)
- [x] 1.3 Create `calculateCheeseStickIngredients(multiplier)` in `src/utils/recipeCalculators.js` (batch scaling)

## 2. Register Recipes
- [x] 2.1 Add `baguette` entry (`type: 'dynamic'`, `defaultFlour: 390`, `stepSize: 10`) to `src/data/recipes.js`
- [x] 2.2 Add `pancakes` entry (`type: 'dynamic'`) to `src/data/recipes.js`
- [x] 2.3 Add `cheese-sticks` entry (`type: 'dynamic'`) to `src/data/recipes.js`

## 3. Update Dynamic Recipe View
- [x] 3.1 Add `isBaguette`/`isPancakes`/`isCheeseSticks` checks and include baguette in flour-based initial value logic
- [x] 3.2 Extend the ingredient-calculation dispatch with the 3 new branches
- [x] 3.3 Render ingredient cards (flour/dry/wet categories) for each new recipe
- [x] 3.4 Render instructions sections for each new recipe

## 4. Update Translations
- [x] 4.1 Add `recipes.baguette`, `recipes.pancakes`, `recipes.cheeseSticks` (name, description, unitLabel, howMany) to `locales/en.js` and `locales/hu.js`
- [x] 4.2 Add new `ingredients.*` keys (sorghum flour mix, brown rice flour, tapioca starch, rice flour, bread flour mix, cottage cheese, grated cheese) to both locale files
- [x] 4.3 Add `instructions.baguette`, `instructions.pancakes`, `instructions.cheeseSticks` arrays to both locale files

## 5. Verification
- [x] 5.1 All 6 recipes appear on the catalog screen in both languages
- [x] 5.2 Baguette defaults to 390g flour and adjusts in 10g steps
- [x] 5.3 Pancakes and Cheese Sticks default to 1 batch and adjust in steps of 1
- [x] 5.4 Ingredient amounts scale correctly for all 3 new recipes
- [x] 5.5 Language switching updates all new recipe text
