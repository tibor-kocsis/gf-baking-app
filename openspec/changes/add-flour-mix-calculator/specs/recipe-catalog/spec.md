## ADDED Requirements

### Requirement: Flour Mix Calculator Tile
The app SHALL display a Flour Mix tile in the recipe catalog that opens an
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
- **AND** a target style selector offers sandwich, rustic and soft roll
- **AND** the sorghum unimix, psyllium husk and tangzhong can each be switched on or off
- **AND** sorghum, millet and brown rice can each be marked as available
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
- **WHEN** the target style is sandwich, rustic or soft roll
- **THEN** the flour to starch ratio targets 65:35, 70:30 or 60:40 respectively
- **AND** the resulting ratio stays within the 60:40 to 70:30 band
- **AND** the breakdown names the band the result landed in

#### Scenario: Potato starch held below its cap
- **WHEN** potato starch is in the formula alongside another starch
- **THEN** potato is kept at or below 45% of the starch fraction where any solution allows it
- **AND** another starch cap is relaxed in preference to exceeding the potato cap

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
- **THEN** total psyllium targets 3% of the base
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
- **AND** it falls 3% when potato exceeds 40% of the starch fraction
- **AND** it rises 3% when the tangzhong is switched on
- **AND** it rises 5% for each 0.5% of psyllium above 3.0%

#### Scenario: Water split into three streams
- **WHEN** the formula is computed
- **THEN** the water is shown as tangzhong water, psyllium gel and remainder
- **AND** the tangzhong water is 5 times the tangzhong flour weight
- **AND** the psyllium gel is 12 times the total psyllium weight
- **AND** the remainder is the mixing and yeast slurry water
- **WHEN** the remainder falls below 10% of the base
- **THEN** the psyllium gel ratio drops to 1:10 and the split is recomputed

#### Scenario: Additions scaled to the base
- **WHEN** the formula is computed
- **THEN** salt is 2%, sugar or honey is 2%, oil is 4%, fresh yeast is 2.5% and apple cider vinegar is 1% of the base
- **AND** no ingredient the user did not mark as available is introduced

#### Scenario: Gram figures sum to the stated totals
- **WHEN** gram weights are displayed
- **THEN** each is a whole number
- **AND** the lines sum exactly to the stated flour, starch and water totals

### Requirement: Tangzhong From Plain Flour Only
The app SHALL source the tangzhong flour from the plain flour fraction and never from
the sorghum unimix, because boiling the mix's psyllium produces a stiff, non-yielding
gel.

#### Scenario: Tangzhong sourced from brown rice first
- **WHEN** the tangzhong is switched on and brown rice is available
- **THEN** the tangzhong flour is taken from the brown rice
- **AND** the amount is 7% of the base
- **AND** the tangzhong flour is not counted as extra flour on top of the flour fraction

#### Scenario: Tangzhong falls back to plain sorghum
- **WHEN** the tangzhong is switched on and brown rice is not available but plain sorghum is
- **THEN** the tangzhong flour is taken from the plain sorghum

#### Scenario: Tangzhong not possible without plain flour
- **WHEN** the tangzhong is switched on and no brown rice or plain sorghum is available
- **THEN** no tangzhong is produced
- **AND** a note states that the tangzhong needs plain flour and cannot be taken from the mix
