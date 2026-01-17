# recipe-catalog Specification Delta

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
- **AND** the card shows a type badge indicating "Calculator" or "Recipe"

#### Scenario: Language selector at bottom
- **WHEN** viewing the recipe catalog
- **THEN** a language selector is displayed at the bottom of the screen
- **AND** users can switch between English and Hungarian
