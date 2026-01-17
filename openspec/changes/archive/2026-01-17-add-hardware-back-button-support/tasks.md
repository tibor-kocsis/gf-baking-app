# Implementation Tasks

## 1. Add BackHandler Support
- [x] 1.1 Import `BackHandler` from `react-native` in `AppNavigator.js`
- [x] 1.2 Add `useEffect` hook to register BackHandler listener
- [x] 1.3 In the handler, check if on recipe screen - if yes, navigate to catalog and return `true` (handled)
- [x] 1.4 If on catalog, return `false` to allow default behavior (exit app)
- [x] 1.5 Clean up listener on unmount

## 2. Verification
- [x] 2.1 Verify app builds without errors
- [x] 2.2 Test on Android: pressing back on recipe page navigates to catalog
- [x] 2.3 Test on Android: pressing back on catalog exits/backgrounds app
- [x] 2.4 Verify iOS and web are unaffected

## Dependencies
- Task 2 depends on task 1
