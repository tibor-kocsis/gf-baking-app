import { parseCount, scaleAmounts, sumOf, doughTotals } from './scaling';

// Pizza dough 3 calculation logic
// Built on the principle of Caputo Fioreglut rather than a copy of it. Fioreglut
// is ~85% starch (gluten-free wheat, corn and rice starch), ~4% buckwheat, ~3.5%
// dextrose and ~6-7% psyllium and guar, going by its label's 0.6 g protein and
// 6.2 g fibre per 100 g. So: a starch-led blend with a heavy binder, 80% water,
// no tangzhong, stretched rather than pressed and baked in one go.
//
// It departs from Fioreglut in two places. The flour is 20% rather than ~5%,
// buckwheat and sorghum, for more flavour. And corn stands in for the wheat
// starch as the largest starch, since both are cereal starches of ~25% amylose;
// no trial compares them directly. The starch split keeps to the flour mix
// calculator's caps (corn 50%, potato 25% against its 45% cap, tapioca 25%).
//
// Baker's percentages of the flour + starch base, plain flours only, no mixes.
const PIZZA3 = {
  buckwheatFlour: 0.1,
  sorghumFlour: 0.1,
  cornStarch: 0.4,
  potatoStarch: 0.2,
  tapiocaStarch: 0.2,
  psylliumHusk: 0.06, // the least certain figure: 5.5% if gummy, 6.5% if it tears
  honey: 0.05, // stands in for Fioreglut's dextrose plus Caputo's own 2% honey
  oil: 0.035,
  salt: 0.025,
  freshYeast: 0.015,
};
// Corn can be left out: the potato goes to its 45% cap of the starch (36%) and
// tapioca takes the rest (44%, 55% of the starch). The caps cannot both hold at
// 80% starch, and the flour mix protects potato hardest. The water stays at 80%:
// it is Caputo's figure, not a flour mix rule.
const NO_CORN_STARCHES = { cornStarch: 0, potatoStarch: 0.36, tapiocaStarch: 0.44 };
const HYDRATION = 0.8;
const GEL_RATIO = 10;
const BALL_G = 280;

export function calculatePizza3Ingredients(count, { corn = true } = {}) {
  const numPizzas = parseCount(count);
  if (!numPizzas) return null;
  const blend = corn ? PIZZA3 : { ...PIZZA3, ...NO_CORN_STARCHES };

  const base = (BALL_G / (HYDRATION + sumOf(blend))) * numPizzas;
  const water = Math.round(HYDRATION * base);
  const waterGel = Math.round(blend.psylliumHusk * GEL_RATIO * base);

  const weighed = {
    ...scaleAmounts(blend, base),
    waterGel,
    waterYeast: water - waterGel,
  };
  return { ...weighed, hydrationPercent: Math.round(HYDRATION * 100), ...doughTotals(weighed, numPizzas) };
}
