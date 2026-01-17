# Implementation Tasks

## 1. Create Directory Structure
- [x] 1.1 Create `mobileapp/src/` directory
- [x] 1.2 Create subdirectories: `constants/`, `context/`, `data/`, `utils/`, `components/`, `screens/`, `navigation/`

## 2. Extract Constants
- [x] 2.1 Create `src/constants/colors.js` with color palette object
- [x] 2.2 Create `src/constants/storage.js` with storage keys (LANGUAGE_STORAGE_KEY)

## 3. Extract Context
- [x] 3.1 Create `src/context/I18nContext.js` with I18nProvider and useI18n hook
- [x] 3.2 Move translation imports and i18n logic to the context file

## 4. Extract Data
- [x] 4.1 Create `src/data/recipes.js` with recipes array
- [x] 4.2 Ensure recipe objects use translation keys (not inline translations)

## 5. Extract Utilities
- [x] 5.1 Create `src/utils/recipeCalculators.js` with calculatePizzaIngredients function
- [x] 5.2 Add calculateWaffleIngredients function to the same file

## 6. Extract Shared Components
- [x] 6.1 Create `src/components/Header.js` with Header component
- [x] 6.2 Create `src/components/IngredientRow.js` with IngredientRow component
- [x] 6.3 Create `src/components/LanguageSelector.js` with LanguageSelector component

## 7. Extract Screens
- [x] 7.1 Create `src/screens/RecipeCatalog.js` with RecipeCatalog component
- [x] 7.2 Create `src/screens/DynamicRecipeView.js` with DynamicRecipeView component
- [x] 7.3 Create `src/screens/StaticRecipeView.js` with StaticRecipeView component
- [x] 7.4 Each screen imports its dependencies from src/ modules

## 8. Create Navigation
- [x] 8.1 Create `src/navigation/AppNavigator.js` with navigation state and screen rendering
- [x] 8.2 AppNavigator imports and renders appropriate screen based on state

## 9. Update App Entry Point
- [x] 9.1 Refactor `App.js` to be a thin entry point
- [x] 9.2 App.js imports I18nProvider and AppNavigator only
- [x] 9.3 Remove all other code from App.js (now lives in src/)

## 10. Verification
- [x] 10.1 Run app on web and verify catalog loads correctly
- [x] 10.2 Test navigation to pizza dough recipe and verify calculations work
- [x] 10.3 Test navigation to sandwich bread recipe and verify ingredients display
- [x] 10.4 Test navigation to waffle recipe and verify calculations and instructions work
- [x] 10.5 Test language switching (EN/HU) and verify translations update
- [x] 10.6 Test language persistence (refresh app, verify language is remembered)

## 11. Update Documentation
- [x] 11.1 Add "Architecture Patterns" section to `openspec/project.md`
- [x] 11.2 Document directory structure and purpose of each folder
- [x] 11.3 Add "How to Add a New Recipe" guide
- [x] 11.4 Add "How to Add a New Language" guide

## Dependencies
- Tasks 2-6 can be done in parallel (no dependencies between them)
- Task 7 depends on tasks 2-6 (screens import from extracted modules)
- Task 8 depends on task 7 (navigator renders screens)
- Task 9 depends on tasks 3 and 8 (App.js uses I18nProvider and AppNavigator)
- Task 10 depends on task 9 (full app must be wired up)
- Task 11 depends on task 10 (document what was actually implemented)
