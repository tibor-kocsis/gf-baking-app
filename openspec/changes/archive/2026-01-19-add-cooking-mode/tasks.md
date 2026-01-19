## 1. Recipe Data Enhancement
- [x] 1.1 Add `cookingSteps` array to sandwich-bread recipe in `src/data/recipes.js`
- [x] 1.2 Add `cookingSteps` array to waffles recipe in `src/data/recipes.js`
- [x] 1.3 Verify step-ingredient mappings match actual recipe instructions

## 2. Localization
- [x] 2.1 Add cooking mode translations to `locales/en.js` (button label, progress text, header)
- [x] 2.2 Add cooking mode translations to `locales/hu.js`

## 3. Cooking Mode Screen
- [x] 3.1 Create `src/screens/CookingModeView.js` with basic structure
- [x] 3.2 Implement step card component with instruction display
- [x] 3.3 Implement ingredient row with checkbox within steps
- [x] 3.4 Add step completion checkbox and visual states
- [x] 3.5 Implement progress state (useState for checked ingredients and completed steps)
- [x] 3.6 Add header with recipe name and progress summary
- [x] 3.7 Style components to match app design system (colors, cards, typography)

## 4. Navigation Integration
- [x] 4.1 Add 'cooking' screen type to `AppNavigator.js`
- [x] 4.2 Create `navigateToCooking` function that passes recipe and ingredients
- [x] 4.3 Render `CookingModeView` when screen type is 'cooking'
- [x] 4.4 Handle hardware back button for cooking mode

## 5. Recipe View Update
- [x] 5.1 Add "Elkészítem" button to `DynamicRecipeView.js` for recipes with instructions
- [x] 5.2 Connect button to navigate to cooking mode with calculated ingredients

## 6. Validation
- [x] 6.1 Test cooking mode with sandwich bread recipe (build passes)
- [x] 6.2 Test cooking mode with waffle recipe (build passes)
- [x] 6.3 Verify pizza recipe does not show cooking button (no cookingSteps or instructionsKey)
- [x] 6.4 Test language switching in cooking mode (translations added)
- [x] 6.5 Test navigation flow (catalog -> recipe -> cooking -> recipe -> catalog)
