# CLAUDE.md

## Project

**Gluten Free Baking** (`com.glutenfreebaking.app`) — offline Expo app of gluten-free recipe calculators. A catalog of tiles (pizza 1–3, waffles, pancakes, cheese sticks, bread/rolls flour mix); each recipe rescales its ingredients as the baker changes a count, batch size or multiplier, and has a cooking mode (step-by-step, timers, screen kept on) and notes with photos. No backend, no account — everything lives on the device.
Source recipes with background and reasoning (Hungarian): `recipes/*.md`.

## Working agreements

- **Reporting**: extremely concise; sacrifice grammar for concision. Surface every bug you discover explicitly (what / where / impact) — never mention one in passing. Explain complex risks in Hungarian when asked.
- **Planning**: in plan mode, interview the user with AskUserQuestion (put the recommended option first, "(Recommended)") until open questions are resolved. Plans are vertical slices (data → calculator → view → translations → cooking steps), not deliverable lists.
- **Never start Expo / Metro.** The user runs it (`npm start`, `npm run start:tunnel`, or `npm run web`) and says when it's up.
- **Builds are the user's job** (`build-apk.sh`, `eas build`, `eas login`). Never bump `version` / `versionCode` in `app.json` unless asked.
- **Recipe numbers are domain decisions.** Never invent or "tidy" a percentage, cap, hydration or bake time. Changes follow `recipes/*.md` or the user's word; if a recipe doc and the code disagree, ask which is right.
- **Git**: commit/push only when asked. Trunk-based on `main` (push to `origin main`). Subject is a plain imperative sentence describing the behaviour change (e.g. `Fix the Android back button on the bread calculator and the catalog`); body explains why and names the numbers that changed.
- When there are new or updated screens, ask the user about creating a design first, or not.
- Before starting the implementation, consider verifying the work in the web build with Playwright MCP. Ask the user if not sure.

## Architecture

**Stack**: Expo SDK 54 managed workflow (no native code) · React Native 0.81 + React 19.1, new architecture · plain JavaScript (no TypeScript) · react-native-web · AsyncStorage · expo-file-system / expo-image-picker (note photos) · expo-keep-awake (recipe and cooking screens) · expo-localization · react-native-svg (icons) · expo-font + @expo-google-fonts (Figtree, Bricolage Grotesque, bundled). No navigation or state library.

```
mobileapp/
├── App.js                   # font loading + I18nProvider + AppNavigator only
├── locales/{en,hu,de}.js    # translation objects
├── assets/                  # app icons (generate-icons.js), recipes/ photos
└── src/
    ├── data/recipes.js      # the catalog: ids, types, translation keys, cookingSteps
    ├── utils/               # pure logic: recipeCalculators, flourMixCalculator (solver), flourMixSteps (cooking plan), notesStorage
    ├── screens/             # RecipeCatalog, DynamicRecipeView, FlourMixCalculatorView, CookingModeView
    ├── components/          # Icon (SVG UI shapes), Header, RecipeHero, Stepper, StartCookingBar, IngredientRow, FormulaRow, notes + photo components, LanguageSelector
    ├── navigation/AppNavigator.js   # useState screen stack + Android BackHandler
    ├── context/I18nContext.js       # useI18n(), language persistence
    └── constants/{colors,fonts,storage}.js
recipes/                     # source recipes (hu), one per tile
```

## Commands & test environment

From `mobileapp/`:
```bash
npx expo export --platform web   # smoke-builds the bundle (catches syntax/import errors)
node generate-icons.js           # only when icons change
npm start / npm run web          # user only
```
No lint, type check, test runner or CI is set up. Check pure logic with a throwaway `node` script in the scratchpad (`node -e "import('./src/utils/recipeCalculators.js')…"` from `mobileapp/` works; ignore the module-type warning) rather than adding tooling unasked.

Environments: web via `npm run web` (Metro on :8081) for Playwright checks; device via Expo Go (`--tunnel`, or `REACT_NATIVE_PACKAGER_HOSTNAME=<host ip>` for LAN). Playwright screenshots go to `.playwright-mcp/`. Web lacks the Android back button and parts of the file system — say so when a check can only happen on a device.

## Code standards

