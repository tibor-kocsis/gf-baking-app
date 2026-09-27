## ADDED Requirements

### Requirement: Pizza Dough 3 Recipe
The app SHALL offer a third pizza dough on the principle of Caputo's gluten-free flour:
starch-led, with a heavy psyllium binder, stretched and baked in one go.

#### Scenario: Viewing pizza dough 3
- **WHEN** the user opens the Pizza dough 3 recipe
- **THEN** a pizza-count selector is displayed, defaulting to 1 pizza
- **AND** each pizza is a 280 g dough ball
- **AND** the ingredients are buckwheat flour, sorghum flour, corn, potato and tapioca starch, psyllium husk, water, olive oil, honey, salt and fresh yeast, with no flour mixes
- **AND** the water is shown split into psyllium gel water and yeast water

#### Scenario: Blend proportions
- **WHEN** the ingredients are calculated
- **THEN** the flour to starch split is 20:80 of the flour plus starch base
- **AND** corn is the largest starch, at 50% of the starch fraction
- **AND** psyllium husk is 6% of the base and hydration is 80%

#### Scenario: Stretch and bake in one go
- **WHEN** the instructions are displayed
- **THEN** the steps quote the scaled grams, proof the balls warm for a same-day bake, stretch them on rice flour and bake them topped in one go
- **AND** the notes say how to adjust the psyllium and when to par-bake
