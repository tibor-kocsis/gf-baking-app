## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Recipe Types
**Reason**: All recipes are now dynamic calculators. The distinction between "dynamic" and "static" recipe types is no longer relevant since static recipes have been converted to calculators.
**Migration**: The `type` field in recipe data remains for internal routing but is no longer displayed to users.
