# Recipe Catalog

## ADDED Requirements

### Requirement: Recipe Catalog Home Screen
The app SHALL display a recipe catalog as the main home screen, showing all available recipes in a scrollable list.

#### Scenario: User opens the app
- **WHEN** the user launches the app
- **THEN** the recipe catalog screen is displayed
- **AND** all available recipes are shown as cards in a list

#### Scenario: Recipe card display
- **WHEN** a recipe is displayed in the catalog
- **THEN** the card shows the recipe name
- **AND** the card shows an icon/emoji representing the recipe
- **AND** the card shows a short description
- **AND** the card shows a type badge indicating "Calculator" or "Recipe"

### Requirement: Recipe Types
The app SHALL support two types of recipes: dynamic (calculators) and static (fixed recipes).

#### Scenario: Dynamic recipe type
- **WHEN** a recipe has type "dynamic"
- **THEN** it represents a scalable calculator
- **AND** users can adjust the quantity to recalculate ingredients

#### Scenario: Static recipe type
- **WHEN** a recipe has type "static"
- **THEN** it represents a fixed ingredient list
- **AND** ingredient amounts are not adjustable

### Requirement: Recipe Navigation
The app SHALL allow users to navigate from the catalog to individual recipe views.

#### Scenario: Opening a recipe
- **WHEN** the user taps on a recipe card in the catalog
- **THEN** the app navigates to the recipe detail view
- **AND** the appropriate view type is shown based on recipe type

#### Scenario: Returning to catalog
- **WHEN** the user is viewing a recipe detail
- **THEN** a back button or gesture is available
- **AND** tapping back returns to the recipe catalog

### Requirement: Dynamic Recipe View (Calculator)
The app SHALL display dynamic recipes with an interactive calculator interface.

#### Scenario: Viewing pizza dough calculator
- **WHEN** the user opens the pizza dough recipe
- **THEN** a quantity selector is displayed
- **AND** calculated ingredients are shown based on selected quantity
- **AND** the user can increment or decrement the quantity

#### Scenario: Ingredient calculation
- **WHEN** the user changes the quantity in a dynamic recipe
- **THEN** all ingredient amounts are recalculated
- **AND** the display updates with the new values

### Requirement: Static Recipe View
The app SHALL display static recipes with fixed ingredients and instructions.

#### Scenario: Viewing sandwich bread recipe
- **WHEN** the user opens the sandwich bread recipe
- **THEN** the fixed ingredient list is displayed with amounts
- **AND** preparation instructions are displayed in order

#### Scenario: Ingredient display for static recipes
- **WHEN** viewing a static recipe
- **THEN** each ingredient shows name, amount, and unit
- **AND** ingredients are grouped logically (dry, wet, etc.)

### Requirement: Initial Recipe Set
The app SHALL include pizza dough and sandwich bread as the initial recipes.

#### Scenario: Pizza dough recipe available
- **WHEN** the user views the recipe catalog
- **THEN** "Pizza Dough" is listed as an available recipe
- **AND** it is marked as a calculator/dynamic recipe

#### Scenario: Sandwich bread recipe available
- **WHEN** the user views the recipe catalog
- **THEN** "Sandwich Bread" is listed as an available recipe
- **AND** it is marked as a static recipe
