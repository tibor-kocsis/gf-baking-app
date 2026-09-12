# Implementation Tasks

## 1. Formula Engine
- [ ] 1.1 Create `src/utils/flourMixCalculator.js` with the unimix composition, target bands and caps as named constants
- [ ] 1.2 Implement the grid solver over the flour:starch split and the unimix weight, with the cap-ranked scoring
- [ ] 1.3 Implement the preference-weighted, cap-clipped fill for the remaining flour and starch
- [ ] 1.4 Implement psyllium dosing (target 3%, unimix contribution subtracted, warning when short)
- [ ] 1.5 Implement hydration adjustments and the three-stream water split with the 1:10 gel fallback
- [ ] 1.6 Implement tangzhong flour sourcing from plain flour only (brown rice, then sorghum), never the unimix
- [ ] 1.7 Return relaxed caps and texture consequences as translatable `{ key, params }` notes
- [ ] 1.8 Round grams to whole numbers and absorb rounding drift in the largest line so totals match exactly

## 2. Catalog Entry and Routing
- [ ] 2.1 Add the `flour-mix` entry (`type: 'flour-mix'`) to `src/data/recipes.js`
- [ ] 2.2 Route `type: 'flour-mix'` to the new screen in `src/navigation/AppNavigator.js`

## 3. Screen
- [ ] 3.1 Create `src/components/FormulaRow.js` (name + baker's percentage + grams)
- [ ] 3.2 Create `src/screens/FlourMixCalculatorView.js` with the batch-size stepper, style selector and cupboard toggles
- [ ] 3.3 Render the percentage table, the hydration streams, the flour:starch breakdown and the notes
- [ ] 3.4 Render the "at least one flour source required" state when nothing is selected

## 4. Translations
- [ ] 4.1 Add `recipes.flourMix`, `flourMix.*` and the new `ingredients.*` keys to `locales/en.js`
- [ ] 4.2 Add the same keys to `locales/hu.js`, using the brief's exact Hungarian headings
- [ ] 4.3 Add the same keys to `locales/de.js`

## 5. Verification
- [ ] 5.1 Exercise the engine against the brief's reference cupboard and check the decomposition, psyllium split and water streams add up
- [ ] 5.2 Check the potato-only, tapioca-only and unimix-only cupboards produce the documented overrides and warnings
- [ ] 5.3 Check the tangzhong is refused on a unimix-only cupboard and sourced from brown rice otherwise
- [ ] 5.4 Check gram totals sum exactly to the stated flour, starch and water totals across a sweep of batch sizes
- [ ] 5.5 Check every new translation key resolves in all three languages
