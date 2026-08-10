# Project Context

## Purpose
Gluten Free Baking is a mobile app that serves as a comprehensive gluten-free recipe companion. It features a recipe catalog of interactive calculators (scalable recipes like pizza dough, sandwich bread, and baguette) that recalculate ingredient amounts as the user adjusts a quantity, flour amount, or batch multiplier.

## Tech Stack
- **Framework**: React Native with Expo SDK 54
- **Language**: JavaScript (ES6+)
- **React**: 19.1.0
- **UI**: React Native core components + Animated API
- **Platforms**: iOS, Android, Web (via react-native-web)

## App Structure

### Recipe Catalog (Home Screen)
- Scrollable list of recipe cards
- Each card displays: name, icon/emoji, short description

### Recipe Types
- **Dynamic (Calculator)**: Every recipe is a scalable calculator where users adjust a quantity, total flour amount, or batch multiplier to recalculate ingredients (e.g., pizza dough, sandwich bread, baguette). There is no static/fixed recipe type.

### Initial Recipe Set
- Pizza Dough (quantity calculator)
- Sandwich Bread (flour amount calculator, 10g steps)
- Waffles (batch calculator)
- Baguette (ready dough weight calculator, 50g steps)
- American Pancakes (pancake-count calculator, 1 pancake steps)
- Cheese Sticks (stick-count calculator, 1 stick steps)

## UI Design

### Color Palette
- Primary: Warm brown tones (inspired by baking)
- Background: Warm off-white (flour-inspired)
- Accents: Golden wheat or olive green

### Layout
- Card-based design with rounded corners and subtle shadows
- Consistent padding and spacing throughout
- Clear typography hierarchy (large bold titles, uppercase section headers)

### Interactions
- Visual feedback on button presses (opacity, scale, or color shift)
- Smooth animations for calculation updates

## Project Conventions

### Code Style
- Functional components with React hooks (useState, useEffect, useRef)
- Component functions use PascalCase (e.g., `RecipeCard`)
- Handler functions use camelCase with "handle" prefix (e.g., `handleRecipePress`)
- StyleSheet defined at bottom of component file
- Inline styles avoided in favor of StyleSheet references

### Architecture Patterns

The app follows a modular architecture organized by technical layer:

```
mobileapp/
├── App.js                     # Entry point (thin wrapper)
├── src/
│   ├── constants/             # Static configuration values
│   │   ├── colors.js          # Color palette
│   │   └── storage.js         # AsyncStorage keys
│   ├── context/               # React Context providers
│   │   └── I18nContext.js     # i18n provider and useI18n hook
│   ├── data/                  # Data definitions
│   │   └── recipes.js         # Recipe catalog data
│   ├── utils/                 # Pure functions and helpers
│   │   └── recipeCalculators.js  # Pizza/waffle calculation logic
│   ├── components/            # Reusable UI components
│   │   ├── Header.js          # Back button + title
│   │   ├── IngredientRow.js   # Ingredient display row
│   │   └── LanguageSelector.js # EN/HU toggle
│   ├── screens/               # Full-page views
│   │   ├── RecipeCatalog.js   # Home screen
│   │   └── DynamicRecipeView.js  # Calculator recipes
│   └── navigation/            # Navigation state
│       └── AppNavigator.js    # Screen routing
└── locales/                   # Translation files
    ├── en.js
    └── hu.js
```

**Key Principles:**
- **Single Responsibility**: Each module has one clear purpose
- **No External State Library**: React Context is sufficient for i18n and navigation
- **Pure Calculation Functions**: Business logic in utils/ is testable without UI
- **Colocated Styles**: StyleSheet defined at bottom of each component file
- **Animations**: Use React Native Animated API with native driver

### Testing Strategy
- Jest + React Native Testing Library for unit and component tests
- Test calculation logic separately from UI components (import from `src/utils/recipeCalculators.js`)

### How to Add a New Recipe

1. **Add recipe data** to `src/data/recipes.js`:
   - Include `type: 'dynamic'`, `howManyKey`, and optionally `instructionsKey`
   - Set `initialValue` to the selector's starting number (whatever unit the recipe scales by: grams, pancakes, sticks...) and `stepSize` to its increment. Both default to `1` if omitted (e.g. pizza/waffles' plain quantity/batch multiplier)

2. **Add translations** to `locales/en.js` and `locales/hu.js`:
   - Recipe name and description under `recipes.<id>`
   - Ingredient names under `ingredients`
   - Instructions array under `instructions.<id>`

