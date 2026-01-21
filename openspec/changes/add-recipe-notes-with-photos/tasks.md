# Implementation Tasks

## Task List

- [x] 1. **Install required Expo packages**
   - Install `expo-image-picker` for camera/gallery access
   - Install `expo-file-system` for local photo storage
   - **Validation**: Packages appear in package.json and import without errors
   - **Dependencies**: None
   - **Estimated effort**: Small

- [x] 2. **Add notes storage utility**
   - Create `src/utils/notesStorage.js` with CRUD functions:
     - `getNotes(recipeId)` - retrieve notes for a recipe
     - `saveNote(note)` - create or update a note
     - `deleteNote(noteId, recipeId)` - delete note and its photos
   - Add `NOTES_STORAGE_KEY` to `src/constants/storage.js`
   - Implement photo file management (save, delete)
   - **Validation**: Unit tests for storage functions
   - **Dependencies**: Task 1
   - **Estimated effort**: Medium

- [x] 3. **Add notes translation keys**
   - Add `notes` section to `locales/en.js`, `locales/hu.js`, `locales/de.js`
   - Include all UI strings: titles, buttons, placeholders, messages
   - **Validation**: All keys accessible via `t('notes.xxx')`
   - **Dependencies**: None (can parallel with Task 2)
   - **Estimated effort**: Small

- [x] 4. **Create PhotoPicker component**
   - Create `src/components/PhotoPicker.js`
   - Display current photos as thumbnails with remove button
   - "Add Photo" button triggers expo-image-picker
   - Handle camera/gallery selection, permission prompts
   - Compress images before saving (max 1024px, 80% quality)
   - **Validation**: Can capture photo via camera, select from gallery, remove photos
   - **Dependencies**: Task 1
   - **Estimated effort**: Medium

- [x] 5. **Create NoteCard component**
   - Create `src/components/NoteCard.js`
   - Display note text (truncated preview), photo thumbnails, date
   - Tap to edit, long-press or button to delete
   - **Validation**: Visual inspection with mock data
   - **Dependencies**: None
   - **Estimated effort**: Small

- [x] 6. **Create NotesList component**
   - Create `src/components/NotesList.js`
   - Fetch and display notes for given recipeId
   - Empty state with prompt to add first note
   - Reverse chronological order
   - **Validation**: Displays notes, shows empty state when none
   - **Dependencies**: Tasks 2, 5
   - **Estimated effort**: Small

- [x] 7. **Create NoteEditor modal**
   - Create `src/components/NoteEditor.js` (modal component)
   - Text input for note content
   - Integrate PhotoPicker component
   - Save and Cancel buttons
   - Delete option for existing notes with confirmation
   - **Validation**: Can create, edit, delete notes with photos
   - **Dependencies**: Tasks 2, 3, 4
   - **Estimated effort**: Medium

- [x] 8. **Integrate notes section into DynamicRecipeView**
   - Add "My Notes" collapsible section below instructions
   - Include NotesList component
   - "Add Note" button opens NoteEditor modal
   - Pass recipeId to notes components
   - **Validation**: Notes visible in recipe detail, full CRUD flow works
   - **Dependencies**: Tasks 6, 7
   - **Estimated effort**: Medium

- [x] 9. **Add photo preview modal**
   - Create `src/components/PhotoPreview.js`
   - Full-screen image view when thumbnail is tapped
   - Swipe or button to dismiss
   - **Validation**: Tapping thumbnail opens full preview
   - **Dependencies**: Task 5
   - **Estimated effort**: Small

- [x] 10. **Test cross-platform functionality**
    - Test on iOS simulator/device
    - Test on Android simulator/device
    - Test on Web (webcam, file picker)
    - Verify permissions handling on each platform
    - **Validation**: Full flow works on all three platforms
    - **Dependencies**: Tasks 1-9
    - **Estimated effort**: Medium

- [x] 11. **Update specifications**
    - Apply spec deltas to create `openspec/specs/recipe-notes/spec.md`
    - Update `openspec/specs/recipe-catalog/spec.md` with notes integration
    - **Validation**: `openspec validate` passes
    - **Dependencies**: Tasks 1-10 (should match implementation)
    - **Estimated effort**: Small

## Notes
- Tasks 1-3 can be done in parallel (foundation work)
- Tasks 4-5 can be done in parallel (independent components)
- Tasks 6-7 depend on earlier components
- Task 8 brings everything together
- Task 9 is a polish item, can be deferred if needed
- Task 10 is comprehensive testing before finalizing
