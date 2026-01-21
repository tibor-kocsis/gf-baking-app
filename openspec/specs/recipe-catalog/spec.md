# recipe-catalog Specification

## Purpose
TBD - created by archiving change extend-recipe-catalog. Update Purpose after archive.
## Requirements
### Requirement: Recipe Catalog Home Screen
The app SHALL display a recipe catalog as the main home screen, showing all available recipes in a scrollable list and providing access to language selection.

#### Scenario: User opens the app
- **WHEN** the user launches the app
- **THEN** the recipe catalog screen is displayed
- **AND** all available recipes are shown as cards in a list

#### Scenario: Recipe card display
- **WHEN** a recipe is displayed in the catalog
- **THEN** the card shows the recipe name
- **AND** the card shows an icon/emoji representing the recipe
- **AND** the card shows a short description

#### Scenario: Language selector at bottom
- **WHEN** viewing the recipe catalog
- **THEN** a language selector is displayed at the bottom of the screen
- **AND** users can switch between English and Hungarian

### Requirement: Recipe Navigation
The app SHALL allow users to navigate from the catalog to individual recipe views.

#### Scenario: Opening a recipe
- **WHEN** the user taps on a recipe card in the catalog
- **THEN** the app navigates to the recipe detail view

#### Scenario: Returning to catalog via UI
- **WHEN** the user is viewing a recipe detail
- **THEN** a back button is available in the header
- **AND** tapping the back button returns to the recipe catalog

#### Scenario: Returning to catalog via hardware back button
- **WHEN** the user is viewing a recipe detail on Android
- **AND** the user presses the hardware back button
- **THEN** the app navigates back to the recipe catalog
- **AND** the app does not exit or go to background

#### Scenario: Exiting app from catalog
- **WHEN** the user is on the recipe catalog home screen
- **AND** the user presses the hardware back button
- **THEN** the app exits or goes to background (default system behavior)

### Requirement: Dynamic Recipe View (Calculator)
The app SHALL display dynamic recipes with an interactive calculator interface.

#### Scenario: Viewing pizza dough calculator
- **WHEN** the user opens the pizza dough recipe
- **THEN** a quantity selector is displayed
- **AND** calculated ingredients are shown based on selected quantity
- **AND** the user can increment or decrement the quantity

#### Scenario: Viewing waffle calculator
- **WHEN** the user opens the waffle recipe
- **THEN** a multiplier selector is displayed (1x, 2x, 3x, etc.)
- **AND** calculated ingredients are shown based on selected multiplier
- **AND** the user can increment or decrement the multiplier

#### Scenario: Viewing sandwich bread calculator
- **WHEN** the user opens the sandwich bread recipe
- **THEN** a flour amount selector is displayed (default 300g)
- **AND** calculated ingredients are shown based on selected flour amount
- **AND** the user can adjust flour amount in 10g increments
- **AND** preparation instructions are displayed below the ingredients

#### Scenario: Sandwich bread water calculation
- **WHEN** the sandwich bread ingredients are calculated
- **THEN** water amount equals flour amount plus psyllium hydration
- **AND** flour hydration is 100% (1g water per 1g flour)
- **AND** psyllium hydration is 600% (6g water per 1g psyllium)

#### Scenario: Ingredient calculation
- **WHEN** the user changes the quantity in a dynamic recipe
- **THEN** all ingredient amounts are recalculated
- **AND** the display updates with the new values

#### Scenario: Notes section in recipe detail
- **WHEN** the user views a recipe detail (DynamicRecipeView)
- **THEN** a "My Notes" section is displayed below the ingredients/instructions
- **AND** the section shows existing notes or an empty state prompt
- **AND** an "Add Note" button allows creating new notes

#### Scenario: Notes count indicator
- **WHEN** a recipe has one or more notes
- **THEN** the notes section header displays the note count
- **AND** provides quick visual indication of existing notes

### Requirement: Initial Recipe Set
The app SHALL include pizza dough, sandwich bread, and waffles as the initial recipes.

#### Scenario: Pizza dough recipe available
- **WHEN** the user views the recipe catalog
- **THEN** "Pizza Dough" is listed as an available recipe

#### Scenario: Sandwich bread recipe available
- **WHEN** the user views the recipe catalog
- **THEN** "Sandwich Bread" is listed as an available recipe

#### Scenario: Waffle recipe available
- **WHEN** the user views the recipe catalog
- **THEN** "Waffles" is listed as an available recipe

