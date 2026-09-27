## ADDED Requirements

### Requirement: Step Titles and Durations
The cooking mode SHALL show a step's title and duration when the recipe provides them.

#### Scenario: Step with a title
- **WHEN** a recipe provides step titles
- **THEN** each step header shows the step number followed by its title

#### Scenario: Timed step
- **WHEN** a recipe step carries a duration
- **THEN** the duration is shown below the instruction text in whole minutes
- **AND** no countdown timer is started

#### Scenario: Recipe-specific ingredient names and spoon units
- **WHEN** a recipe provides its own ingredient names or spoon units
- **THEN** the step ingredients use those names and units instead of the shared ingredient list
