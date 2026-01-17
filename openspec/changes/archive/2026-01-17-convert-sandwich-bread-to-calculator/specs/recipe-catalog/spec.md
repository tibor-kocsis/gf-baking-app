## MODIFIED Requirements

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

### Requirement: Initial Recipe Set
The app SHALL include pizza dough, sandwich bread, and waffles as the initial recipes.

#### Scenario: Pizza dough recipe available
- **WHEN** the user views the recipe catalog
- **THEN** "Pizza Dough" is listed as an available recipe
- **AND** it is marked as a calculator/dynamic recipe

#### Scenario: Sandwich bread recipe available
- **WHEN** the user views the recipe catalog
- **THEN** "Sandwich Bread" is listed as an available recipe
- **AND** it is marked as a calculator/dynamic recipe

#### Scenario: Waffle recipe available
- **WHEN** the user views the recipe catalog
- **THEN** "Waffles" is listed as an available recipe
- **AND** it is marked as a calculator/dynamic recipe

## REMOVED Requirements

### Requirement: Static Recipe View
**Reason**: All recipes are now dynamic calculators. The static recipe view is no longer needed as sandwich bread has been converted to a calculator.
**Migration**: Sandwich bread now uses the dynamic recipe view with flour-based scaling.
