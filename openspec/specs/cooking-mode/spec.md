# cooking-mode Specification

## Purpose
TBD - created by archiving change add-cooking-mode. Update Purpose after archive.
## Requirements
### Requirement: Cooking Mode Entry
The system SHALL provide a way for users to enter cooking mode from the recipe view.

#### Scenario: Start cooking button displayed
- **WHEN** user views a recipe with instructions
- **THEN** an "Elkészítem" / "Start Cooking" button is displayed below the ingredients section

#### Scenario: Start cooking button navigates to cooking mode
- **WHEN** user taps the "Elkészítem" button
- **THEN** the system navigates to the cooking mode view with the current recipe and calculated ingredient amounts

#### Scenario: Pizza recipe without cooking mode
- **WHEN** user views the pizza dough recipe
- **THEN** no "Elkészítem" button is displayed because pizza has no instructions

### Requirement: Step-by-Step Cooking View
The system SHALL display the recipe as a sequence of interactive steps with associated ingredients.

#### Scenario: Steps displayed in order
- **WHEN** user enters cooking mode
- **THEN** the system displays all cooking steps in sequential order, each with a step number

#### Scenario: Step shows instruction text
- **WHEN** a cooking step is displayed
- **THEN** the step shows the instruction text from the recipe in the user's selected language

#### Scenario: Step shows relevant ingredients
- **WHEN** a cooking step has associated ingredients
- **THEN** the step displays those ingredients with their calculated amounts

#### Scenario: Step without ingredients
- **WHEN** a cooking step has no associated ingredients (action-only step)
- **THEN** the step displays only the instruction text without an ingredients section

### Requirement: Ingredient Progress Tracking
The system SHALL allow users to track which ingredients they have added.

#### Scenario: Ingredient checkbox interaction
- **WHEN** user taps on an ingredient row within a step
- **THEN** the ingredient is marked as checked with visual feedback (strikethrough and checkmark)

#### Scenario: Ingredient uncheck
- **WHEN** user taps on a checked ingredient
- **THEN** the ingredient is unchecked and returns to its original state

#### Scenario: Ingredient checked state persists across steps
- **WHEN** an ingredient is checked in one step
- **AND** the same ingredient appears in another step
- **THEN** the ingredient shows as checked in both steps

### Requirement: Step Progress Tracking
The system SHALL allow users to track which steps they have completed.

#### Scenario: Step completion toggle
- **WHEN** user taps the step completion checkbox
- **THEN** the step is marked as completed with visual feedback (muted colors, checkmark)

#### Scenario: Step completion independent of ingredients
- **WHEN** user marks a step as complete
- **THEN** the step is marked complete regardless of whether all ingredients are checked

#### Scenario: Completed step visual state
- **WHEN** a step is marked as completed
- **THEN** the step card shows a completion indicator and the text appears visually muted

### Requirement: Cooking Mode Navigation
The system SHALL allow users to navigate back from cooking mode.

#### Scenario: Back button returns to recipe
- **WHEN** user taps the back button in cooking mode
- **THEN** the system navigates back to the recipe view

#### Scenario: Hardware back button (Android)
- **WHEN** user presses the hardware back button while in cooking mode
- **THEN** the system navigates back to the recipe view

### Requirement: Cooking Mode Header
The system SHALL display a header with the recipe name in cooking mode.

#### Scenario: Recipe name displayed
- **WHEN** user enters cooking mode
- **THEN** the header displays the recipe name in the user's selected language

#### Scenario: Progress summary in header
- **WHEN** user is in cooking mode
- **THEN** the header displays a progress summary (e.g., "3/7 steps completed")

### Requirement: Recipe Cooking Steps Data
The system SHALL define step-ingredient mappings for each recipe that has instructions.

#### Scenario: Sandwich bread cooking steps
- **WHEN** sandwich bread recipe is loaded
- **THEN** the recipe includes cooking step definitions that map each instruction to its relevant ingredients

#### Scenario: Waffle cooking steps
- **WHEN** waffle recipe is loaded
- **THEN** the recipe includes cooking step definitions that map each instruction to its relevant ingredients

