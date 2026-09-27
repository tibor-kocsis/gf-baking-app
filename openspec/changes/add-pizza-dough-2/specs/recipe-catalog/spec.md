## ADDED Requirements

### Requirement: Pizza Dough 2 Recipe
The app SHALL offer a second pizza dough, alongside the original, built without the
universal gluten-free mix for a thin base with an airy rim.

#### Scenario: Viewing pizza dough 2
- **WHEN** the user opens the Pizza dough 2 recipe
- **THEN** a pizza-count selector is displayed, defaulting to 1 pizza
- **AND** each pizza is a 290 g dough ball, inside the baker's 280-300 g range
- **AND** the ingredients are sorghum unimix, potato starch, brown rice flour, psyllium husk, water, oil, honey, salt and yeast
- **AND** the water is shown split into tangzhong water, psyllium gel water and yeast water
- **AND** instructions including par-baking and notes on adjusting the water are shown

#### Scenario: Blend proportions
- **WHEN** the ingredients are calculated
- **THEN** the flour to starch split is about 40:60 of the flour plus starch base
- **AND** total psyllium, the unimix's own included, is 4.5% of the base
- **AND** all of the brown rice flour goes into the tangzhong at 1 part to 5 parts water
- **AND** the brown rice line is labelled as tangzhong flour, and the tangzhong step quotes the scaled grams of brown rice and water for the chosen number of pizzas, in the recipe view and in cooking mode

#### Scenario: Tangzhong switched off
- **WHEN** the user switches the tangzhong off, which is on by default
- **THEN** the blend is unchanged and the brown rice flour goes into the dough raw
- **AND** the hydration drops from 90% to 87%, as the flour mix calculator drops 3 points without a tangzhong
- **AND** the tangzhong water and the tangzhong step are left out of the ingredients, instructions and cooking mode

#### Scenario: Original pizza unchanged
- **WHEN** the catalog is displayed
- **THEN** the original pizza dough recipe is still listed and calculates as before
