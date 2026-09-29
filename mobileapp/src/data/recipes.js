import {
  calculatePizzaIngredients,
  calculatePizza2Ingredients,
  calculatePizza3Ingredients,
  calculateWaffleIngredients,
  calculatePancakeIngredients,
  calculateCheeseStickIngredients,
  CHEESE_STICK_SPOON_UNITS,
} from '../utils/calculators';

// The recipe catalog: the single source for the catalog screen, navigation and
// cooking steps. A new scaled recipe is a calculator plus an entry here plus its
// translations; no screen needs to change.
//
// Every recipe:
//   id, type ('scaled' | 'flour-mix'), nameKey, descriptionKey, image,
//   initialValue, stepSize         the stepper's start and step
//   featured                       full-width card under the catalog grid
// Scaled recipes also:
//   calculate(count, options)      ingredient amounts, or null for no count
//   options                        settings passed to calculate:
//                                    switch  { key, default, labelKey, onHintKey, offHintKey }
//                                    choice  { key, type: 'choice', default, labelKey,
//                                              choices: [{ key, labelKey, hintKey }] }
//                                  either may have visibleWhen(options); a choice
//                                  sits in the card of the switch above it
//   howManyKey, unitLabelKey       the stepper's label and suffix
//   summary                        dark summary card: [{ labelKey, key }] in grams
//   metaKey                        one line of times under the ingredients title
//   ingredientGroups               [{ key, titleKey, items: [ingredient keys] }]
//   ingredientNamesKey             namespace for names (default 'ingredients')
//   ingredientNames                per-key translation overrides
//   units                          per-key unit tokens (default 'g'), see utils/format.js
//   instructionsKey, stepTitlesKey, notesKey
//   cookingSteps                   [{ instructionIndex, ingredients: [keys], timerSeconds }]
//   variantFor(options)            fields that replace the above for the chosen options

// Pizza dough 2's flours and starches: the unimix, or the chosen flour and starches.
// Only the ones the options use have an amount; the rest drop out of the cards.
const PIZZA2_BLEND = [
  'sorghumUnimix',
  'sorghumFlour',
  'brownRiceFlourDough',
  'milletFlour',
  'tapiocaStarch',
  'potatoStarch',
];

const PIZZA_SUMMARY = [
  { labelKey: 'common.totalDough', key: 'totalWeight' },
  { labelKey: 'common.perPizza', key: 'weightPerPizza' },
];

