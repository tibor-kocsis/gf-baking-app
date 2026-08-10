# Design: Recipe Notes with Photos

## Overview
This document captures architectural decisions for implementing recipe notes with photo attachments.

## Data Model

### Note Structure
```javascript
{
  id: string,           // UUID
  recipeId: string,     // Reference to recipe (e.g., 'pizza', 'waffles')
  text: string,         // User's note content
  photos: string[],     // Array of local file URIs (max 3)
  createdAt: number,    // Unix timestamp (ms)
  updatedAt: number,    // Unix timestamp (ms)
}
```

### Storage Strategy

**Notes Metadata**: Stored in AsyncStorage as JSON
- Key: `@recipe_notes` 
- Value: `{ [recipeId]: Note[] }`

**Photos**: Stored in device file system
- Location: `${FileSystem.documentDirectory}notes/`
- Naming: `{noteId}_{index}.jpg`
- Photos are copied from camera/gallery to app's document directory for persistence

### Why This Approach
- AsyncStorage is already used for language preference, keeping consistency
- File system storage for photos prevents AsyncStorage size limits
- Document directory persists across app updates (unlike cache)
- Simple key structure allows efficient per-recipe lookups

## Component Architecture

```
src/
├── components/
│   ├── NoteCard.js         # Single note display with photos
│   ├── NotesList.js        # List of notes for a recipe
│   └── PhotoPicker.js      # Camera/gallery picker with preview
├── screens/
│   └── NoteEditorScreen.js # Create/edit note modal or screen
├── utils/
│   └── notesStorage.js     # CRUD operations for notes + photos
└── constants/
    └── storage.js          # Add NOTES_STORAGE_KEY
```

## Photo Handling

### Capture Flow
1. User taps "Add Photo" button
2. expo-image-picker presents action sheet: Camera / Gallery / Cancel
3. On selection, image is returned as temporary URI
4. Image is resized/compressed (max 1024px, 80% quality) to manage storage
5. Image is copied to app's document directory with permanent filename
6. Permanent URI is stored in note's photos array

### Platform Differences
- **iOS/Android**: expo-image-picker handles camera and gallery natively
- **Web**: expo-image-picker uses `<input type="file">` for gallery, webcam via MediaDevices API

### Deletion
- When a note is deleted, associated photo files are also deleted from file system
- When a photo is removed from a note, the file is deleted

## UI Integration

### Recipe Detail View
- Add collapsible "My Notes" section below ingredients/instructions
- Shows note count badge when notes exist
- Expand to see NotesList component
- "Add Note" button opens NoteEditorScreen

### NoteEditorScreen
- Text input for note content
- PhotoPicker showing current photos (up to 3)
- Add photo button (disabled when 3 photos attached)
- Save and Cancel buttons
- Delete option for existing notes

## Permissions

### Required Permissions
- Camera access (for taking photos)
- Photo library access (for selecting existing photos)

### Handling
- expo-image-picker requests permissions automatically
- If denied, show friendly message explaining why permission is needed
- Allow proceeding with text-only notes if photo permissions denied

## Localization

### New Translation Keys
```javascript
notes: {
  title: 'My Notes',
  addNote: 'Add Note',
  editNote: 'Edit Note',
  deleteNote: 'Delete Note',
  noteDeleted: 'Note deleted',
  noNotes: 'No notes yet. Add your first baking note!',
  notePlaceholder: 'What did you try? How did it turn out?',
  addPhoto: 'Add Photo',
  photoLimitReached: 'Maximum 3 photos per note',
  camera: 'Take Photo',
  gallery: 'Choose from Library',
  cancel: 'Cancel',
  save: 'Save',
  confirmDelete: 'Delete this note?',
  permissionDenied: 'Camera access needed to take photos',
}
```

## Trade-offs Considered

### Local State vs Context
**Decision**: Use local state in NotesList, pass callbacks up
- Notes are recipe-specific, not needed globally
- Avoids adding another context provider
- Storage utils handle persistence directly

### Image Compression
**Decision**: Compress to max 1024px, 80% quality
- Balances visual quality with storage space
- A 1024px image at 80% quality is ~100-200KB
- 3 photos per note = ~300-600KB per note maximum

### Separate Notes Screen vs Inline
**Decision**: Inline section in recipe detail + modal for editing
- Keeps notes visible in recipe context
- Modal provides focused editing experience
- No new navigation route needed (modal overlay)
