// Dough rules shared by pizza dough 2 and the flour mix calculator, so the two
// never drift apart on the same baking fact.

// Magura sorghum "unimix", back-calculated from the label. This is NOT a flour:
// every gram is decomposed into flour, starch and psyllium parts.
export const SORGHUM_UNIMIX = { sorghum: 0.48, tapioca: 0.47, psyllium: 0.05 };

// The 1:5 tangzhong ratio is a liquid ratio: grams of water per gram of flour.
export const TANGZHONG_WATER_RATIO = 5;

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
