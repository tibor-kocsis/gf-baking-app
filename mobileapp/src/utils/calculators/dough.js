// Dough rules shared by pizza dough 2 and the flour mix calculator, so the two
// never drift apart on the same baking fact.

// Magura sorghum "unimix", back-calculated from the label. This is NOT a flour:
// every gram is decomposed into flour, starch and psyllium parts.
export const SORGHUM_UNIMIX = { sorghum: 0.48, tapioca: 0.47, psyllium: 0.05 };

// The 1:5 tangzhong ratio is a liquid ratio: grams of water per gram of flour.
export const TANGZHONG_WATER_RATIO = 5;

// The tangzhong's share of the flour + starch base is the baker's to set. What is
// known about it in gluten-free bread is thin and points low:
// - Gluten-free rice bread batter (110% water, HPMC) did best with 1% of the flour
//   cooked at 80 C for 2 minutes in half the water: 0.5-1.5% did not differ, 3-10%
//   cut the volume significantly (Foods 2021, Ding et al.). It tested 2% too and
//   did not report it as lower. Its paste is far thinner than 1:5.
// - Rice pan bread gained volume and softness at "1.5-6% (flour base)" (Kim 2016);
//   the paper is closed, so whether that is the roux or the flour inside it is
//   unknown. At 1:5 the roux reading would be 0.25-1% flour, in line with the above.
// - King Arthur's only gluten-free test (6% flour) saw no difference. Gluten-free
//   blog recipes use about 5.5-8%, unmeasured, carried over from wheat bread
//   (5-10% of the flour there; more roux gave a denser crumb, and 20-40% yudane
//   lost volume).
// - A loaf baked near 7% came out dense with no oven spring.
// No controlled comparison of a flour tangzhong against a starch one exists.
export const TANGZHONG_PERCENT_MIN = 1;
export const TANGZHONG_PERCENT_MAX = 6;
export const TANGZHONG_PERCENT_DEFAULT = 2;

// A share from a stored setting or a stepper, held to the measured range.
export function clampTangzhongPercent(value) {
  const percent = parseInt(value, 10) || TANGZHONG_PERCENT_DEFAULT;
  return Math.min(TANGZHONG_PERCENT_MAX, Math.max(TANGZHONG_PERCENT_MIN, percent));
}

// Psyllium husk gels at 1:10 in water; when the remainder would leave under 10%
// of the base as free water to slurry the yeast, the gel drops to 1:8.
const PSYLLIUM_GEL_RATIO = 10;
const PSYLLIUM_GEL_RATIO_REDUCED = 8;
export const MIN_FREE_WATER_SHARE = 0.1;

// Gel water for `psylliumG` of husk weighed out separately, out of the water
// left after `fixedWater` (tangzhong, egg). `minFree` is the free water the
// yeast slurry needs, in the same unit. `reduced` tells the caller the 1:8 ratio
// was needed; `remainder` is the free water left after the gel.
export function psylliumGelWater(psylliumG, waterTotal, fixedWater, minFree) {
  let ratio = PSYLLIUM_GEL_RATIO;
  let gel = Math.round(psylliumG * ratio);
  let remainder = waterTotal - fixedWater - gel;
  const reduced = remainder < minFree;
  if (reduced) {
    ratio = PSYLLIUM_GEL_RATIO_REDUCED;
    gel = Math.round(psylliumG * ratio);
    remainder = waterTotal - fixedWater - gel;
  }
  return { gel, remainder, ratio, reduced };
}
