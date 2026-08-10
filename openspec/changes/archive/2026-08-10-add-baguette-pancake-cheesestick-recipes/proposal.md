# Change: Add Baguette, American Pancakes, and Cheese Sticks Recipes

## Why

Three new recipes (baguette, American pancakes, cheese sticks) were captured as raw ingredient notes but never wired into the app. Adding them extends the recipe catalog using the existing dynamic-calculator pattern established by pizza dough, sandwich bread, and waffles — there is no other supported recipe type since static recipe support was removed.

## What Changes

### New Recipes

**Baguette** (flour-based calculator, like sandwich bread)
- User adjusts total flour amount in 10g increments (default: 390g)
- Base recipe (390g flour = 170g sorghum flour mix + 170g brown rice flour + 50g tapioca starch): 8g psyllium husk, 12g yeast, 7g salt, 30g honey, 30g oil, 300g water
- All ingredients scale proportionally by `ratio = totalFlour / 390`
- Preparation includes a tangzhong step: a portion of the tapioca starch (15g at base) and water (100g at base) is cooked into a paste before being folded into the rest of the dough — displayed as an instruction step, not a separate ingredient row

**American Pancakes** (batch multiplier, like waffles)
- User adjusts whole batches (1x, 2x, 3x…)
- Base recipe (1 batch): 250g rice flour, 3g baking powder, a pinch of salt, 50g sugar, 3 eggs, 80g melted butter, 100g warm milk
- All ingredients scale proportionally by the batch multiplier

**Cheese Sticks** (batch multiplier, like waffles)
- User adjusts whole batches (1x, 2x, 3x…)
- Base recipe (1 batch): 150g bread flour mix, 250g cottage cheese (túró), 250g grated cheese, 85g butter, 5g salt, 3g baking powder
- All ingredients scale proportionally by the batch multiplier

## Impact

- **Affected specs**: recipe-catalog (MODIFIED)
- **Affected code**:
  - `mobileapp/src/utils/recipeCalculators.js` - add `calculateBaguetteIngredients`, `calculatePancakeIngredients`, `calculateCheeseStickIngredients`
  - `mobileapp/src/data/recipes.js` - add `baguette`, `pancakes`, `cheese-sticks` entries
  - `mobileapp/src/screens/DynamicRecipeView.js` - add rendering branches for the 3 new recipes
  - `mobileapp/locales/en.js`, `mobileapp/locales/hu.js` - add recipe/ingredient/instruction translation keys
