# Change: Introduce Modular Architecture for Long-Term Maintainability

## Why

The application is currently a single 1063-line `App.js` file containing i18n setup, color palette, recipe data, calculation logic, navigation state, and all UI components. As the app grows with many features and recipes, this monolithic structure will become:

1. **Hard to navigate** - Developers must scroll through 1000+ lines to find specific functionality
2. **Difficult to test** - Business logic is intertwined with UI components
3. **Prone to merge conflicts** - All changes touch the same file
4. **Challenging to extend** - Adding new recipes or features requires understanding the entire file

This refactor introduces a modular architecture following SOLID, DRY, and KISS principles while keeping the implementation straightforward and avoiding over-engineering.

## What Changes

### Directory Structure (New)
```
mobileapp/
├── App.js                     # Entry point only
├── src/
│   ├── constants/
│   │   └── colors.js          # Color palette
│   ├── context/
│   │   └── I18nContext.js     # i18n provider and hook
│   ├── data/
│   │   └── recipes.js         # Recipe definitions
│   ├── utils/
│   │   └── recipeCalculators.js  # Calculation logic
│   ├── components/
│   │   ├── Header.js          # Shared header component
│   │   ├── IngredientRow.js   # Shared ingredient display
│   │   └── LanguageSelector.js # Language toggle
│   ├── screens/
│   │   ├── RecipeCatalog.js   # Home screen
│   │   ├── DynamicRecipeView.js  # Calculator recipes
│   │   └── StaticRecipeView.js   # Fixed recipes
│   └── navigation/
│       └── AppNavigator.js    # Navigation state management
├── locales/                   # Existing translation files
└── ...
```

### Principles Applied
- **Single Responsibility (S)**: Each module has one clear purpose
- **Open/Closed (O)**: New recipes can be added without modifying existing code
- **Liskov Substitution (L)**: Recipe types share consistent interfaces
- **Interface Segregation (I)**: Components receive only the props they need
- **Dependency Inversion (D)**: Components depend on abstractions (context) not concrete implementations

### KISS Approach
- No external state management library (React Context is sufficient)
- No complex folder nesting (flat structure where possible)
- No abstract factories or complex patterns
- File-based routing preparation (each screen = one file)

### DRY Approach
- Extract shared components (Header, IngredientRow)
- Centralize color definitions
- Single source of truth for recipe data
- Reusable calculation utilities

## Impact

- **Affected specs**: app-architecture (NEW)
- **Affected code**:
  - `mobileapp/App.js` (refactor into multiple files)
  - New: `mobileapp/src/` directory structure
- **project.md update**: Add architecture patterns section documenting the new structure

### No Behavioral Changes
This is a pure refactor. All existing functionality, UI, and user interactions remain identical. Tests should pass without modification after the refactor.

### Migration Path
- Phase 1: Create new directory structure and files
- Phase 2: Move code from App.js to appropriate modules
- Phase 3: Update App.js to import from new modules
- Phase 4: Verify all functionality works identically
- Phase 5: Update project.md with architecture documentation
