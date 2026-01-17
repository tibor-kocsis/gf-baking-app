# Change: Remove Recipe Type Badge and Unused Code

## Why

Since all recipes are now dynamic calculators, the "Calculator"/"Recipe" badge on recipe cards is redundant and adds visual clutter. Additionally, the `StaticRecipeView` component and related code are now unused dead code that should be removed for maintainability.

## What Changes

### UI Changes
- Remove the type badge (showing "Calculator" or "Recipe") from recipe cards in the catalog

### Code Cleanup
- Delete `src/screens/StaticRecipeView.js` (unused - all recipes are dynamic)
- Remove StaticRecipeView import and fallback from `src/navigation/AppNavigator.js`
- Remove unused translation keys: `common.calculator`, `common.recipe`
- Remove unused styles: `typeBadge`, `typeBadgeDynamic`, `typeBadgeStatic`, `typeBadgeText`

## Impact

- **Affected specs**: recipe-catalog (MODIFIED)
- **Affected code**:
  - `src/screens/RecipeCatalog.js` - Remove badge rendering and styles
  - `src/screens/StaticRecipeView.js` - DELETE file
  - `src/navigation/AppNavigator.js` - Remove StaticRecipeView import and fallback
  - `locales/en.js` - Remove `common.calculator` and `common.recipe`
  - `locales/hu.js` - Remove `common.calculator` and `common.recipe`

### No Behavioral Changes
This is a cleanup change. Recipe cards will still display name, icon, and description - just without the type badge.
