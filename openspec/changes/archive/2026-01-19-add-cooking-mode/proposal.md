# Change: Add Step-by-Step Cooking Mode

## Why
Users currently see recipes with static ingredient lists and instructions but have no way to track their progress while cooking. This makes it difficult to remember which ingredients have been added or which steps have been completed, especially for complex recipes with many steps.

## What Changes
- Add an "Elkészítem" (Start Cooking) button to the DynamicRecipeView that activates cooking mode
- Create a new CookingModeView screen that displays the recipe as interactive steps
- Each step combines instructions with the specific ingredients needed at that step
- Users can check off ingredients and steps as they complete them
- Progress state persists during the cooking session
- The view analyzes recipe instructions to intelligently associate ingredients with specific steps

## Impact
- Affected specs: recipe-catalog (modified), cooking-mode (new capability)
- Affected code:
  - `src/screens/DynamicRecipeView.js` - Add "Elkészítem" button
  - `src/screens/CookingModeView.js` - New cooking mode screen
  - `src/navigation/AppNavigator.js` - Add navigation to cooking mode
  - `src/data/recipes.js` - Add step-ingredient mappings per recipe
  - `locales/en.js`, `locales/hu.js` - Add cooking mode translations
