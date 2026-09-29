// The one cooking-step shape every recipe renders in cooking mode:
//   [{ title, text, timerSeconds, items: [{ id, name, amount, unit }] }]
// `unit` is a token from utils/format.js. Scaled recipes build it from the steps
// they declare in the catalog; the flour mix builds its own (flourMixSteps.js).
import { ingredientNameKey, ingredientUnit, instructionsFor } from './recipeModel';

export function buildRecipePlan(recipe, ingredients, t) {
  if (!ingredients || !recipe.instructionsKey || !recipe.cookingSteps) return null;
  const instructions = instructionsFor(recipe, ingredients, t);

  return recipe.cookingSteps.map((step) => {
    const instruction = instructions[step.instructionIndex] || {};
    return {
      title: instruction.title,
      text: instruction.text,
      timerSeconds: step.timerSeconds,
      // Options zero some ingredients out (the unimix or the ones replacing it).
      items: (step.ingredients || []).filter((key) => ingredients[key] > 0).map((key) => ({
        id: key,
        name: t(ingredientNameKey(recipe, key)),
        amount: ingredients[key],
        unit: ingredientUnit(recipe, key),
      })),
    };
  });
}