- Functional components + hooks; PascalCase components, `handle*` handlers.
- `StyleSheet.create` at the bottom of each file; no inline style objects. Colours only from `constants/colors.js` — never hardcode. Type via `fonts.*` from `constants/fonts.js` (`fontFamily`, never `fontWeight`: Android ignores weight on custom fonts). Icons via `<Icon name>` — no emoji (they render as boxes on web). Recipe tiles use photos: `image: require('../../assets/recipes/<id>.jpg')` (640×428 JPEG, bundled for offline; credit in `assets/recipes/CREDITS.md`).
- **Business logic stays in `src/utils/` as pure functions** (no React, no i18n calls beyond an injected `t`); screens only call and render.
- AsyncStorage keys only from `constants/storage.js`. Renaming a key loses users' saved language/notes — don't, or migrate.
- Comments explain the baking reason for a number or rule (see `recipes.js`, `flourMixCalculator.js`); keep that density when adding rules.
- Everything must work offline and in grams (spoons only where the recipe says so, rounded to ¼).

## Key patterns

- **Navigation**: `AppNavigator` holds `{ type: 'catalog' | 'recipe' | 'cooking' }`. The hardware back handler only changes screen state and returns `true`/`false` — never JSX, never touching render-only variables (that bug has shipped once). Settings must survive a trip to cooking mode and back.
- **Recipe types**: `dynamic` → `DynamicRecipeView`; `flour-mix` → `FlourMixCalculatorView`. The catalog and navigation pick new recipes up from `recipes.js` automatically.
- **Cooking mode takes one step shape**: `{ instructionIndex, ingredients: [keys], timerSeconds? }`. Dynamic recipes declare `cookingSteps` (plus `variantFor(ingredients)` when an option changes the steps, e.g. pizza 2 without tangzhong); the flour mix builds its plan in `flourMixSteps.js` from the solved formula.
- **Adding a recipe**: entry in `recipes.js` (with a photo in `assets/recipes/`) (`initialValue` / `stepSize` default to 1) → pure `calculate*Ingredients` in `recipeCalculators.js` → rendering branch in `DynamicRecipeView.js` (not fully data-driven) → strings in all three locales → `cookingSteps` whose ingredient keys match the calculator's → source doc in `recipes/`.

## Flour mix solver

`utils/flourMixCalculator.js` — grid search over unimix weight × flour:starch split, scored by weighted cap violations. Invariants:
- Batch size = flour + starch, the 100% base for every percentage shown.
- Sorghum unimix is **not a flour**: always decomposed (48% sorghum / 47% tapioca / 5% psyllium); only its 95% counts toward the base, and its parts count toward the caps.
- Caps can contradict; the solver relaxes the least harmful one and **always reports which cap and by how much**. Potato is protected hardest (weighted ~10× the others).
- Tangzhong flour comes only from plain flour (brown rice first, then plain sorghum), never the unimix; with no plain flour it is dropped with a note.
- Hydration is style-independent by design; adjustments are rule-based (see file comments).

## Localization

- Three languages: `en` (fallback), `hu`, `de`. Every UI string goes into all three locale files with identical key structure (translate automatically). Device locale decides at first launch; the choice persists.
- Hungarian copy is informal ("tegeződő": "Keverd össze", "Szeretnéd"), short and literal — no misleading wording. Ingredient names follow `recipes/*.md`.
- Instructions are arrays under `instructions.<id>`; `cookingSteps[].instructionIndex` points into them, so reordering an array means updating the steps.
- New language: `locales/<code>.js` → import in `I18nContext.js` → button in `LanguageSelector.js`.

## UI guide

- White + tomato red (`colors.js`: `#D9452F` accent, light grey `#F5F5F4` ground, near-black ink, dark `inverse` summary cards). Bricolage Grotesque headings, Figtree body. Bordered cards (radius 24), small uppercase accent group labels, 2-column catalog grid, Start Cooking pinned at the bottom. Design canvas: https://claude.ai/artifact/5aqn51s62QBKXLrdwUPn8M
- Portrait phone first; must also look right in the web build. Light mode only (`userInterfaceStyle: light`).
- Press feedback on every touchable; animations via `Animated` with `useNativeDriver` where supported.
- Cooking mode is read at arm's length with messy hands: large text, big tap targets, one step at a time.