3. **Add a calculation function** to `src/utils/recipeCalculators.js`:
   - Export a pure function like `calculateNewRecipeIngredients(count)`
   - Update `DynamicRecipeView.js` to add an `isXxx` check, a branch in the ingredient-calculation dispatch, and JSX ingredient/instruction cards for the new recipe (this file is not data-driven — each recipe currently needs its own rendering branch)

4. **No changes needed** to navigation or catalog - they automatically display new recipes

### How to Add a New Language

1. Create `locales/<code>.js` with all translation keys (copy structure from `en.js`)
2. Import in `src/context/I18nContext.js` and add to `translations` object
3. Add a button to `src/components/LanguageSelector.js`

### Git Workflow
- Trunk-based development: commit directly to main with small, frequent changes
- Keep commits focused and atomic
- Write descriptive commit messages

## Domain Context

### Pizza Dough Recipe (Dynamic)
- Each pizza = 300g total dough weight
- Flour ratio: 60% sorghum flour, 40% universal gluten-free flour
- Other ingredients as percentages of flour weight:
  - Water: 80%
  - Salt: 3%
  - Yeast: 1.5%
  - Oil: 5%
  - Honey: 5%
- Flour amounts rounded to nearest 25g

### Sandwich Bread Recipe (Dynamic, flour-based)
- Base recipe: 300g total flour, adjustable in 10g steps
- Water = flour (100% hydration) + psyllium × 6 (600% hydration)
- Ingredients grouped by category (flour, dry, wet)
- Step-by-step preparation instructions

### Baguette Recipe (Dynamic, dough-weight-based)
- Base recipe: 390g total flour (sorghum flour mix, brown rice flour, tapioca starch) + other ingredients = 800g total ready dough weight (rounded to the nearest 50g), adjustable in 50g steps
- The selector scales the whole recipe by total dough weight (not just flour), since every ingredient is proportional to the same base ratio
- Flour amounts (sorghum flour mix, brown rice flour, tapioca starch) round to the nearest 5g; other ingredients round to the nearest 1g since 5g would be too coarse relative to their size
- A portion of the tapioca starch and water (already counted in those totals, not extra) is used for a tangzhong (cooked paste) step, called out in the instructions with the exact gram amounts
- Ingredients grouped by category (flour, dry, wet)
- Step-by-step preparation instructions

### American Pancakes Recipe (Dynamic, pancake-count-based)
- Base recipe (1x): 250g rice flour, 3g baking powder, 1g salt, 50g sugar, 3 eggs (~50g each), 80g butter, 100g milk = 634g total batter
- One 6cm-diameter pancake is estimated at ~28g (3cm-radius, ~1cm-thick portion of batter at ~1g/cm³), so the base recipe yields ~22 pancakes
- The selector scales the whole recipe against that base pancake count, in steps of 1 pancake

### Cheese Sticks Recipe (Dynamic, stick-count-based)
- Base recipe (1x): 150g bread flour mix, 250g cottage cheese, 250g grated cheese, 85g butter, 5g salt, 3g baking powder
- One stick requires 50g of the flour blend, so the base recipe yields 150 / 50 = 3 sticks
- The selector scales the whole recipe against that base stick count, in steps of 1 stick

## Internationalization (i18n)
- **Supported Languages**: English (en), Hungarian (hu)
- **Default Language**: Device locale if supported, otherwise English
- **Language Selection**: Available at the bottom of the main catalog screen
- **Persistence**: User's language preference is stored locally and restored on app launch

## Important Constraints
- All recipes must be gluten-free (no wheat flour)
- App should work offline (no backend required)
- Support metric measurements (grams)

## Development Environment
- **Container**: VS Code devcontainer (Ubuntu-based)
- **Forwarded Ports**: 5173 (Vite), 3000 (general), 8081 (Expo Metro bundler)
- **Mobile Testing**: Use `npm run start:lan` or `npx expo start --tunnel` to expose Expo to physical devices
- **Host Access**: Set `REACT_NATIVE_PACKAGER_HOSTNAME=<HOST_IP>` when LAN mode doesn't detect the correct IP

## External Dependencies
- Expo managed workflow (no native code modifications)
- EAS Build for generating APK/IPA files

## App Branding
- **Name**: Gluten Free Baking
- **iOS Bundle ID**: com.glutenfreebaking.app
- **Android Package**: com.glutenfreebaking.app
