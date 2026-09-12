# Change: Add Flour Mix Calculator Tile

## Why
Every existing recipe assumes a fixed flour blend. In practice the baker has whatever
flours and starches happen to be in the cupboard, and the hard part is balancing them:
flour-to-starch ratio, per-starch caps (potato kills oven spring), psyllium dose and
hydration. This change adds a tile that solves the blend from the ingredients on hand
and reports how the balance came out.

## What Changes
- Add a **Flour Mix** tile to the recipe catalog home screen, opening a new
  ingredient-driven calculator screen (not the single-stepper `DynamicRecipeView`).
- Introduce a `type: 'flour-mix'` catalog entry and route it in `AppNavigator`.
- Implement the formula engine in `src/utils/flourMixCalculator.js`:
  - inputs: batch size, sorghum unimix on hand, available flours (sorghum, millet,
    brown rice), available starches (potato, tapioca, corn), psyllium on hand,
    tangzhong toggle, target style (sandwich / rustic / soft roll)
  - the unimix is decomposed (48% sorghum / 47% tapioca / 5% psyllium) into the
    flour, starch and psyllium totals — it is never treated as 100% flour
  - solves the unimix weight against the starch and flour caps, fills the remaining
    flour and starch, doses psyllium, computes hydration and splits the water into
    tangzhong / psyllium gel / mixing streams
  - **tangzhong flour is taken from the plain flour fraction only (brown rice first,
    then sorghum) — never from the unimix**, because boiling the mix's psyllium gives
    a stiff, non-yielding gel
  - reports every relaxed cap instead of silently exceeding it
- Add a `FormulaRow` component that shows an ingredient as both a baker's percentage
  and a gram weight.
- Add English, Hungarian and German translations for the new screen.

## Impact
- Affected specs: `recipe-catalog` (new tile + new screen type), `ui-design`
- Affected code: `src/data/recipes.js`, `src/navigation/AppNavigator.js`,
  `src/screens/FlourMixCalculatorView.js` (new),
  `src/utils/flourMixCalculator.js` (new),
  `src/components/FormulaRow.js` (new),
  `locales/en.js`, `locales/hu.js`, `locales/de.js`
