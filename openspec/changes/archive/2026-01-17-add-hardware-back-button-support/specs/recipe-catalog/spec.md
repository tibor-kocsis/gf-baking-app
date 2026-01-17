## MODIFIED Requirements

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
