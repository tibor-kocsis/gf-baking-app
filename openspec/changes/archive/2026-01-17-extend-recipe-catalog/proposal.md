# Change: Extend Pizza Calculator to Gluten Free Baking App

## Why
The current app only supports pizza dough calculation. Users need access to multiple gluten-free recipes in a single app, including both dynamic calculators (scalable recipes) and static recipes (fixed ingredient lists). This expansion transforms the single-purpose calculator into a comprehensive gluten-free baking companion.

## What Changes
- **BREAKING**: Rename app from "Pizza Calc" to "Gluten Free Baking"
- **BREAKING**: Replace single calculator view with recipe catalog as main screen
- Add recipe catalog system supporting two recipe types:
  - Dynamic recipes: scalable calculators (like current pizza dough)
  - Static recipes: fixed ingredient lists with instructions
- Add "Sandwich Bread" as first static recipe (from gf-bread.md)
- Update UI design to modern, earthy/natural color palette
- Reorganize navigation: home screen lists recipes, tap to view details

## Impact
- Affected specs: `recipe-catalog` (new), `app-branding` (new), `ui-design` (new)
- Affected code:
  - `mobileapp/App.js` - complete restructure
  - `mobileapp/app.json` - app name and branding
  - New component files for recipe list, recipe detail views
  - New data structure for recipes
