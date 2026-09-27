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

#### Scenario: Viewing baguette calculator
- **WHEN** the user opens the baguette recipe
- **THEN** a total ready dough weight selector is displayed (default 800g)
- **AND** calculated ingredients are shown based on selected dough weight
- **AND** the user can adjust dough weight in 50g increments
- **AND** flour amounts round to the nearest 5g while other ingredients round to the nearest 1g
- **AND** preparation instructions are displayed below the ingredients, including the tangzhong step with its gram amounts drawn from (not added to) the totals above

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
