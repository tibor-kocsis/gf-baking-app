# Add Recipe Notes with Photos

## Status
Completed

## Why
Users who bake recipe variants want to log their experiments—what they changed, how it turned out, and visual results. Currently, there's no way to capture this within the app. Users must rely on external tools (notes apps, photo albums) which disconnects the log from the recipe context.

Adding per-recipe notes with photo attachments enables users to:
- Document variations (e.g., "tried with 10% more water")
- Record outcomes and learnings
- Visually track results with up to 3 photos per note
- Build a personal baking journal tied to each recipe

## What Changes

### New Capability: recipe-notes
A new specification for managing user-created notes attached to recipes:
- Notes contain text and optional photos (up to 3 per note)
- Notes are timestamped automatically on creation
- Notes are stored locally on the device using AsyncStorage + file system
- Photos can be captured via camera or selected from gallery
- Web platform uses webcam for photo capture
- Full CRUD operations: create, read, update, delete

### Modified Capability: recipe-catalog
- Recipe detail views (DynamicRecipeView) display a "Notes" section
- Users can view existing notes and add new ones from the detail view

### Modified Capability: app-architecture
- New storage keys for notes data
- New utility functions for note management
- New context provider for notes state (optional, may use local state)

## Scope
This change introduces:
- New `recipe-notes` capability specification
- New screen/component for note creation/editing
- New components: NoteCard, NotesList, PhotoPicker
- New storage utilities for notes and photos
- Integration with expo-image-picker and expo-file-system packages
- Updates to DynamicRecipeView to show notes section

## Risks and Considerations
- **Storage Size**: Photos stored locally can consume device storage. Consider image compression and resolution limits.
- **Cross-Platform**: Web camera access requires different handling than mobile. expo-image-picker handles this but may have limitations.
- **Data Migration**: No existing notes data, so no migration needed for initial release.
- **Permissions**: Camera and photo library access require user permission prompts.

## Dependencies
New Expo packages required:
- `expo-image-picker` - for camera/gallery access
- `expo-file-system` - for local photo storage

## Out of Scope
- Cloud sync or backup of notes
- Sharing notes with other users
- Structured ingredient modification tracking (just free-text)
- Note search or filtering
- Export/import of notes
