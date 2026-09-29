import { CHEESE_STICK_SPOON_UNITS } from '../utils/recipeCalculators';

// Recipe definitions with translation keys
export const recipes = [
  {
    id: 'pizza',
    type: 'dynamic',
    nameKey: 'recipes.pizza.name',
    image: require('../../assets/recipes/pizza.jpg'), // Unsplash photo, credits in assets/recipes/CREDITS.md
    descriptionKey: 'recipes.pizza.description',
    unitLabelKey: 'recipes.pizza.unitLabel',
    howManyKey: 'recipes.pizza.howMany',
    baseWeight: 300,
  },
  {
    // The first pizza without the Miklos universal mix; the original stays as is.
    id: 'pizza-2',
    type: 'dynamic',
    nameKey: 'recipes.pizza2.name',
    image: require('../../assets/recipes/pizza-2.jpg'),
    descriptionKey: 'recipes.pizza2.description',
    unitLabelKey: 'recipes.pizza2.unitLabel',
    howManyKey: 'recipes.pizza2.howMany',
    instructionsKey: 'instructions.pizza2',
    notesKey: 'recipes.pizza2.notes',
    // Without the tangzhong the first step drops out and the brown rice goes into
    // the dough with the rest of the blend.
    variantFor: (ingredients) =>
      ingredients && ingredients.tangzhong === false
        ? {
            instructionsKey: 'instructions.pizza2NoTangzhong',
            cookingSteps: [
              { instructionIndex: 0, ingredients: ['psylliumHusk', 'waterGel'] },
              { instructionIndex: 1, ingredients: ['yeast', 'honey', 'waterYeast'] },
              {
                instructionIndex: 2,
                ingredients: ['sorghumUnimix', 'potatoStarch', 'brownRiceFlour', 'salt', 'oil'],
                timerSeconds: 900,
              },
              { instructionIndex: 3, ingredients: [] },
              { instructionIndex: 4, ingredients: [] },
              { instructionIndex: 5, ingredients: [] },
              { instructionIndex: 6, ingredients: [] },
            ],
          }
        : {},
    cookingSteps: [
      { instructionIndex: 0, ingredients: ['brownRiceFlour', 'waterTangzhong'] },
      { instructionIndex: 1, ingredients: ['psylliumHusk', 'waterGel'] },
      { instructionIndex: 2, ingredients: ['yeast', 'honey', 'waterYeast'] },
      { instructionIndex: 3, ingredients: ['sorghumUnimix', 'potatoStarch', 'salt', 'oil'], timerSeconds: 900 },
      { instructionIndex: 4, ingredients: [] },
      { instructionIndex: 5, ingredients: [] },
      { instructionIndex: 6, ingredients: [] },
      { instructionIndex: 7, ingredients: [] },
    ],
  },
  {
    // On the principle of Caputo Fioreglut: starch-led, heavy binder, stretched.
    id: 'pizza-3',
    type: 'dynamic',
    nameKey: 'recipes.pizza3.name',
    image: require('../../assets/recipes/pizza-3.jpg'),
    descriptionKey: 'recipes.pizza3.description',
    unitLabelKey: 'recipes.pizza3.unitLabel',
    howManyKey: 'recipes.pizza3.howMany',
    instructionsKey: 'instructions.pizza3',
    notesKey: 'recipes.pizza3.notes',
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
    type: 'dynamic',
    nameKey: 'recipes.waffles.name',
    image: require('../../assets/recipes/waffles.jpg'),
    descriptionKey: 'recipes.waffles.description',
    unitLabelKey: 'recipes.waffles.unitLabel',
    howManyKey: 'recipes.waffles.howMany',
    instructionsKey: 'instructions.waffles',
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
    type: 'dynamic',
    nameKey: 'recipes.pancakes.name',
    image: require('../../assets/recipes/pancakes.jpg'),
    descriptionKey: 'recipes.pancakes.description',
    unitLabelKey: 'recipes.pancakes.unitLabel',
    howManyKey: 'recipes.pancakes.howMany',
    instructionsKey: 'instructions.pancakes',
    initialValue: 22,
    stepSize: 1,
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
    type: 'dynamic',
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
    ingredientUnits: CHEESE_STICK_SPOON_UNITS,
    initialValue: 30,
    stepSize: 5,
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
    nameKey: 'recipes.flourMix.name',
    image: require('../../assets/recipes/flour-mix.jpg'),
    descriptionKey: 'recipes.flourMix.description',
    initialValue: 500,
    stepSize: 50,
  },
];
