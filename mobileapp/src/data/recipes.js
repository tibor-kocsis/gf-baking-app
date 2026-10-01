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
//                                              choices: [{ key, labelKey, hintKey }],
//                                              multiple } multiple: value is an array of
//                                              choice keys, never empty
//                                  either may have visibleWhen(options); a choice
//                                  sits in the card of the switch above it
//   howManyKey, unitLabelKey       the stepper's label and suffix
//   summary                        dark summary card: [{ labelKey, key, unit }], unit default grams
//   metaKey                        one line of times under the ingredients title
//   ingredientGroups               [{ key, titleKey, items: [ingredient keys] }]
//   ingredientNamesKey             namespace for names (default 'ingredients')
//   ingredientNames                per-key translation overrides
//   units                          per-key unit tokens (default 'g'), see utils/format.js
//   instructionsKey, stepTitlesKey, notesKey
//   cookingSteps                   [{ instructionIndex, ingredients: [keys], timerSeconds }]
//   variantFor(options)            fields that replace the above for the chosen options

// Pizza dough 2's flours and starches: the chosen flours (the unimix among them) and starches.
// Only the ones the options use have an amount; the rest drop out of the cards.
const PIZZA2_BLEND = [
  'sorghumUnimix',
  'sorghumFlour',
  'brownRiceFlourDough',
  'milletFlour',
  'tapiocaStarch',
  'potatoStarch',
];

// Cooking steps in instruction order, the index implied by position. Each is
// [ingredients, timerSeconds]; a step with nothing to weigh is `[]`.
const steps = (...list) =>
  list.map(([ingredients = [], timerSeconds], instructionIndex) => ({
    instructionIndex,
    ingredients,
    ...(timerSeconds && { timerSeconds }),
  }));

// Pizza dough 3's blend, weighed together in the dough step and listed in its card.
const PIZZA3_BLEND = ['buckwheatFlour', 'sorghumFlour', 'cornStarch', 'potatoStarch', 'tapiocaStarch'];

// Cheese sticks: the dry mix and the wet mix are both a step and a card group.
const CHEESE_DRY = [
  'brownRiceFlourFine',
  'sorghumFlour',
  'tapiocaStarch',
  'potatoStarch',
  'psylliumHuskGround',
  'bakingPowder',
  'salt',
];
const CHEESE_WET = ['margarine', 'cottageCheese', 'sourCream', 'gratedCheese'];

const PIZZA_SUMMARY = [
  { labelKey: 'common.totalDough', key: 'totalWeight' },
  { labelKey: 'common.perPizza', key: 'weightPerPizza' },
];
// The pizza doughs also show their hydration, the baker's first read on a dough.
const PIZZA_DOUGH_SUMMARY = [...PIZZA_SUMMARY, { labelKey: 'common.hydration', key: 'hydrationPercent', unit: '%' }];

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
    summary: PIZZA_DOUGH_SUMMARY,
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
        key: 'flour',
        type: 'choice',
        multiple: true,
        default: ['unimix'],
        labelKey: 'recipes.pizza2.flourLabel',
        choices: [
          { key: 'unimix', labelKey: 'recipes.pizza2.flours.unimix', hintKey: 'recipes.pizza2.flourHints.unimix' },
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
    summary: PIZZA_DOUGH_SUMMARY,
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
            cookingSteps: steps(
              [['psylliumHusk', 'waterGel']],
              [['yeast', 'honey', 'waterYeast']],
              [[...PIZZA2_BLEND, 'brownRiceFlour', 'salt', 'oil'], 900],
              [], [], [], []
            ),
          },
    cookingSteps: steps(
      [['brownRiceFlour', 'waterTangzhong']],
      [['psylliumHusk', 'waterGel']],
      [['yeast', 'honey', 'waterYeast']],
      [[...PIZZA2_BLEND, 'salt', 'oil'], 900],
      [], [], [], []
    ),
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
    summary: PIZZA_DOUGH_SUMMARY,
    ingredientGroups: [
      {
        key: 'flour',
        titleKey: 'common.flour',
        items: [...PIZZA3_BLEND, 'psylliumHusk'],
      },
      { key: 'wet', titleKey: 'common.wetIngredients', items: ['waterGel', 'waterYeast', 'oil', 'honey'] },
      { key: 'dry', titleKey: 'common.dryIngredients', items: ['salt', 'freshYeast'] },
    ],
    cookingSteps: steps(
      [['psylliumHusk', 'waterGel']],
      [['freshYeast', 'honey', 'waterYeast']],
      [[...PIZZA3_BLEND, 'salt', 'oil']],
      [[], 1800],
      [], [], []
    ),
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
    calculate: (count, options) => calculateWaffleIngredients(count, options),
    options: [
      {
        key: 'starch',
        default: false,
        labelKey: 'recipes.waffles.starchLabel',
        onHintKey: 'recipes.waffles.starchOnHint',
        offHintKey: 'recipes.waffles.starchOffHint',
      },
      {
        key: 'starchType',
        type: 'choice',
        default: 'both',
        labelKey: 'recipes.waffles.starchTypeLabel',
        visibleWhen: (options) => options.starch,
        choices: [
          { key: 'tapioca', labelKey: 'recipes.waffles.starches.tapioca', hintKey: 'recipes.waffles.starchHints.tapioca' },
          { key: 'potato', labelKey: 'recipes.waffles.starches.potato', hintKey: 'recipes.waffles.starchHints.potato' },
          { key: 'both', labelKey: 'recipes.waffles.starches.both', hintKey: 'recipes.waffles.starchHints.both' },
        ],
      },
    ],
    ingredientNames: { flour: 'ingredients.gfFlour' },
    units: { egg: 'count', milk: 'ml', vanilla: 'tsp' },
    ingredientGroups: [
      { key: 'dry', titleKey: 'common.dryIngredients', items: ['flour', 'tapiocaStarch', 'potatoStarch', 'sugar', 'bakingPowder'] },
      { key: 'wet', titleKey: 'common.wetIngredients', items: ['egg', 'milk', 'butter', 'vanilla'] },
    ],
    cookingSteps: steps(
      [['egg']],
      [['butter']],
      [['flour', 'tapiocaStarch', 'potatoStarch', 'milk', 'sugar', 'vanilla', 'bakingPowder']],
      [], [], []
    ),
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
    cookingSteps: steps(
      [['egg', 'sugar', 'salt']],
      [['butter', 'milk']],
      [['riceFlour', 'bakingPowder']],
      [], [], [], []
    ),
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
        items: [...CHEESE_DRY, ...CHEESE_WET],
      },
      { key: 'topping', titleKey: 'recipes.cheeseSticks.groups.topping', items: ['meltedMargarine', 'toppingCheese'] },
    ],
    cookingSteps: steps(
      [CHEESE_DRY],
      [CHEESE_WET],
      [[], 2700],
      [['meltedMargarine', 'toppingCheese']],
      [[], 900],
      [[], 1020],
      [[], 600]
    ),
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