export const recipes = [
  {
    id: 'pizza',
    type: 'scaled',
    nameKey: 'recipes.pizza.name',
    image: require('../../assets/recipes/pizza.jpg'), // Unsplash photo, credits in assets/recipes/CREDITS.md
    descriptionKey: 'recipes.pizza.description',
    unitLabelKey: 'recipes.pizza.unitLabel',
    howManyKey: 'recipes.pizza.howMany',
    calculate: (count) => calculatePizzaIngredients(count),
    summary: PIZZA_SUMMARY,
    ingredientNames: { glutenFreeFlour: 'ingredients.universalGfFlour' },
    ingredientGroups: [
      { key: 'flour', titleKey: 'common.flour', items: ['sorghumFlour', 'glutenFreeFlour'] },
      { key: 'wet', titleKey: 'common.wetIngredients', items: ['water', 'oil', 'honey'] },
      { key: 'dry', titleKey: 'common.dryIngredients', items: ['salt', 'yeast'] },
    ],
  },
  {
    // The first pizza without the Miklos universal mix; the original stays as is.
    id: 'pizza-2',
    type: 'scaled',
    nameKey: 'recipes.pizza2.name',
    image: require('../../assets/recipes/pizza-2.jpg'),
    descriptionKey: 'recipes.pizza2.description',
    unitLabelKey: 'recipes.pizza2.unitLabel',
    howManyKey: 'recipes.pizza2.howMany',
    instructionsKey: 'instructions.pizza2',
    notesKey: 'recipes.pizza2.notes',
    calculate: (count, options) => calculatePizza2Ingredients(count, options),
    options: [
      {
        key: 'unimix',
        default: true,
        labelKey: 'recipes.pizza2.unimixLabel',
        onHintKey: 'recipes.pizza2.unimixOnHint',
        offHintKey: 'recipes.pizza2.unimixOffHint',
      },
      {
        key: 'flour',
        type: 'choice',
        default: 'sorghum',
        labelKey: 'recipes.pizza2.flourLabel',
        visibleWhen: (options) => !options.unimix,
        choices: [
          { key: 'sorghum', labelKey: 'recipes.pizza2.flours.sorghum', hintKey: 'recipes.pizza2.flourHints.sorghum' },
          { key: 'brownRice', labelKey: 'recipes.pizza2.flours.brownRice', hintKey: 'recipes.pizza2.flourHints.brownRice' },
          { key: 'millet', labelKey: 'recipes.pizza2.flours.millet', hintKey: 'recipes.pizza2.flourHints.millet' },
        ],
      },
      {
        key: 'starch',
        type: 'choice',
        default: 'both',
        labelKey: 'recipes.pizza2.starchLabel',
        visibleWhen: (options) => !options.unimix,
        choices: [
          { key: 'potato', labelKey: 'recipes.pizza2.starches.potato', hintKey: 'recipes.pizza2.starchHints.potato' },
          { key: 'tapioca', labelKey: 'recipes.pizza2.starches.tapioca', hintKey: 'recipes.pizza2.starchHints.tapioca' },
          { key: 'both', labelKey: 'recipes.pizza2.starches.both', hintKey: 'recipes.pizza2.starchHints.both' },
        ],
      },
      {
        key: 'tangzhong',
        default: true,
        labelKey: 'recipes.pizza2.tangzhongLabel',
        onHintKey: 'recipes.pizza2.tangzhongOnHint',
        offHintKey: 'recipes.pizza2.tangzhongOffHint',
      },
    ],
    summary: PIZZA_SUMMARY,
    // brownRiceFlourDough is brown rice chosen as the main flour, apart from the
    // tangzhong's; without a tangzhong the two are weighed as one.
    ingredientNames: { brownRiceFlourDough: 'ingredients.brownRiceFlour' },
    ingredientGroups: [
      { key: 'flour', titleKey: 'common.flour', items: [...PIZZA2_BLEND, 'brownRiceFlour', 'psylliumHusk'] },
      {
        key: 'wet',
        titleKey: 'common.wetIngredients',
        items: ['waterTangzhong', 'waterGel', 'waterYeast', 'oil', 'honey'],
      },
      { key: 'dry', titleKey: 'common.dryIngredients', items: ['salt', 'yeast'] },
    ],
    // Without the tangzhong the first step drops out and the brown rice goes into
    // the dough with the rest of the blend.
    variantFor: (options) =>
      options.tangzhong
        ? {
            ingredientNames: {
              brownRiceFlour: 'ingredients.brownRiceFlourTangzhong',
              brownRiceFlourDough: 'ingredients.brownRiceFlour',
            },
          }
        : {
            instructionsKey: 'instructions.pizza2NoTangzhong',
            cookingSteps: [
              { instructionIndex: 0, ingredients: ['psylliumHusk', 'waterGel'] },
              { instructionIndex: 1, ingredients: ['yeast', 'honey', 'waterYeast'] },
              {
                instructionIndex: 2,
                ingredients: [...PIZZA2_BLEND, 'brownRiceFlour', 'salt', 'oil'],
                timerSeconds: 900,
              },
              { instructionIndex: 3, ingredients: [] },
              { instructionIndex: 4, ingredients: [] },
              { instructionIndex: 5, ingredients: [] },
              { instructionIndex: 6, ingredients: [] },
            ],
          },
    cookingSteps: [
      { instructionIndex: 0, ingredients: ['brownRiceFlour', 'waterTangzhong'] },
      { instructionIndex: 1, ingredients: ['psylliumHusk', 'waterGel'] },
      { instructionIndex: 2, ingredients: ['yeast', 'honey', 'waterYeast'] },
      { instructionIndex: 3, ingredients: [...PIZZA2_BLEND, 'salt', 'oil'], timerSeconds: 900 },
      { instructionIndex: 4, ingredients: [] },
      { instructionIndex: 5, ingredients: [] },
      { instructionIndex: 6, ingredients: [] },
      { instructionIndex: 7, ingredients: [] },
    ],
  },
  {
    // On the principle of Caputo Fioreglut: starch-led, heavy binder, stretched.
    id: 'pizza-3',
    type: 'scaled',
    nameKey: 'recipes.pizza3.name',
    image: require('../../assets/recipes/pizza-3.jpg'),
    descriptionKey: 'recipes.pizza3.description',
    unitLabelKey: 'recipes.pizza3.unitLabel',
    howManyKey: 'recipes.pizza3.howMany',
    instructionsKey: 'instructions.pizza3',
    notesKey: 'recipes.pizza3.notes',
    calculate: (count, options) => calculatePizza3Ingredients(count, options),
    options: [
      {
        key: 'corn',
        default: true,
        labelKey: 'recipes.pizza3.cornLabel',
        onHintKey: 'recipes.pizza3.cornOnHint',
        offHintKey: 'recipes.pizza3.cornOffHint',
      },
    ],
    summary: PIZZA_SUMMARY,
    ingredientGroups: [
      {
        key: 'flour',
        titleKey: 'common.flour',
        items: ['buckwheatFlour', 'sorghumFlour', 'cornStarch', 'potatoStarch', 'tapiocaStarch', 'psylliumHusk'],
      },
      { key: 'wet', titleKey: 'common.wetIngredients', items: ['waterGel', 'waterYeast', 'oil', 'honey'] },
      { key: 'dry', titleKey: 'common.dryIngredients', items: ['salt', 'freshYeast'] },
    ],
    cookingSteps: [
      { instructionIndex: 0, ingredients: ['psylliumHusk', 'waterGel'] },
      { instructionIndex: 1, ingredients: ['freshYeast', 'honey', 'waterYeast'] },
      {
        instructionIndex: 2,
        ingredients: ['buckwheatFlour', 'sorghumFlour', 'cornStarch', 'potatoStarch', 'tapiocaStarch', 'salt', 'oil'],
      },
      { instructionIndex: 3, ingredients: [], timerSeconds: 1800 },
      { instructionIndex: 4, ingredients: [] },
      { instructionIndex: 5, ingredients: [] },
      { instructionIndex: 6, ingredients: [] },
    ],
  },
  {
    id: 'waffles',
    type: 'scaled',
    nameKey: 'recipes.waffles.name',
    image: require('../../assets/recipes/waffles.jpg'),
    descriptionKey: 'recipes.waffles.description',
    unitLabelKey: 'recipes.waffles.unitLabel',
    howManyKey: 'recipes.waffles.howMany',
    instructionsKey: 'instructions.waffles',
    calculate: (count) => calculateWaffleIngredients(count),
    ingredientNames: { flour: 'ingredients.gfFlour' },
    units: { egg: 'count', milk: 'ml', vanilla: 'tsp' },
    ingredientGroups: [
      { key: 'dry', titleKey: 'common.dryIngredients', items: ['flour', 'sugar', 'bakingPowder'] },
      { key: 'wet', titleKey: 'common.wetIngredients', items: ['egg', 'milk', 'butter', 'vanilla'] },
    ],
    cookingSteps: [
      { instructionIndex: 0, ingredients: ['egg'] },
      { instructionIndex: 1, ingredients: ['butter'] },
      { instructionIndex: 2, ingredients: ['flour', 'milk', 'sugar', 'vanilla', 'bakingPowder'] },
      { instructionIndex: 3, ingredients: [] },
      { instructionIndex: 4, ingredients: [] },
      { instructionIndex: 5, ingredients: [] },
    ],
  },
  {
    id: 'pancakes',
    type: 'scaled',
    nameKey: 'recipes.pancakes.name',
    image: require('../../assets/recipes/pancakes.jpg'),
    descriptionKey: 'recipes.pancakes.description',
    unitLabelKey: 'recipes.pancakes.unitLabel',
    howManyKey: 'recipes.pancakes.howMany',
    instructionsKey: 'instructions.pancakes',
    initialValue: 22,
    stepSize: 1,
    calculate: (count) => calculatePancakeIngredients(count),
    units: { egg: 'count', milk: 'ml' },
    ingredientGroups: [
      { key: 'dry', titleKey: 'common.dryIngredients', items: ['riceFlour', 'sugar', 'bakingPowder', 'salt'] },
      { key: 'wet', titleKey: 'common.wetIngredients', items: ['egg', 'butter', 'milk'] },
    ],
    cookingSteps: [
      { instructionIndex: 0, ingredients: ['egg', 'sugar', 'salt'] },
      { instructionIndex: 1, ingredients: ['butter', 'milk'] },
      { instructionIndex: 2, ingredients: ['riceFlour', 'bakingPowder'] },
      { instructionIndex: 3, ingredients: [] },
      { instructionIndex: 4, ingredients: [] },
      { instructionIndex: 5, ingredients: [] },
      { instructionIndex: 6, ingredients: [] },
    ],
  },
  {
    id: 'cheese-sticks',
    type: 'scaled',
    nameKey: 'recipes.cheeseSticks.name',
    image: require('../../assets/recipes/cheese-sticks.jpg'),
    descriptionKey: 'recipes.cheeseSticks.description',
    unitLabelKey: 'recipes.cheeseSticks.unitLabel',
    howManyKey: 'recipes.cheeseSticks.howMany',
    instructionsKey: 'instructions.cheeseSticks',
    stepTitlesKey: 'recipes.cheeseSticks.stepTitles',
    notesKey: 'recipes.cheeseSticks.notes',
    metaKey: 'recipes.cheeseSticks.meta',
    ingredientNamesKey: 'recipes.cheeseSticks.ingredients',
    units: CHEESE_STICK_SPOON_UNITS,
    initialValue: 2, // trays: the base recipe, 250 g cottage cheese
    stepSize: 1,
    calculate: (count) => calculateCheeseStickIngredients(count),
    // The recipe's own groups, in the order it lists them.
    ingredientGroups: [
      {
        key: 'dough',
        titleKey: 'recipes.cheeseSticks.groups.dough',
        items: [
          'brownRiceFlourFine',
          'sorghumFlour',
          'tapiocaStarch',
          'potatoStarch',
          'psylliumHuskGround',
          'bakingPowder',
          'salt',
          'margarine',
          'cottageCheese',
          'sourCream',
          'gratedCheese',
        ],
      },
      { key: 'topping', titleKey: 'recipes.cheeseSticks.groups.topping', items: ['meltedMargarine', 'toppingCheese'] },
    ],
    cookingSteps: [
      {
        instructionIndex: 0,
        ingredients: [
          'brownRiceFlourFine',
          'sorghumFlour',
          'tapiocaStarch',
          'potatoStarch',
          'psylliumHuskGround',
          'bakingPowder',
          'salt',
        ],
      },
      { instructionIndex: 1, ingredients: ['margarine', 'cottageCheese', 'sourCream', 'gratedCheese'] },
      { instructionIndex: 2, ingredients: [], timerSeconds: 2700 },
      { instructionIndex: 3, ingredients: ['meltedMargarine', 'toppingCheese'] },
      { instructionIndex: 4, ingredients: [], timerSeconds: 900 },
      { instructionIndex: 5, ingredients: [], timerSeconds: 1020 },
      { instructionIndex: 6, ingredients: [], timerSeconds: 600 },
    ],
  },
  {
    // A calculator rather than a recipe: it solves a flour blend from whatever
    // flours and starches the baker has, so it gets its own screen.
    id: 'flour-mix',
    type: 'flour-mix',
    featured: true,
    nameKey: 'recipes.flourMix.name',
    image: require('../../assets/recipes/flour-mix.jpg'),
    descriptionKey: 'recipes.flourMix.description',
    initialValue: 500,
    stepSize: 50,
  },
];

export function findRecipe(recipeId) {
  return recipes.find((recipe) => recipe.id === recipeId) || null;
}
