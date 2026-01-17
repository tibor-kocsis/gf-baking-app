# Change: Add Hardware Back Button Support

## Why

On Android devices, pressing the hardware/system back button while viewing a recipe detail page causes the app to go to the background instead of navigating back to the recipe catalog. This is a poor user experience - users expect the back button to navigate within the app before exiting.

## What Changes

### Navigation Behavior
- When viewing a recipe detail page and pressing the hardware back button, navigate back to the recipe catalog
- When already on the recipe catalog (home screen), allow the default behavior (exit/background app)

### Implementation
- Use React Native's `BackHandler` API to intercept hardware back button presses
- Handle back navigation in `AppNavigator.js` based on current screen state

## Impact

- **Affected specs**: recipe-catalog (MODIFIED)
- **Affected code**:
  - `src/navigation/AppNavigator.js` - Add BackHandler listener

### Platform Notes
- This primarily affects Android devices which have a hardware/gesture back button
- iOS uses swipe gestures which are not affected by this change
- Web browsers handle back button through browser history (not affected)
