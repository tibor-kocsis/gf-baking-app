# Add German Language Support

## Status
Completed

## Context
The app currently supports English (EN) and Hungarian (HU) languages with a complete internationalization (i18n) infrastructure in place. Users can switch between these languages using a language selector on the recipe catalog screen, and their preference is persisted across sessions.

The i18n system includes:
- Translation files in `mobileapp/locales/` (en.js, hu.js)
- I18nContext provider with `useI18n` hook for accessing translations
- LanguageSelector component with language toggle buttons
- Device locale detection with fallback to English
- AsyncStorage persistence of user language preference

## Motivation
Adding German language support will expand the app's accessibility to German-speaking users, a significant demographic in the gluten-free community. German is widely spoken in Central Europe (Germany, Austria, Switzerland) and is one of the most commonly spoken languages in the EU.

The existing i18n infrastructure makes this addition straightforward - we only need to:
1. Create German translations for all existing content
2. Add German to the language selector UI
3. Update language detection to support German
4. Update specs to reflect German as a supported language

## Proposed Changes

### i18n Specification Updates
- **MODIFIED**: Extend "Supported Languages" requirement to include German (DE) alongside English and Hungarian
- **MODIFIED**: Add scenarios for German language support in language selection, detection, and content display
- **MODIFIED**: Refactor language selector from button group to bottom sheet pattern for better scalability
- **MODIFIED**: Add German device locale detection scenario

## Scope
This change affects only the i18n capability:
- One new translation file: `mobileapp/locales/de.js`
- Refactor `LanguageSelector` component from button group to bottom sheet pattern
- Updates to `I18nContext.js` to register German translations
- Spec updates to `openspec/specs/i18n/spec.md`

No changes to recipes, UI design, cooking mode, or app architecture.

## Risks and Considerations
- **Translation Quality**: German translations must be accurate and natural, especially for cooking terminology. Recipe instructions and ingredient names require careful translation to ensure clarity.
- **UI Refactor**: The LanguageSelector will be refactored from a button group to a bottom sheet pattern. This is a larger change but provides better scalability for future languages and follows familiar mobile UX patterns.
- **Locale Code**: German uses 'de' as the locale code (ISO 639-1), consistent with device locale detection.

## Dependencies
None. This change builds on the existing i18n system and does not depend on or block other changes.

## Out of Scope
- Additional languages beyond German
- Right-to-left (RTL) language support
- Pluralization rules or complex language-specific formatting
- Professional translation services (user/developer will provide translations)
