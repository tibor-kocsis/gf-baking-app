## REMOVED Requirements

### Requirement: Dynamic Recipe View (Calculator)
**Reason**: The sandwich bread and baguette recipes are removed; bread and rolls come from the flour mix calculator.
**Migration**: Replaced by "Dynamic Recipe Calculators", which carries every remaining scenario unchanged.

### Requirement: Initial Recipe Set
**Reason**: The sandwich bread and baguette recipes are removed; bread and rolls come from the flour mix calculator.
**Migration**: Replaced by "Recipe Set", which carries every remaining scenario unchanged.

## ADDED Requirements

### Requirement: Dynamic Recipe Calculators
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

#### Scenario: Viewing American pancakes calculator
- **WHEN** the user opens the American pancakes recipe
- **THEN** a pancake-count selector is displayed (default 22, one 6cm pancake ≈ 28g)
- **AND** calculated ingredients are shown based on the selected pancake count
- **AND** the user can increment or decrement the count in steps of 1 pancake
- **AND** preparation instructions are displayed below the ingredients

#### Scenario: Viewing cheese sticks calculator
- **WHEN** the user opens the cheese sticks recipe
- **THEN** a stick-count selector is displayed (default 30, the yield of the base recipe)
- **AND** calculated ingredients are shown based on the selected stick count, grouped as dough and topping
- **AND** gram amounts scale in proportion, and teaspoon and tablespoon amounts scale to the nearest quarter spoon
- **AND** the user can increment or decrement the count in steps of 5 sticks
- **AND** the preparation, resting and baking times and the oven setting are shown above the ingredients
- **AND** preparation instructions are displayed below the ingredients, each with its title and, where the step is timed, its duration
- **AND** the recipe notes are displayed below the instructions

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

### Requirement: Recipe Set
The app SHALL include pizza dough, waffles, American pancakes and cheese sticks as the initial recipes; bread and rolls are made from the flour mix calculator.

#### Scenario: Pizza dough recipe available
- **WHEN** the user views the recipe catalog
- **THEN** "Pizza Dough" is listed as an available recipe

#### Scenario: Waffle recipe available
- **WHEN** the user views the recipe catalog
- **THEN** "Waffles" is listed as an available recipe

#### Scenario: American pancakes recipe available
- **WHEN** the user views the recipe catalog
- **THEN** "American Pancakes" is listed as an available recipe

#### Scenario: Cheese sticks recipe available
- **WHEN** the user views the recipe catalog
- **THEN** "Cheese Sticks" is listed as an available recipe

#### Scenario: Sandwich bread and baguette removed
- **WHEN** the user views the recipe catalog
- **THEN** neither "Sandwich Bread" nor "Baguette" is listed
- **AND** the flour mix calculator is listed as "Bread, rolls" ("Kenyér, zsemle") with a bread icon
