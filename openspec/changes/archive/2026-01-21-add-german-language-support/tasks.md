# Implementation Tasks

## Task List

- [x] 1. **Create German translation file**
   - Create `mobileapp/locales/de.js` with complete German translations
   - Translate all keys from `en.js`: app title/subtitle, common terms, recipe names/descriptions, ingredient names, and instructions
   - Ensure cooking terminology is accurate and natural in German
   - **Validation**: Run app and verify all text displays correctly when German is selected
   - **Dependencies**: None
   - **Estimated effort**: Medium (requires careful translation work)

- [x] 2. **Register German translations in I18nContext**
   - Import `de.js` in `src/context/I18nContext.js`
   - Add `de` to the `translations` object
   - **Validation**: Check that `translations.de` is accessible and context provides German strings
   - **Dependencies**: Task 1 (requires de.js to exist)
   - **Estimated effort**: Small

- [x] 3. **Refactor LanguageSelector to bottom sheet pattern**
   - Update `src/components/LanguageSelector.js` to use a button + bottom sheet modal
   - Display current language name on the trigger button (e.g., "Deutsch")
   - Show all languages in the bottom sheet with native names (English, Magyar, Deutsch)
   - Highlight the currently selected language in the list
   - Close bottom sheet after selection
   - **Validation**: Visual inspection - verify button shows current language, bottom sheet opens with all options, selection works correctly
   - **Dependencies**: Task 2 (requires translations to be registered)
   - **Estimated effort**: Medium (refactor from buttons to modal pattern)

- [x] 4. **Test German language selection flow**
   - Launch app and verify device locale detection works for German devices
   - Test manual language switching to German via selector
   - Verify language preference persists after app restart
   - Test all screens (RecipeCatalog, DynamicRecipeView, CookingModeView) display German text
   - Check that all recipes, ingredients, and instructions appear in German
   - **Validation**: Complete user flow test in German language
   - **Dependencies**: Tasks 1-3 (requires full implementation)
   - **Estimated effort**: Small

- [x] 5. **Update i18n specification**
   - Apply spec deltas from `openspec/changes/add-german-language-support/specs/i18n/spec.md` to `openspec/specs/i18n/spec.md`
   - Use `openspec apply add-german-language-support` or manually merge changes
   - **Validation**: Run `openspec validate` to ensure spec consistency
   - **Dependencies**: Tasks 1-4 (should match implementation)
   - **Estimated effort**: Small

## Notes
- Tasks 1-2 can be done sequentially, then task 3 follows
- Task 4 is comprehensive testing after implementation
- Task 5 finalizes the spec after successful implementation
- All tasks are focused on i18n capability only - no recipe or UI design changes needed
