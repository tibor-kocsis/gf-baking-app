## ADDED Requirements

### Requirement: Flour Mix Calculator Tile
The app SHALL display a Flour Mix tile, labelled "Bread, rolls" ("Kenyér, zsemle"), in the recipe catalog that opens an
ingredient-driven blend calculator, distinct from the single-selector dynamic recipe
view.

#### Scenario: Opening the flour mix calculator
- **WHEN** the user taps the Flour Mix tile in the catalog
- **THEN** the flour mix calculator screen is displayed
- **AND** a back button returns to the catalog
- **AND** the Android hardware back button also returns to the catalog

#### Scenario: Selecting available ingredients
- **WHEN** the user opens the flour mix calculator
- **THEN** a batch size selector is displayed, defaulting to 500 g of flour plus starch
- **AND** a target style selector offers sandwich, rustic, soft roll and hot dog bun (the enriched style)
- **AND** the sorghum unimix, psyllium husk and tangzhong can each be switched on or off
- **AND** sorghum, millet, brown rice and chickpea can each be marked as available
- **AND** potato, tapioca and corn starch can each be marked as available

#### Scenario: Recalculating on any input change
- **WHEN** the user changes the batch size, the style or any available ingredient
- **THEN** the formula is recalculated
- **AND** the percentage table, hydration streams and breakdown update

#### Scenario: No flour source selected
- **WHEN** no flour is marked as available and the unimix is switched off
- **THEN** the calculator does not produce a formula
- **AND** a message states that at least one flour source is required

### Requirement: Flour Mix Formula Engine
The app SHALL compute the blend in baker's percentages of the flour plus starch base
and in grams, balancing the flour-to-starch ratio, the per-ingredient caps, the
psyllium dose and the hydration.

#### Scenario: Unimix decomposed into its parts
- **WHEN** the sorghum unimix is part of the formula
- **THEN** every gram of it is counted as 48% sorghum flour, 47% tapioca starch and 5% psyllium husk
- **AND** only 95% of its weight counts toward the flour plus starch base
- **AND** the unimix is shown as a single weighed line in the percentage table
- **AND** the breakdown shows its sorghum inside the flour fraction and its tapioca inside the starch fraction

#### Scenario: Flour to starch ratio follows the target style
- **WHEN** the target style is sandwich, rustic, soft roll or enriched bun
- **THEN** the flour to starch ratio targets 65:35, 70:30, 60:40 or 60:40 respectively
- **AND** the resulting ratio stays within the 60:40 to 70:30 band
- **AND** the breakdown names the band the result landed in

#### Scenario: Potato starch held below its cap
- **WHEN** potato starch is in the formula alongside another starch
- **THEN** potato is kept at or below 45% of the starch fraction where any solution allows it
- **AND** another starch cap is relaxed in preference to exceeding the potato cap

#### Scenario: Chickpea flour stays in the background
- **WHEN** chickpea flour is in the formula alongside another flour
- **THEN** chickpea is kept at or below 15% of the flour fraction
- **WHEN** chickpea is the only flour on hand and has to fill the fraction alone
- **THEN** its share over the cap is still reported, unlike the other flours, whose caps
  are only checked once a fraction has two or more sources
- **AND** whenever chickpea is in the formula a note tells the baker to roast it first

#### Scenario: Single starch overrides
- **WHEN** potato is the only starch in the formula
- **THEN** the total starch drops to 30% and the flour rises to 70%
- **WHEN** tapioca is the only starch in the formula
- **THEN** the style ratio is kept and a gumminess warning is shown
- **WHEN** corn is the only starch in the formula
- **THEN** the style ratio is kept with no adjustment

#### Scenario: Corn takes the largest starch share
- **WHEN** corn starch is available
- **THEN** corn is given the largest single share of the starch fraction

#### Scenario: Relaxed caps reported
- **WHEN** no solution keeps every cap inside its limit
- **THEN** the formula names each cap that was exceeded and by how much
- **AND** no cap is exceeded without being reported

#### Scenario: Psyllium dosed to target
- **WHEN** the formula is computed
- **THEN** total psyllium targets 4.5% of the base, or 4% for the enriched bun, dosed as whole husk rather than powder
- **AND** the unimix contribution is subtracted before any psyllium is added
- **AND** the breakdown splits total psyllium into the part from the mix and the part added
- **WHEN** psyllium husk is not available and the mix falls short of the band
- **THEN** a warning states that the structure will be weak
- **AND** the hydration is reduced by 5%

#### Scenario: Hydration adjusted for the blend
- **WHEN** the formula is computed
- **THEN** hydration starts at 85% of the base
- **AND** it rises 3% when brown rice exceeds 40% of the flour fraction
- **AND** it falls 2% when millet exceeds 25% of the flour fraction
- **AND** it rises 2% when chickpea exceeds 10% of the flour fraction
- **AND** it falls 3% when potato exceeds 40% of the starch fraction
- **AND** it rises 3% when the tangzhong is switched on
- **AND** it rises 5% for each 0.5% of psyllium above 4.5%

