# Change: Convert Sandwich Bread to Dynamic Calculator

## Why

The sandwich bread recipe is currently static with fixed ingredient amounts based on 300g of flour. Users may want to bake larger or smaller loaves, requiring them to manually calculate ingredient ratios. Converting this to a dynamic calculator (like pizza dough and waffles) will allow users to adjust the total flour amount and have all ingredients automatically recalculated.

## What Changes

### Recipe Type Change
- Sandwich bread changes from `type: 'static'` to `type: 'dynamic'`
- User can adjust total flour amount in 10g increments (default: 300g)
- All ingredients scale proportionally based on flour ratio

### Calculation Logic

**Base ratios (per 300g flour):**
- Sorghum flour: 56.67% of total flour (170g)
- Universal GF flour: 43.33% of total flour (130g)
- Psyllium husk: 1.67% of flour (5g)
- Active yeast: 2.67% of flour (8g)
- Salt: 1.67% of flour (5g)
- Oil: 6.67% of flour (20g)
- Honey: 6.67% of flour (20g)
- Egg: 1 per 300g flour (scales proportionally)
- Lemon juice: 1 tbsp per 300g flour (scales proportionally)

**Water calculation (special formula):**
- Flour hydration: 100% of total flour
- Psyllium hydration: 600% of psyllium amount
- Total water = flour + (psyllium × 6)

**Example for 600g flour:**
- Sorghum: 340g, Universal GF: 260g
- Psyllium: 10g, Yeast: 16g, Salt: 10g
- Oil: 40g, Honey: 40g
- Eggs: 2, Lemon juice: 2 tbsp
- Water: 600 + (10 × 6) = 660g

## Impact

- **Affected specs**: recipe-catalog (MODIFIED)
- **Affected code**:
  - `src/data/recipes.js` - Change sandwich bread type to dynamic
  - `src/utils/recipeCalculators.js` - Add `calculateSandwichBreadIngredients` function
  - `src/screens/DynamicRecipeView.js` - Add sandwich bread rendering with instructions
  - Translation files - Add `howManyKey` for sandwich bread

### UI Changes
- Sandwich bread will show +/- buttons to adjust flour amount by 10g
- Badge changes from "Recipe" to "Calculator"
- Instructions still display below ingredients (like waffles)
