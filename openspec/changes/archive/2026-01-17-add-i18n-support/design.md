## Context
The Gluten Free Baking app needs to support multiple languages to serve both English and Hungarian users. The language selector should be easily accessible on the main screen, and the user's preference should persist across sessions.

## Goals / Non-Goals
- Goals:
  - Support English and Hungarian languages
  - Provide language selector on main (catalog) screen
  - Default to device language when supported, otherwise English
  - Persist user's language selection
  - Translate all user-facing content including recipe data

- Non-Goals:
  - Support for additional languages (can be added later)
  - Dynamic/runtime language file loading from server
  - RTL language support

## Decisions

### Decision: Use expo-localization for device locale detection
- Built into Expo ecosystem, minimal additional dependencies
- Provides reliable device locale information
- Alternatives considered: react-native-localize (requires native linking in some cases)

### Decision: Use AsyncStorage for persistence
- Already compatible with Expo managed workflow
- Simple key-value storage sufficient for language preference
- Alternatives considered: expo-secure-store (overkill for non-sensitive preference)

### Decision: Inline translation approach (no i18n library)
- Simple object-based translations are sufficient for 2 languages
- Reduces bundle size and complexity
- Alternatives considered: i18next, react-i18next (adds significant overhead for simple use case)

### Decision: Language selector at bottom of catalog screen
- Visible and accessible without navigation
- Minimal UI footprint using flag/abbreviation buttons centered at bottom
- Alternatives considered: Settings screen (requires extra navigation), header position (clutters top area)

## Translation Structure
```javascript
// locales/en.js
export default {
  app: {
    title: 'Gluten Free Baking',
    subtitle: 'Delicious recipes for everyone',
  },
  common: {
    recipes: 'Recipes',
    ingredients: 'Ingredients',
    instructions: 'Instructions',
    calculator: 'Calculator',
    recipe: 'Recipe',
  },
  recipes: {
    pizza: {
      name: 'Pizza Dough',
      description: 'Gluten-free pizza dough calculator',
      // ... ingredient names, etc.
    },
    // ...
  },
};
```

## Risks / Trade-offs
- Inline translations increase App.js complexity → Mitigate by extracting to separate files
- Manual string extraction is error-prone → Mitigate by systematic review during implementation
- Recipe data duplication → Accept for simplicity; consider refactoring if recipe count grows

## Open Questions
- None; requirements are clear
