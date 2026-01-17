# Implementation Tasks

## 1. Add Calculation Logic
- [x] 1.1 Create `calculateSandwichBreadIngredients(flourAmount)` function in `src/utils/recipeCalculators.js`
- [x] 1.2 Implement flour ratio calculation (56.67% sorghum, 43.33% universal GF)
- [x] 1.3 Implement water calculation (100% flour hydration + 600% psyllium hydration)
- [x] 1.4 Implement proportional scaling for all other ingredients including eggs and lemon juice

## 2. Update Recipe Data
- [x] 2.1 Change sandwich bread `type` from `'static'` to `'dynamic'` in `src/data/recipes.js`
- [x] 2.2 Add `howManyKey` and `unitLabelKey` translation keys to sandwich bread recipe
- [x] 2.3 Keep `instructionsKey` for displaying preparation steps
- [x] 2.4 Remove static `ingredients` array (will be calculated dynamically)

## 3. Update Translations
- [x] 3.1 Add `recipes.sandwichBread.howMany` key to `locales/en.js` (e.g., "Total flour amount")
- [x] 3.2 Add `recipes.sandwichBread.unitLabel` key to `locales/en.js` (e.g., "grams")
- [x] 3.3 Add same keys to `locales/hu.js`

## 4. Update Dynamic Recipe View
- [x] 4.1 Add sandwich bread case to `DynamicRecipeView.js` ingredient calculation
- [x] 4.2 Render sandwich bread ingredients grouped by category (dry/wet)
- [x] 4.3 Display instructions section after ingredients (already supported for waffles)
- [x] 4.4 Change increment/decrement step to 10g for sandwich bread (vs 1 for pizza/waffles)

## 5. Verification
- [x] 5.1 Test default 300g flour produces original ingredient amounts
- [x] 5.2 Test 600g flour produces correctly doubled amounts
- [x] 5.3 Test water calculation: 300g flour + 5g psyllium = 330g water
- [x] 5.4 Test water calculation: 600g flour + 10g psyllium = 660g water
- [x] 5.5 Verify recipe card shows "Calculator" badge instead of "Recipe"
- [x] 5.6 Test language switching maintains functionality

## Dependencies
- Task 1 has no dependencies (pure function)
- Tasks 2-3 can run in parallel after task 1
- Task 4 depends on tasks 1-3
- Task 5 depends on task 4
