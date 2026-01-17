# recipe-catalog Specification Delta

## MODIFIED Requirements

### Requirement: Initial Recipe Set
The app SHALL include pizza dough, sandwich bread, and waffles as the initial recipes.

#### Scenario: Pizza dough recipe available
- **WHEN** the user views the recipe catalog
- **THEN** "Pizza Dough" is listed as an available recipe
- **AND** it is marked as a calculator/dynamic recipe

#### Scenario: Sandwich bread recipe available
- **WHEN** the user views the recipe catalog
- **THEN** "Sandwich Bread" is listed as an available recipe
- **AND** it is marked as a static recipe

#### Scenario: Waffle recipe available
- **WHEN** the user views the recipe catalog
- **THEN** "Waffles" is listed as an available recipe
- **AND** it is marked as a calculator/dynamic recipe

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

#### Scenario: Ingredient calculation
- **WHEN** the user changes the quantity in a dynamic recipe
- **THEN** all ingredient amounts are recalculated
- **AND** the display updates with the new values
