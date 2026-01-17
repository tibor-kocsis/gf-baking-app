# app-architecture Specification

## Purpose
TBD - created by archiving change refactor-introduce-modular-architecture. Update Purpose after archive.
## Requirements
### Requirement: Modular Directory Structure
The application SHALL organize source code into a modular directory structure under `mobileapp/src/` with clear separation of concerns.

#### Scenario: Developer navigates codebase
- **WHEN** a developer opens the `mobileapp/src/` directory
- **THEN** they see clearly named subdirectories: `constants/`, `context/`, `data/`, `utils/`, `components/`, `screens/`, and `navigation/`

#### Scenario: Adding a new recipe
- **WHEN** a developer needs to add a new recipe
- **THEN** they add recipe data to `src/data/recipes.js`, add calculator logic (if dynamic) to `src/utils/recipeCalculators.js`, and add translations to locale files without modifying existing screen components

### Requirement: Separated Business Logic
The application SHALL keep business logic (calculations, data transformations) in utility functions separate from UI components.

#### Scenario: Recipe calculation isolation
- **WHEN** the pizza dough calculator computes ingredient amounts
- **THEN** the calculation logic resides in `src/utils/recipeCalculators.js` as a pure function that takes count as input and returns ingredient amounts without any React dependencies

#### Scenario: Testing calculation logic
- **WHEN** a developer wants to test calculation accuracy
- **THEN** they can import and test `calculatePizzaIngredients` and `calculateWaffleIngredients` functions without rendering any UI components

### Requirement: Reusable UI Components
The application SHALL extract commonly used UI patterns into reusable components in `src/components/`.

#### Scenario: Header component reuse
- **WHEN** a recipe detail screen needs a back button and title
- **THEN** it imports and uses the shared `Header` component from `src/components/Header.js`

#### Scenario: Ingredient row consistency
- **WHEN** any recipe view displays an ingredient
- **THEN** it uses the shared `IngredientRow` component ensuring consistent emoji, name, and amount formatting across all recipes

### Requirement: Centralized Configuration
The application SHALL centralize configuration values (colors, keys) in the `src/constants/` directory.

#### Scenario: Color palette consistency
- **WHEN** any component needs to apply a theme color
- **THEN** it imports from `src/constants/colors.js` ensuring consistent visual styling across all screens

#### Scenario: Storage key management
- **WHEN** the app stores or retrieves persistent data
- **THEN** it uses storage keys defined in a central location preventing key string duplication

### Requirement: Context-Based Global State
The application SHALL use React Context for global state management (i18n, navigation) without external state libraries.

#### Scenario: i18n context usage
- **WHEN** any component needs translated text
- **THEN** it calls `useI18n()` hook which accesses the `I18nContext` provider in `src/context/I18nContext.js`

#### Scenario: No external state dependencies
- **WHEN** the application is built
- **THEN** it does not include Redux, MobX, Zustand, or other external state management libraries

### Requirement: Screen-Based Navigation
The application SHALL manage navigation through a dedicated navigator component that renders screens based on state.

#### Scenario: Navigation state management
- **WHEN** the user navigates between catalog and recipe views
- **THEN** the `AppNavigator` component in `src/navigation/AppNavigator.js` manages screen state and renders the appropriate screen component

#### Scenario: Screen component isolation
- **WHEN** a screen component is rendered
- **THEN** it receives navigation callbacks as props and does not directly manage global navigation state

### Requirement: Documented Architecture
The application SHALL document its architecture patterns in `openspec/project.md` to guide future development.

#### Scenario: New developer onboarding
- **WHEN** a new developer reads `project.md`
- **THEN** they find an "Architecture Patterns" section explaining the directory structure, how to add recipes, and component conventions

#### Scenario: Recipe addition guide
- **WHEN** a developer needs to add a new recipe
- **THEN** project.md provides step-by-step instructions referencing specific files to modify

