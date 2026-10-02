# CLAUDE.md

## Project

**Gluten Free Baking** (`com.glutenfreebaking.app`) — offline Expo app of gluten-free recipe calculators. Each recipe rescales its ingredients as the baker changes a count, batch size or multiplier, and has a cooking mode and notes with photos. No backend, no account — everything lives on the device.
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

**Stack**: Expo SDK 54 managed workflow (no native code) · React Native + react-native-web · plain JavaScript (no TypeScript) · AsyncStorage for all persistence. No navigation or state library — keep it that way unless asked.

```
mobileapp/
├── App.js          # providers only
├── locales/        # en, hu, de
├── assets/         # app icons, recipe photos
└── src/
    ├── data/       # the recipe catalog (single source for catalog, navigation, cooking steps)
    ├── utils/      # pure logic: calculators/ (one per recipe + shared scaling), flour mix solver,
    │               #   recipe model, cooking plans, formatting, notes storage
    ├── screens/    # render only: RecipeView (any scaled recipe), FlourMixCalculatorView, CookingModeView, RecipeCatalog
    ├── components/ # shared building blocks (Card, Section, IngredientCard, SwitchRow, ...); flourMix/ sections
    ├── hooks/      # useSessionState (settings across cooking mode), usePulse
    ├── platform/   # dialogs, photo files: `x.js` native, `x.web.js` browser (Metro picks by platform)
    ├── navigation/ # screen-state stack + Android back button
    ├── context/    # i18n: t(key, params) fills {name} placeholders
    └── constants/  # colors, fonts, layout, storage keys
recipes/            # source recipes (hu), one per tile
```

## Rules

- **Business logic stays in `src/utils/` as pure functions** (no React, no i18n beyond an injected `t`); screens only call and render.
- **Offline and in grams.** Everything, including fonts and photos, is bundled.
- **Storage keys** only from `constants/storage.js`. Renaming a key loses users' saved language/notes — don't, or migrate.
- **Navigation**: the hardware back handler only changes screen state and returns `true`/`false` — never JSX, never render-only variables (that bug has shipped once). Settings must survive a trip to cooking mode and back.
- **One cooking-step shape** for every recipe (`utils/cookingPlan.js`); recipes declare their steps in the catalog, the flour mix derives its plan from the solved formula. The recipe screen builds the plan; cooking mode only renders it.
- **Scaled recipes are data**: a new one is a calculator in `utils/calculators/` + a catalog entry (groups, names, units, summary, options, variants — schema at the top of `data/recipes.js`) + translations. Never branch on a recipe id in a screen.
- **Platform differences** live in `src/platform/` as `.js` / `.web.js` twins, not `Platform.OS` checks in components. react-native-web's `Alert` is a no-op: use `platform/dialogs`.
- **Styling**: `StyleSheet.create` at the bottom of each file, no inline style objects. Colours and fonts only from `constants/` — never hardcode. No emoji (boxes on web); icons are SVG, recipe images are bundled photos with credits in `assets/recipes/CREDITS.md`.
- **Comments** explain the baking reason for a number or rule; keep that density when adding rules. Domain rules (flour mix caps, hydration, psyllium, tangzhong, bake numbers) live there, next to the numbers in `utils/`, and in `recipes/*.md` — not in this file.
- Functional components + hooks; PascalCase components, `handle*` handlers.

## Localization

- `en` (fallback), `hu`, `de`. Every UI string goes into all three with identical key structure (translate automatically). Device locale decides at first launch; the choice persists.
- Hungarian copy is informal ("tegeződő"), short and literal — no misleading wording. Ingredient names follow `recipes/*.md`.
- Cooking steps point into instruction arrays by index: reordering an array means updating the steps.

## UI guide

- Clean, modern: white ground, one tomato-red accent, bold grotesque headings. Design canvas: https://claude.ai/artifact/5aqn51s62QBKXLrdwUPn8M
- Portrait phone first; must also look right in the web build. Light mode only.
- Press feedback on every touchable.
- Cooking mode is read at arm's length with messy hands: large text, big tap targets, screen kept on.

## Checking work

No lint, type check, test runner or CI — don't add tooling unasked.
- `npx expo export --platform web` (from `mobileapp/`) smoke-builds the bundle.
- Pure logic: throwaway `node` script in the scratchpad.
- UI: Playwright against the user's `npm run web` (Metro :8081). Web lacks the Android back button and parts of the file system — say so when a check can only happen on a device.
