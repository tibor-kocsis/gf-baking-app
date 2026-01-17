## 1. Setup i18n Infrastructure
- [x] 1.1 Install dependencies: `expo-localization`, `@react-native-async-storage/async-storage`
- [x] 1.2 Create translation files structure (`locales/en.js`, `locales/hu.js`)
- [x] 1.3 Create i18n context provider with language state management
- [x] 1.4 Implement locale detection using `expo-localization`
- [x] 1.5 Implement language persistence with AsyncStorage

## 2. Create Translation Content
- [x] 2.1 Extract all English strings from App.js into `locales/en.js`
- [x] 2.2 Create Hungarian translations in `locales/hu.js`
- [x] 2.3 Translate recipe data (names, descriptions, ingredients, instructions)

## 3. Implement Language Selector UI
- [x] 3.1 Add language selector component to RecipeCatalog header
- [x] 3.2 Style language selector to match earthy/natural theme
- [x] 3.3 Add flag icons or language abbreviations (EN/HU) for visual identification

## 4. Integrate Translations
- [x] 4.1 Wrap App component with i18n provider
- [x] 4.2 Replace hardcoded strings with translation lookups
- [x] 4.3 Update recipe data to use translated content

## 5. Testing & Validation
- [x] 5.1 Test language switching functionality
- [x] 5.2 Verify persistence across app restarts
- [x] 5.3 Test device locale detection fallback behavior
- [x] 5.4 Verify all screens display correct translations
