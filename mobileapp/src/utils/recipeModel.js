// Reads a scaled recipe's catalog entry (see data/recipes.js) into what the
// recipe screen and cooking mode render. Pure: translations come in as `t`.
import { interpolate } from './format';

// Every switch and choice at its declared default.
export function defaultOptions(recipe) {
  const options = {};
  (recipe.options || []).forEach((option) => {
    options[option.key] = option.default;
  });
  return options;
}

// The settings cards on the recipe screen: each switch opens a card and the
// choices under it join that card. Options hidden by visibleWhen drop out.
// [[{ key, type: 'switch' | 'choice', label key, hint key, choices }]]
export function optionCardsFor(recipe, options) {
  const cards = [];
  (recipe.options || []).forEach((option) => {
    if (option.visibleWhen && !option.visibleWhen(options)) return;
    const choice = option.type === 'choice';
    const chosen = choice && option.choices.find((item) => item.key === options[option.key]);
    const row = {
      key: option.key,
      type: choice ? 'choice' : 'switch',
      labelKey: option.labelKey,
      hintKey: choice ? chosen && chosen.hintKey : options[option.key] ? option.onHintKey : option.offHintKey,
      choices: option.choices,
    };
    if (choice && cards.length > 0) cards[cards.length - 1].push(row);
    else cards.push([row]);
  });
  return cards;
}

// The recipe with its variant for these options applied, e.g. pizza dough 2
// without its tangzhong.
export function resolveRecipe(recipe, options) {
  return recipe.variantFor ? { ...recipe, ...recipe.variantFor(options) } : recipe;
}

export function ingredientNameKey(recipe, key) {
  const override = recipe.ingredientNames && recipe.ingredientNames[key];
  return override || `${recipe.ingredientNamesKey || 'ingredients'}.${key}`;
}

export function ingredientUnit(recipe, key) {
  return (recipe.units && recipe.units[key]) || 'g';
}

// The ingredient cards, leaving out lines the options zeroed (the tangzhong water).
export function ingredientGroupsFor(recipe, ingredients) {
  return (recipe.ingredientGroups || []).map((group) => ({
    key: group.key,
    titleKey: group.titleKey,
    items: group.items
      .filter((key) => ingredients[key] > 0)
      .map((key) => ({
        key,
        nameKey: ingredientNameKey(recipe, key),
        amount: ingredients[key],
        unit: ingredientUnit(recipe, key),
      })),
  }));
}

function listFrom(t, key) {
  const value = key ? t(key) : null;
  return Array.isArray(value) ? value : [];
}

// The numbered method: [{ title, text, timerSeconds }], amounts filled in.
export function instructionsFor(recipe, ingredients, t) {
  const titles = listFrom(t, recipe.stepTitlesKey);
  const timers = {};
  (recipe.cookingSteps || []).forEach((step) => {
    if (step.timerSeconds) timers[step.instructionIndex] = step.timerSeconds;
  });
  return listFrom(t, recipe.instructionsKey).map((text, index) => ({
    title: titles[index],
    text: interpolate(text, ingredients),
    timerSeconds: timers[index],
  }));
}

export function recipeNotesFor(recipe, t) {
  return listFrom(t, recipe.notesKey);
}
