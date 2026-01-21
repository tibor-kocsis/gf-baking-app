# recipe-catalog Specification Updates

## MODIFIED Requirements

### Requirement: Dynamic Recipe View (Calculator)
The app SHALL display dynamic recipes with an interactive calculator interface and access to user notes.

#### Scenario: Notes section in recipe detail
- **WHEN** the user views a recipe detail (DynamicRecipeView)
- **THEN** a "My Notes" section is displayed below the ingredients/instructions
- **AND** the section shows existing notes or an empty state prompt
- **AND** an "Add Note" button allows creating new notes

#### Scenario: Notes count indicator
- **WHEN** a recipe has one or more notes
- **THEN** the notes section header displays the note count
- **AND** provides quick visual indication of existing notes
