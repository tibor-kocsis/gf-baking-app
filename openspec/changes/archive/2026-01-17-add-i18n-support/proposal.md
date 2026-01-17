# Change: Add Internationalization (i18n) Support

## Why
The app currently only supports English, limiting its accessibility to Hungarian-speaking users. Adding i18n support with Hungarian and English languages will broaden the user base and improve the experience for Hungarian users who prefer their native language.

## What Changes
- Add language selection UI on the main catalog screen
- Implement i18n infrastructure with translation files for English and Hungarian
- Default to device locale (Hungarian or English), falling back to English for unsupported locales
- Persist user's language preference using AsyncStorage
- Translate all user-facing strings: UI labels, recipe names, descriptions, ingredient names, and instructions

## Impact
- Affected specs: New `i18n` capability, modifies `recipe-catalog` (adds language selector to home screen)
- Affected code: `App.js` (language context, translations), new translation files
- New dependency: `expo-localization` for device locale detection, `@react-native-async-storage/async-storage` for persistence
