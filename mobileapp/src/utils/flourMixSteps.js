// Cooking steps for a solved flour mix
//
// The flour mix has no fixed recipe, so its steps are built from the formula:
// a tangzhong and a psyllium gel only when the formula has them, milk and egg
// for the hot dog bun, and shaping and baking by style. The method is the
// baker's own from their sandwich bread and baguette: rest 15 minutes, fold a
// few times, score, proof to 120-150%, bake to 96-98 C inside.

const STYLE_SHAPE = {
  sandwich: 'shapeSandwich',
  rustic: 'shapeRustic',
  softRoll: 'shapeSoftRoll',
  enrichedBun: 'shapeEnrichedBun',
};
const STYLE_BAKE = {
  sandwich: 'bakeSandwich',
  rustic: 'bakeRustic',
  softRoll: 'bakeSoftRoll',
  enrichedBun: 'bakeEnrichedBun',
};

// `nameOf` turns a formula key into its translated ingredient name.
export function buildFlourMixPlan(formula, t, nameOf) {
  if (!formula || formula.error) return null;

  const milk = formula.water.liquid === 'milk';
  const text = (key) => t(`flourMix.steps.${key}`);
  const liquidUnit = milk ? 'g' : 'ml';
  const liquidName = nameOf(milk ? 'milk' : 'water');
  const item = (id, key, amount, unit = 'g') => ({ id, name: nameOf(key), amount, unit });

  // Grams each source gives to the tangzhong, to take off its line in the mix.
  const tangzhongTake = {};
  (formula.tangzhong ? formula.tangzhong.flour : []).forEach((part) => {
    tangzhongTake[part.key] = part.amount;
  });

  const steps = [];

  if (formula.tangzhong) {
    steps.push({
      title: text('tangzhongTitle'),
      text: text(milk ? 'tangzhongMilk' : 'tangzhongWater'),
      items: formula.tangzhong.flour
        .map((part) => item(`tangzhong-${part.key}`, part.key, part.amount))
        .concat({ id: 'tangzhong-liquid', name: liquidName, amount: formula.water.tangzhong, unit: liquidUnit }),
    });
  }

  if (formula.psyllium.added > 0) {
    steps.push({
      title: text('gelTitle'),
      text: text('gel'),
      items: [
        item('psylliumHusk', 'psylliumHusk', formula.psyllium.added),
        { id: 'gel-water', name: nameOf('water'), amount: formula.water.psylliumGel, unit: 'ml' },
      ],
    });
  }

  const sweetener = formula.additions.sugar !== undefined ? 'sugar' : 'honey';
  steps.push({
    title: text('yeastTitle'),
    text: text(milk ? 'yeastMilk' : 'yeastWater'),
    items: [
      item('freshYeast', 'freshYeast', formula.additions.freshYeast),
      item(sweetener, sweetener, formula.additions[sweetener]),
      { id: 'remainder-liquid', name: liquidName, amount: formula.water.remainder, unit: liquidUnit },
    ],
  });

  // The dry lines are what is left of each weighed line once the tangzhong has
  // taken its share.
  const dry = formula.weighed
    .filter((row) => row.group === 'flour' || row.group === 'starch')
    .map((row) => item(row.key, row.key, row.amount - (tangzhongTake[row.key] || 0)))
    .filter((row) => row.amount > 0);
  const mixItems = dry.concat(item('salt', 'salt', formula.additions.salt));
  if (formula.water.eggCount > 0) {
    mixItems.push({ id: 'egg', name: nameOf('egg'), amount: formula.water.eggCount, unit: ` ${t('flourMix.eggUnit')}` });
  }
  mixItems.push(item('vinegar', 'vinegar', formula.additions.vinegar));
  mixItems.push(item('oil', 'oil', formula.additions.oil));
  steps.push({
    title: text('mixTitle'),
    text: text(formula.water.eggCount > 0 ? 'mixEnriched' : 'mix'),
    items: mixItems,
  });

  steps.push({ title: text('restTitle'), text: text('rest'), timerSeconds: 900, items: [] });
  steps.push({ title: text('foldTitle'), text: text('fold'), items: [] });
  steps.push({ title: text('shapeTitle'), text: text(STYLE_SHAPE[formula.style]), items: [] });
  steps.push({ title: text('proofTitle'), text: text('proof'), items: [] });
  steps.push({ title: text('bakeTitle'), text: text(STYLE_BAKE[formula.style]), items: [] });
  steps.push({ title: text('coolTitle'), text: text('cool'), items: [] });

  return steps;
}