#### Scenario: Water split into three streams
- **WHEN** the formula is computed
- **THEN** the water is shown as tangzhong water, psyllium gel and remainder
- **AND** the tangzhong water is 5 times the tangzhong flour weight
- **AND** the psyllium gel is 10 times the psyllium weighed out separately, excluding the
  unimix's own psyllium, which is already dispersed through its flour and starch and so
  hydrates from the mixing water instead
- **AND** the remainder is the mixing and yeast slurry water
- **WHEN** the remainder falls below 10% of the base
- **THEN** the psyllium gel ratio drops to 1:8 and the split is recomputed

#### Scenario: Additions scaled to the base
- **WHEN** the formula is computed for any style but the enriched bun
- **THEN** salt is 2%, sugar or honey is 2%, oil is 4%, fresh yeast is 2.5% and apple cider vinegar is 1% of the base
- **AND** no ingredient the user did not mark as available is introduced

#### Scenario: Gram figures sum to the stated totals
- **WHEN** gram weights are displayed
- **THEN** each is a whole number
- **AND** the lines sum exactly to the stated flour, starch and water totals

### Requirement: Enriched Bun Style
The app SHALL offer an enriched bun style for hot dog and hamburger buns that keeps the
blend solver unchanged and adds whole egg, milk, more sugar and more oil, counting the
water the egg and milk carry toward the same hydration.

#### Scenario: Enriched additions
- **WHEN** the target style is enriched bun
- **THEN** whole egg is 25% of the base, given as a count of large eggs of about 50 g out of the shell, rounded to the nearest whole egg and at least one
- **AND** the milk absorbs the water the rounding moves, so the hydration is unchanged
- **AND** salt is 1.8%, sugar is 6%, oil is 9%, fresh yeast is 3% and apple cider vinegar is 1% of the base
- **AND** honey is replaced by sugar and no butter is used

#### Scenario: Egg and milk counted as water
- **WHEN** the target style is enriched bun
- **THEN** the hydration rules are the same as for the other styles, the psyllium bump still keyed to 4.5%
- **AND** egg counts as 75% water and milk as 88% water toward the hydration
- **AND** the tangzhong is cooked in milk at 1 part source to 5 parts milk
- **AND** the psyllium gel stays water
- **AND** the mixing liquid is milk, sized so the water-equivalent streams sum to the stated total
- **AND** the water card shows the egg as its own stream and explains the water-equivalent total

#### Scenario: Shaping and baking guidance
- **WHEN** the enriched bun style is selected
- **THEN** a hint gives the piece weights, the need for a pan or rings, the egg wash and a 180-190 °C bake to 96-98 °C inside
- **AND** the egg line states the eggs' total weight out of the shell

### Requirement: Flour Mix Cooking Mode and Notes
The flour mix screen SHALL offer the same "start cooking" and personal notes as the
recipes, with cooking steps built from the solved formula.

#### Scenario: Starting cooking mode from the flour mix
- **WHEN** a formula is shown and the user taps the start cooking button
- **THEN** cooking mode opens with steps built from that formula
- **AND** a tangzhong step appears only when the formula has a tangzhong, listing its source grams and its water or milk
- **AND** a psyllium gel step appears only when husk is weighed out separately
- **AND** the mixing step lists each flour and starch less what the tangzhong took, so the steps add up to the formula
- **AND** the hot dog bun style uses milk, lists the eggs as a count and ends with an egg wash
- **AND** the method follows the baker's own: rest 15 minutes, fold, shape and score by style, proof to 120-150%, bake to 96-98 °C inside, cool before slicing

#### Scenario: Returning from cooking mode
- **WHEN** the user goes back from cooking mode to the flour mix
- **THEN** the batch size, style and cupboard selections are as they were

#### Scenario: Notes on the flour mix
- **WHEN** the user opens the flour mix screen
- **THEN** the "My notes" section is shown below the formula, as on the recipes

### Requirement: Tangzhong Drawn From Flour First
The app SHALL source the tangzhong from a plain flour where the cupboard holds one,
following the published practice, and SHALL fall back through the sorghum unimix to the
plain starches rather than refusing to build one.

#### Scenario: Tangzhong sourced in preference order
- **WHEN** the tangzhong is switched on
- **THEN** the source is taken in the order brown rice, sorghum, millet, the unimix,
  tapioca, corn, potato, using the first the cupboard holds
- **AND** the tangzhong is not counted as extra on top of the flour and starch fractions
- **AND** the ratio is 1 part source to 5 parts water whichever source is used

#### Scenario: Tangzhong share is the baker's to set
- **WHEN** the tangzhong is switched on
- **THEN** its share of the base can be set anywhere from 3% to 7%
- **AND** the share defaults to 5%
- **AND** a share outside that range is clamped to it

#### Scenario: Tangzhong scaled down or dropped
- **WHEN** the chosen source holds less than the requested share
- **THEN** the tangzhong draws the remainder from the next source in the order
- **WHEN** chickpea flour is the only thing in the cupboard
- **THEN** no tangzhong is produced, because chickpea is not a tangzhong ingredient
- **AND** a note says so
