## REMOVED Requirements

### Requirement: Recipe Cooking Steps Data
**Reason**: The sandwich bread recipe and its cooking steps are removed.
**Migration**: Replaced by "Recipe Cooking Steps", which carries every remaining scenario unchanged.

## ADDED Requirements

### Requirement: Recipe Cooking Steps
The system SHALL define step-ingredient mappings for each recipe that has instructions.

#### Scenario: Waffle cooking steps
- **WHEN** waffle recipe is loaded
- **THEN** the recipe includes cooking step definitions that map each instruction to its relevant ingredients
