# Implementation Tasks

## 1. Remove Badge from RecipeCatalog
- [x] 1.1 Remove badge JSX from recipe card in `src/screens/RecipeCatalog.js`
- [x] 1.2 Remove unused styles: `typeBadge`, `typeBadgeDynamic`, `typeBadgeStatic`, `typeBadgeText`

## 2. Remove Unused StaticRecipeView
- [x] 2.1 Delete `src/screens/StaticRecipeView.js`
- [x] 2.2 Remove StaticRecipeView import from `src/navigation/AppNavigator.js`
- [x] 2.3 Remove static recipe fallback branch from AppNavigator (line 31)

## 3. Remove Unused Translations
- [x] 3.1 Remove `common.calculator` and `common.recipe` from `locales/en.js`
- [x] 3.2 Remove `common.calculator` and `common.recipe` from `locales/hu.js`

## 4. Verification
- [x] 4.1 Verify app builds without errors
- [x] 4.2 Verify recipe cards display without badge
- [x] 4.3 Verify all recipes still navigate correctly to DynamicRecipeView

## Dependencies
- Tasks 1-3 can run in parallel
- Task 4 depends on tasks 1-3
