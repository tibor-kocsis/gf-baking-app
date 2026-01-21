# recipe-notes Specification

## Purpose
Enables users to create personal notes attached to recipes, documenting baking experiments, variations, and results with optional photo attachments.

## ADDED Requirements

### Requirement: Note Creation
The app SHALL allow users to create text notes attached to any recipe.

#### Scenario: Creating a new note
- **WHEN** the user taps "Add Note" on a recipe detail view
- **THEN** a note editor opens with an empty text field
- **AND** the user can enter text describing their baking experience
- **AND** the note is saved with automatic timestamp when confirmed

#### Scenario: Note with photos
- **WHEN** the user is creating or editing a note
- **THEN** they can attach up to 3 photos to the note
- **AND** the photos are stored locally on the device

#### Scenario: Photo limit enforcement
- **WHEN** a note already has 3 photos attached
- **THEN** the "Add Photo" option is disabled
- **AND** a message indicates the maximum has been reached

### Requirement: Photo Capture
The app SHALL allow users to capture photos via camera or select from gallery.

#### Scenario: Taking a photo with camera
- **WHEN** the user taps "Add Photo" and selects camera
- **THEN** the device camera opens
- **AND** the captured photo is attached to the note

#### Scenario: Selecting from gallery
- **WHEN** the user taps "Add Photo" and selects gallery
- **THEN** the device photo library opens
- **AND** the selected photo is attached to the note

#### Scenario: Web camera access
- **WHEN** the user is on web platform and taps "Add Photo"
- **THEN** the webcam is used for photo capture
- **OR** a file picker allows selecting an image file

#### Scenario: Permission denied
- **WHEN** the user denies camera or gallery permission
- **THEN** a friendly message explains why permission is needed
- **AND** the user can still save notes without photos

### Requirement: Note Display
The app SHALL display notes in the recipe detail view.

#### Scenario: Viewing notes list
- **WHEN** a recipe has one or more notes
- **THEN** a "My Notes" section appears in the recipe detail view
- **AND** notes are displayed in reverse chronological order (newest first)
- **AND** each note shows text preview, photo thumbnails, and date

#### Scenario: No notes exist
- **WHEN** a recipe has no notes
- **THEN** the "My Notes" section shows an empty state message
- **AND** an "Add Note" button is prominently displayed

#### Scenario: Viewing note photos
- **WHEN** a note has attached photos
- **THEN** photo thumbnails are displayed on the note card
- **AND** tapping a thumbnail opens a larger preview

### Requirement: Note Editing
The app SHALL allow users to edit existing notes.

#### Scenario: Editing note text
- **WHEN** the user taps on an existing note
- **THEN** the note editor opens with current content
- **AND** the user can modify the text
- **AND** the updated timestamp is recorded on save

#### Scenario: Adding photo to existing note
- **WHEN** the user edits a note with fewer than 3 photos
- **THEN** they can add additional photos up to the limit

#### Scenario: Removing photo from note
- **WHEN** the user is editing a note with photos
- **THEN** they can remove individual photos
- **AND** removed photos are deleted from device storage

### Requirement: Note Deletion
The app SHALL allow users to delete notes.

#### Scenario: Deleting a note
- **WHEN** the user chooses to delete a note
- **THEN** a confirmation prompt is shown
- **AND** upon confirmation, the note and all attached photos are deleted

#### Scenario: Deletion is permanent
- **WHEN** a note is deleted
- **THEN** it cannot be recovered
- **AND** associated photo files are removed from device storage

### Requirement: Note Persistence
The app SHALL persist notes locally on the device.

#### Scenario: Notes survive app restart
- **WHEN** the user creates notes and restarts the app
- **THEN** all notes and photos are preserved

#### Scenario: Notes are recipe-specific
- **WHEN** the user creates a note on the Pizza Dough recipe
- **THEN** the note only appears in the Pizza Dough detail view
- **AND** does not appear in other recipe views

### Requirement: Note Timestamp
The app SHALL automatically timestamp notes.

#### Scenario: Creation timestamp
- **WHEN** a note is created
- **THEN** the current date and time are recorded
- **AND** displayed on the note card

#### Scenario: Update timestamp
- **WHEN** a note is edited
- **THEN** the updated date and time are recorded
- **AND** the display indicates the note was modified
