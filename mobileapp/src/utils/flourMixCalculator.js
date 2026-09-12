// Flour mix calculation logic
//
// Solves a gluten-free bread blend from the ingredients the baker actually has
// at home. The batch size is the flour + starch weight, which is the 100%
// reference for every baker's percentage below.
//
// The hard part is that the targets contradict each other for some cupboards.
// With only potato and tapioca on hand, potato wants to stay at or below 45% of
// the starch (it gelatinises at 58-65 C with a very high peak viscosity, so it
// sets the crumb before the oven spring window closes) while tapioca wants to
// stay at or below 50% - and the two shares have to add up to 100%. One of them
// must give. The solver therefore picks the least-bad blend and reports every
// cap it had to relax, rather than silently exceeding one.

export const FLOUR_KEYS = ['sorghum', 'millet', 'brownRice'];
export const STARCH_KEYS = ['potato', 'tapioca', 'corn'];
export const STYLE_KEYS = ['sandwich', 'rustic', 'softRoll'];

// Magura sorghum "unimix", back-calculated from the label. This is NOT a flour:
// every gram is decomposed into the flour, starch and psyllium totals, and only
// the flour + starch part (95%) counts toward the batch base.
const UNIMIX = { sorghum: 0.48, tapioca: 0.47, psyllium: 0.05 };

const STYLE_FLOUR_SHARE = { sandwich: 0.65, rustic: 0.7, softRoll: 0.6 };
const FLOUR_SHARE_MIN = 0.6;
const FLOUR_SHARE_MAX = 0.7;

// Share of its own fraction one ingredient may hold. Only applied when the
// fraction has two or more sources, unimix-derived ones included.
const FLOUR_CAPS = { sorghum: 0.6, brownRice: 0.6, millet: 0.35 };
const STARCH_CAPS = { potato: 0.45, tapioca: 0.5, corn: 0.5 };

// Preference weights for filling what is left of a fraction. Sorghum is the
// neutral workhorse; corn is the late-gelatinising starch worth the most room.
const FLOUR_WEIGHTS = { sorghum: 3, brownRice: 2, millet: 1 };
const STARCH_WEIGHTS = { corn: 3, tapioca: 2, potato: 1 };

// Who absorbs grams no cap could take. Potato is last on purpose.
const FLOUR_ABSORB_ORDER = ['sorghum', 'brownRice', 'millet'];
const STARCH_ABSORB_ORDER = ['tapioca', 'corn', 'potato'];

// Whole psyllium husk, not powder: the husk hydrates more slowly and builds less
// structure per gram, so the dose runs about 1.5x the figure usually quoted for
// powder (3% target, 2.5-3.5% band).
const PSYLLIUM_TARGET = 0.045;
const PSYLLIUM_MIN = 0.0375;
const PSYLLIUM_MAX = 0.0525;

const BASE_HYDRATION = 0.85;
const TANGZHONG_FLOUR_SHARE = 0.07;
const TANGZHONG_WATER_RATIO = 5;
const PSYLLIUM_GEL_RATIO = 10;
const PSYLLIUM_GEL_RATIO_REDUCED = 8;
const MIN_REMAINDER_SHARE = 0.1;
const MAX_PSYLLIUM_HYDRATION_BUMP = 0.075;

// How far ahead of the other starches corn has to sit to count as the largest
// share once everything is rounded to whole grams.
const CORN_LEAD_MARGIN = 0.01;

// Percent of the base, all of them outside the flour + starch reference.
const ADDITIONS = { salt: 0.02, honey: 0.02, oil: 0.04, freshYeast: 0.025, vinegar: 0.01 };
const DRY_YEAST_DIVISOR = 3;

const EPS = 1e-9;

// Rounds a value to the nearest multiple of `step` (e.g. roundTo(174, 5) === 175)
function roundTo(value, step) {
  return Math.round(value / step) * step;
}

// Distributes `amount` across `sources` in proportion to their preference
// weights, clipping each at its remaining room and handing the clipped surplus
// to the sources that still have headroom. Returns whatever could not be
// placed, which the caller gives to an absorber (or reports as a shortfall).
function distribute(amount, sources) {
  const placed = {};
  sources.forEach((source) => {
    placed[source.key] = 0;
  });

  let remaining = amount;
  let open = sources.filter((source) => source.room > EPS);

  while (remaining > EPS && open.length > 0) {
    const totalWeight = open.reduce((sum, source) => sum + source.weight, 0);
    const stillOpen = [];
    let placedThisPass = 0;

    open.forEach((source) => {
      const want = remaining * (source.weight / totalWeight);
      const room = source.room - placed[source.key];
      const give = Math.min(want, room);
      placed[source.key] += give;
      placedThisPass += give;
      if (room - give > EPS) {
        stillOpen.push(source);
      }
    });

    if (placedThisPass <= EPS) break;
    remaining -= placedThisPass;
    open = stillOpen;
  }

  return { placed, unplaced: Math.max(0, remaining) };
}

// Fills one fraction (flour or starch) up to `target`, given what the unimix
// already contributed to one of its ingredients.
function fillFraction(target, keys, caps, weights, absorbOrder, capsActive, preplaced) {
  const amounts = {};
  keys.forEach((key) => {
    amounts[key] = 0;
  });
  Object.keys(preplaced).forEach((key) => {
    amounts[key] = (amounts[key] || 0) + preplaced[key];
  });

  const already = Object.keys(preplaced).reduce((sum, key) => sum + preplaced[key], 0);
  const toPlace = Math.max(0, target - already);

  const sources = keys.map((key) => ({
    key,
    weight: weights[key],
    room: Math.max(0, (capsActive ? caps[key] * target : target) - (amounts[key] || 0)),
  }));

  const { placed, unplaced } = distribute(toPlace, sources);
  const plain = {};
  keys.forEach((key) => {
    amounts[key] += placed[key];
    plain[key] = placed[key];
  });

  // Grams no cap could take go to the least harmful ingredient on hand.
  let shortfall = unplaced;
  if (shortfall > EPS && keys.length > 0) {
    const absorber = absorbOrder.find((key) => keys.indexOf(key) !== -1);
    if (absorber) {
      amounts[absorber] += shortfall;
      plain[absorber] += shortfall;
      shortfall = 0;
    }
  }

  return { amounts, plain, shortfall };
}

// Builds one candidate blend for a given flour:starch split and unimix weight.
function buildCandidate(ctx, flourShare, unimixWeight) {
  const { base, flours, starches, psylliumAvailable, styleFlourShare } = ctx;
  const { flourCapsActive, starchCapsActive } = ctx;

  const unimixSorghum = unimixWeight * UNIMIX.sorghum;
  const unimixTapioca = unimixWeight * UNIMIX.tapioca;
  const unimixPsyllium = unimixWeight * UNIMIX.psyllium;

  const starchTarget = base * (1 - flourShare);

  // Starch first: the unimix drags tapioca in at a fixed rate, so the rest of
  // the starch fraction has to be built around it.
  const starchFill = fillFraction(
    starchTarget,
    starches,
    STARCH_CAPS,
    STARCH_WEIGHTS,
    STARCH_ABSORB_ORDER,
    starchCapsActive,
    unimixTapioca > EPS ? { tapioca: unimixTapioca } : {}
  );
  const starchTotal = STARCH_KEYS.reduce((sum, key) => sum + (starchFill.amounts[key] || 0), 0);

  // Whatever the starch fraction could not take stays with the flour, so the
  // two fractions always add up to the requested base.
  const flourTarget = base - starchTotal;
  if (flourTarget <= EPS || unimixSorghum > flourTarget + EPS) return null;

  const flourFill = fillFraction(
    flourTarget,
    flours,
    FLOUR_CAPS,
    FLOUR_WEIGHTS,
    FLOUR_ABSORB_ORDER,
    flourCapsActive,
    unimixSorghum > EPS ? { sorghum: unimixSorghum } : {}
  );
  const flourTotal = FLOUR_KEYS.reduce((sum, key) => sum + (flourFill.amounts[key] || 0), 0);
  if (flourTotal <= EPS) return null;

  // Psyllium: 3% target, minus whatever the mix already brought.
  const psylliumTargetG = base * PSYLLIUM_TARGET;
  const psylliumOverBand = unimixPsyllium > base * PSYLLIUM_MAX + EPS;
  const psylliumAdded =
    psylliumAvailable && !psylliumOverBand ? Math.max(0, psylliumTargetG - unimixPsyllium) : 0;
  const psylliumTotal = unimixPsyllium + psylliumAdded;

  const shares = {};
  FLOUR_KEYS.forEach((key) => {
    shares[key] = (flourFill.amounts[key] || 0) / flourTotal;
  });
  STARCH_KEYS.forEach((key) => {
    shares[key] = starchTotal > EPS ? (starchFill.amounts[key] || 0) / starchTotal : 0;
  });

  // Score: lower is better. The weights rank the caps by physical consequence -
  // a potato overshoot costs ten times what any other overshoot costs, because
  // it is the one that kills the rise.
  let potatoOvershoot = 0;
  let otherOvershoots = 0;
  const relaxed = [];

  const checkCap = (key, cap, capsActive, fraction) => {
    if (!capsActive) return;
    const overshoot = shares[key] - cap;
    if (overshoot > 0.0005) {
      relaxed.push({ key, fraction, share: shares[key], cap, overshoot });
      if (key === 'potato') potatoOvershoot += overshoot;
      else otherOvershoots += overshoot;
    }
  };
  FLOUR_KEYS.forEach((key) => {
    if (flourFill.amounts[key] > EPS) checkCap(key, FLOUR_CAPS[key], flourCapsActive, 'flour');
  });
  STARCH_KEYS.forEach((key) => {
    if (starchFill.amounts[key] > EPS) checkCap(key, STARCH_CAPS[key], starchCapsActive, 'starch');
  });

  // Corn is the preferred late-gelatinising starch: when it is on hand it
  // should hold the largest single share, by a wide enough margin to survive
  // rounding to whole grams.
  let cornNotLargest = 0;
  if (starches.indexOf('corn') !== -1 && starchTotal > EPS) {
    ['tapioca', 'potato'].forEach((key) => {
      const wanted = Math.min(STARCH_CAPS.corn, shares[key] + CORN_LEAD_MARGIN);
      cornNotLargest += Math.max(0, wanted - shares.corn);
    });
  }

  // Grams no ingredient on hand could supply. A candidate that leaves the batch
  // short is barely an answer at all, so this outranks every other term.
  const shortfall = (flourFill.shortfall + starchFill.shortfall) / base;
  const psylliumExcess = Math.max(0, unimixPsyllium - base * PSYLLIUM_MAX) / base;
  const psylliumDeviation = Math.abs(psylliumTotal - psylliumTargetG) / base;
  const actualFlourShare = flourTotal / (flourTotal + starchTotal);
  const ratioDeviation = Math.abs(actualFlourShare - styleFlourShare);

  const score =
    5000 * shortfall +
    1000 * potatoOvershoot +
    100 * otherOvershoots +
    2000 * psylliumExcess +
    300 * psylliumDeviation +
    100 * cornNotLargest +
    200 * ratioDeviation +
    0.00001 * (ctx.unimixMax - unimixWeight);

  return {
    score,
    shortfall,
    unimixWeight,
    unimixSorghum,
    unimixTapioca,
    unimixPsyllium,
    flourAmounts: flourFill.amounts,
    starchAmounts: starchFill.amounts,
    flourPlain: flourFill.plain,
    starchPlain: starchFill.plain,
    flourTotal,
    starchTotal,
    flourCapsActive,
    starchCapsActive,
    shares,
    relaxed,
    psylliumAdded,
    psylliumTotal,
    psylliumOverBand,
  };
}

// Searches the unimix weight coarsely, then refines around the best value.
function solve(ctx, flourShares) {
  let best = null;
  const consider = (flourShare, unimixWeight) => {
    const candidate = buildCandidate(ctx, flourShare, unimixWeight);
    if (candidate && (!best || candidate.score < best.score - EPS)) {
      best = Object.assign({ flourShare }, candidate);
    }
  };

  flourShares.forEach((flourShare) => {
    if (ctx.unimixMax <= 0) {
      consider(flourShare, 0);
      return;
    }
    for (let weight = 0; weight <= ctx.unimixMax; weight += 5) {
      consider(flourShare, weight);
    }
    consider(flourShare, ctx.unimixMax);
  });

  if (best && ctx.unimixMax > 0) {
    const around = best.unimixWeight;
    const from = Math.max(0, Math.floor(around) - 5);
    const to = Math.min(ctx.unimixMax, Math.ceil(around) + 5);
    for (let weight = from; weight <= to; weight += 1) {
      consider(best.flourShare, weight);
    }
  }

  return best;
}

// Rounds the parts of a fraction to whole grams, absorbing the rounding drift
// in the largest adjustable line so the parts sum exactly to the total.
function roundParts(parts, target) {
  const rounded = parts.map((part) => ({ ...part, amount: Math.round(part.amount) }));
  const sum = rounded.reduce((total, part) => total + part.amount, 0);
  const drift = target - sum;
  if (drift !== 0) {
    const adjustable = rounded.filter((part) => part.adjustable && part.amount > 0);
    const candidates = adjustable.length > 0 ? adjustable : rounded.filter((part) => part.amount > 0);
    if (candidates.length > 0) {
      const largest = candidates.reduce((a, b) => (b.amount > a.amount ? b : a));
      largest.amount += drift;
    }
  }
  return rounded;
}

// Counts the distinct ingredients a fraction is built from, folding in the one
// the unimix contributes.
function distinctCount(keys, fromUnimix) {
  const seen = keys.slice();
  if (fromUnimix && seen.indexOf(fromUnimix) === -1) seen.push(fromUnimix);
  return seen.length;
}

function pct(value, total) {
  return total > EPS ? Math.round((value / total) * 1000) / 10 : 0;
}

export function calculateFlourMix(options) {
  const settings = options || {};
  const base = parseInt(settings.batchSizeG, 10) || 0;
  const unimixAvailable = !!settings.unimixAvailable;
  const psylliumAvailable = !!settings.psylliumAvailable;
  const wantsTangzhong = !!settings.tangzhong;
  const flours = FLOUR_KEYS.filter((key) => (settings.floursAvailable || []).indexOf(key) !== -1);
  const starches = STARCH_KEYS.filter(
    (key) => (settings.starchesAvailable || []).indexOf(key) !== -1
  );
  const style = STYLE_KEYS.indexOf(settings.targetStyle) !== -1 ? settings.targetStyle : 'sandwich';

  if (!unimixAvailable && flours.length === 0) return { error: 'noFlourSource' };
  if (base <= 0) return null;

  const notes = [];
  const styleFlourShare = STYLE_FLOUR_SHARE[style];

  // Which starches end up in the blend at all - the unimix always brings tapioca.
  const effectiveStarches = starches.slice();
  if (unimixAvailable && effectiveStarches.indexOf('tapioca') === -1) {
    effectiveStarches.push('tapioca');
  }

  // Single-starch overrides, and the cupboard with no starch at all.
  let flourShares;
  if (effectiveStarches.length === 0) {
    flourShares = [1];
    notes.push({ key: 'noStarch' });
  } else if (effectiveStarches.length === 1 && effectiveStarches[0] === 'potato') {
    flourShares = [0.7];
    notes.push({ key: 'singleStarchPotato' });
  } else {
    flourShares = [];
    for (let share = FLOUR_SHARE_MIN; share <= FLOUR_SHARE_MAX + EPS; share += 0.01) {
      flourShares.push(Math.round(share * 100) / 100);
    }
  }

  // Caps are activated by the cupboard, not by the solve: deciding this per
  // candidate would let the solver dodge a cap by leaving the unimix out, since
  // dropping to a single source is what switches the cap off.
  const ctx = {
    base,
    flours,
    starches,
    psylliumAvailable,
    styleFlourShare,
    flourCapsActive: distinctCount(flours, unimixAvailable ? 'sorghum' : null) >= 2,
    starchCapsActive: distinctCount(starches, unimixAvailable ? 'tapioca' : null) >= 2,
    // Enough unimix to build the whole base out of the mix alone, which a
    // unimix-only cupboard needs; the psyllium ceiling is scored, not hard.
    unimixMax: unimixAvailable ? Math.ceil(base / (UNIMIX.sorghum + UNIMIX.tapioca)) : 0,
  };

  const best = solve(ctx, flourShares);
  if (!best) return null;

  // Whole grams. The unimix is a weighed line, so round it first and let the
  // plain flours and starches absorb the drift.
  const unimixWeight = Math.round(best.unimixWeight);
  const unimixSorghum = unimixWeight * UNIMIX.sorghum;
  const unimixTapioca = unimixWeight * UNIMIX.tapioca;
  const unimixPsyllium = unimixWeight * UNIMIX.psyllium;

  const flourTargetG = Math.round(best.flourTotal);
  const starchTargetG = base - flourTargetG;

  const flourParts = roundParts(
    [{ key: 'unimixSorghum', amount: unimixSorghum, adjustable: false }].concat(
      flours.map((key) => ({ key, amount: best.flourPlain[key] || 0, adjustable: true }))
    ),
    flourTargetG
  );
  const starchParts = roundParts(
    [{ key: 'unimixTapioca', amount: unimixTapioca, adjustable: false }].concat(
      starches.map((key) => ({ key, amount: best.starchPlain[key] || 0, adjustable: true }))
    ),
    starchTargetG
  );

  const amountOf = (parts, key) => {
    const part = parts.find((entry) => entry.key === key);
    return part ? part.amount : 0;
  };
  const flourTotal = flourParts.reduce((sum, part) => sum + part.amount, 0);
  const starchTotal = starchParts.reduce((sum, part) => sum + part.amount, 0);
  const baseTotal = flourTotal + starchTotal;

  const psylliumFromMix = Math.round(unimixPsyllium);
  const psylliumAdded = Math.round(best.psylliumAdded);
  const psylliumTotal = psylliumFromMix + psylliumAdded;
  const psylliumShare = psylliumTotal / baseTotal;

  // The tangzhong flour comes out of the plain flour fraction - brown rice
  // first, then plain sorghum. Never from the unimix: forcing the mix's
  // psyllium through a boil gives a stiff, non-yielding gel, which is a common
  // cause of a loaf that neither rises nor collapses in the oven.
  const tangzhongFlour = [];
  let tangzhongFlourTotal = 0;
  if (wantsTangzhong) {
    let wanted = Math.round(base * TANGZHONG_FLOUR_SHARE);
    ['brownRice', 'sorghum'].forEach((key) => {
      if (wanted <= 0) return;
      const available = amountOf(flourParts, key);
      const take = Math.min(wanted, available);
      if (take > 0) {
        tangzhongFlour.push({ key, amount: take });
        tangzhongFlourTotal += take;
        wanted -= take;
      }
    });
    if (tangzhongFlourTotal === 0) {
      notes.push({ key: 'tangzhongNoPlainFlour' });
    } else if (wanted > 0) {
      notes.push({ key: 'tangzhongScaledDown', params: { amount: tangzhongFlourTotal } });
    }
  }
  const tangzhongActive = tangzhongFlourTotal > 0;

  const flourShareOf = (key) => (flourTotal > EPS ? amountOf(flourParts, key) / flourTotal : 0);
  const starchShareOf = (key) => (starchTotal > EPS ? amountOf(starchParts, key) / starchTotal : 0);
  const brownRiceShare = flourShareOf('brownRice');
  const milletShare = flourShareOf('millet');
  const potatoShare = starchShareOf('potato');
  const sorghumShare =
    flourTotal > EPS
      ? (amountOf(flourParts, 'unimixSorghum') + amountOf(flourParts, 'sorghum')) / flourTotal
      : 0;
  const tapiocaShare =
    starchTotal > EPS
      ? (amountOf(starchParts, 'unimixTapioca') + amountOf(starchParts, 'tapioca')) / starchTotal
      : 0;

  // Hydration: 85% and the documented adjustments. The psyllium term is applied
  // proportionally rather than in steps so the stepper does not jump.
  let hydration = BASE_HYDRATION;
  if (brownRiceShare > 0.4) hydration += 0.03;
  if (milletShare > 0.25) hydration -= 0.02;
  if (potatoShare > 0.4) hydration -= 0.03;
  if (tangzhongActive) hydration += 0.03;
  if (psylliumShare > PSYLLIUM_TARGET) {
    // +5% for each 0.5% above target, capped at the band's own headroom: past
    // 5.25% the psyllium is already flagged and more water stops helping.
    hydration += Math.min(
      MAX_PSYLLIUM_HYDRATION_BUMP,
      0.05 * ((psylliumShare - PSYLLIUM_TARGET) / 0.005)
    );
  }

  const psylliumWeak = !psylliumAvailable && psylliumShare < PSYLLIUM_MIN;
  if (psylliumWeak) hydration -= 0.05;

  const waterTotal = Math.round(hydration * baseTotal);
  const tangzhongWater = Math.round(tangzhongFlourTotal * TANGZHONG_WATER_RATIO);

  // Psyllium gel at 1:10, dropping to 1:8 when the remainder would leave too
  // little free water to slurry the yeast and bring the dough together.
  // Only the husk weighed out separately can be gelled: the unimix's psyllium is
  // already dispersed through its flour and starch, so it hydrates from the
  // mixing water instead and must not be counted into the gel.
  let gelRatio = PSYLLIUM_GEL_RATIO;
  let psylliumGel = Math.round(psylliumAdded * gelRatio);
  let remainder = waterTotal - tangzhongWater - psylliumGel;
  const minRemainder = baseTotal * MIN_REMAINDER_SHARE;
  if (remainder < minRemainder) {
    gelRatio = PSYLLIUM_GEL_RATIO_REDUCED;
    psylliumGel = Math.round(psylliumAdded * gelRatio);
    remainder = waterTotal - tangzhongWater - psylliumGel;
    notes.push({ key: 'gelRatioReduced' });
    if (remainder < minRemainder) {
      psylliumGel = Math.max(0, Math.round(waterTotal - tangzhongWater - minRemainder));
      remainder = waterTotal - tangzhongWater - psylliumGel;
      notes.push({ key: 'gelRatioCapped' });
    }
  }
  const waterStreams = roundParts(
    [
      { key: 'tangzhong', amount: tangzhongWater, adjustable: false },
      { key: 'psylliumGel', amount: psylliumGel, adjustable: false },
      { key: 'remainder', amount: remainder, adjustable: true },
    ],
    waterTotal
  );

  // Notes, most consequential first, trimmed to the four the output allows.
  const shareOfFraction = (entry) => {
    if (entry.fraction === 'starch') {
      return entry.key === 'tapioca' ? tapiocaShare : starchShareOf(entry.key);
    }
    return entry.key === 'sorghum' ? sorghumShare : flourShareOf(entry.key);
  };
  const relaxedCaps = best.relaxed.map((entry) => {
    const share = Math.round(shareOfFraction(entry) * 100);
    const cap = Math.round(entry.cap * 100);
    return { key: entry.key, fraction: entry.fraction, share, cap, excess: Math.max(1, share - cap) };
  });

  const relaxedStarch = best.relaxed.filter((entry) => entry.fraction === 'starch');
  const relaxedFlour = best.relaxed.filter((entry) => entry.fraction === 'flour');
  const potatoAtCap = potatoShare >= STARCH_CAPS.potato - 0.01 && potatoShare > EPS;

  relaxedStarch.forEach((entry) => {
    const share = Math.round(starchShareOf(entry.key) * 100) || Math.round(entry.share * 100);
    const params = {
      share: entry.key === 'tapioca' ? Math.round(tapiocaShare * 100) : share,
      cap: Math.round(entry.cap * 100),
      potatoShare: Math.round(potatoShare * 100),
    };
    params.excess = Math.max(1, params.share - params.cap);
    notes.push({
      key: entry.key === 'potato' ? 'potatoOverCap' : potatoAtCap ? 'starchOverCapForPotato' : 'starchOverCap',
      ingredientKey: STARCH_INGREDIENT_KEYS[entry.key],
      params,
    });
  });

  relaxedFlour.forEach((entry) => {
    const share = Math.round(
      (entry.key === 'sorghum' ? sorghumShare : flourShareOf(entry.key)) * 100
    );
    notes.push({
      key: entry.key === 'brownRice' ? 'brownRiceOverCap' : 'flourOverCap',
      ingredientKey: FLOUR_INGREDIENT_KEYS[entry.key],
      params: { share, cap: Math.round(entry.cap * 100) },
    });
  });

  const flourSharePct = Math.round((flourTotal / baseTotal) * 100);
  if (starchTotal > 0 && (flourSharePct < 60 || flourSharePct > 70)) {
    notes.push({
      key: 'ratioOutOfBand',
      params: { flour: flourSharePct, starch: 100 - flourSharePct },
    });
  }
  if (psylliumWeak) notes.push({ key: 'psylliumWeak' });
  if (best.psylliumOverBand) {
    notes.push({
      key: 'psylliumFromMixOnly',
      params: { percent: Math.round(psylliumShare * 1000) / 10 },
    });
  }
  if (effectiveStarches.length === 1 && effectiveStarches[0] === 'tapioca') {
    notes.push({ key: 'tapiocaGummy' });
  }
  if (tapiocaShare > 0.5) notes.push({ key: 'tapiocaBake' });
  if (brownRiceShare > 0.4 && !relatedNote(notes, 'brownRiceOverCap')) {
    notes.push({ key: 'brownRiceRest', params: { share: Math.round(brownRiceShare * 100) } });
  }
  if (milletShare >= FLOUR_CAPS.millet - 0.005) notes.push({ key: 'milletCapped' });
  if (tangzhongActive) {
    notes.push({
      key: 'tangzhongSource',
      ingredientKey: FLOUR_INGREDIENT_KEYS[tangzhongFlour[0].key],
      params: { amount: tangzhongFlourTotal, water: amountOf(waterStreams, 'tangzhong') },
    });
  }

  const flourBreakdown = [];
  if (amountOf(flourParts, 'unimixSorghum') > 0 || amountOf(flourParts, 'sorghum') > 0) {
    flourBreakdown.push({
      key: 'sorghum',
      amount: amountOf(flourParts, 'unimixSorghum') + amountOf(flourParts, 'sorghum'),
      fromMix: amountOf(flourParts, 'unimixSorghum'),
      percent: pct(amountOf(flourParts, 'unimixSorghum') + amountOf(flourParts, 'sorghum'), flourTotal),
    });
  }
  ['brownRice', 'millet'].forEach((key) => {
    const amount = amountOf(flourParts, key);
    if (amount > 0) {
      flourBreakdown.push({ key, amount, fromMix: 0, percent: pct(amount, flourTotal) });
    }
  });

  const starchBreakdown = [];
  if (amountOf(starchParts, 'unimixTapioca') > 0 || amountOf(starchParts, 'tapioca') > 0) {
    starchBreakdown.push({
      key: 'tapioca',
      amount: amountOf(starchParts, 'unimixTapioca') + amountOf(starchParts, 'tapioca'),
      fromMix: amountOf(starchParts, 'unimixTapioca'),
      percent: pct(amountOf(starchParts, 'unimixTapioca') + amountOf(starchParts, 'tapioca'), starchTotal),
    });
  }
  ['corn', 'potato'].forEach((key) => {
    const amount = amountOf(starchParts, key);
    if (amount > 0) {
      starchBreakdown.push({ key, amount, fromMix: 0, percent: pct(amount, starchTotal) });
    }
  });

  flourBreakdown.sort((a, b) => b.amount - a.amount);
  starchBreakdown.sort((a, b) => b.amount - a.amount);

  const weighed = [];
  if (unimixWeight > 0) {
    weighed.push({ key: 'unimix', group: 'flour', amount: unimixWeight, percent: pct(unimixWeight, baseTotal) });
  }
  flours.forEach((key) => {
    const amount = amountOf(flourParts, key);
    if (amount > 0) weighed.push({ key, group: 'flour', amount, percent: pct(amount, baseTotal) });
  });
  starches.forEach((key) => {
    const amount = amountOf(starchParts, key);
    if (amount > 0) weighed.push({ key, group: 'starch', amount, percent: pct(amount, baseTotal) });
  });
  if (psylliumAdded > 0) {
    weighed.push({
      key: 'psylliumHusk',
      group: 'psyllium',
      amount: psylliumAdded,
      percent: pct(psylliumAdded, baseTotal),
    });
  }
  weighed.push({ key: 'water', group: 'liquid', amount: waterTotal, percent: pct(waterTotal, baseTotal), unit: 'ml' });

  const additions = {};
  Object.keys(ADDITIONS).forEach((key) => {
    const raw = ADDITIONS[key] * baseTotal;
    additions[key] = raw < 20 ? Math.round(raw * 10) / 10 : Math.round(raw);
  });
  weighed.push({ key: 'oil', group: 'liquid', amount: additions.oil, percent: ADDITIONS.oil * 100 });
  ['salt', 'honey', 'freshYeast', 'vinegar'].forEach((key) => {
    weighed.push({ key, group: 'addition', amount: additions[key], percent: ADDITIONS[key] * 100 });
  });

  return {
    base: baseTotal,
    requestedBase: base,
    style,
    flourTotal,
    starchTotal,
    flourPercent: Math.round((flourTotal / baseTotal) * 100),
    starchPercent: 100 - Math.round((flourTotal / baseTotal) * 100),
    inBand:
      flourTotal / baseTotal >= FLOUR_SHARE_MIN - 0.005 &&
      flourTotal / baseTotal <= FLOUR_SHARE_MAX + 0.005,
    onStyleTarget: Math.abs(flourTotal / baseTotal - styleFlourShare) < 0.005,
    unimix: unimixWeight,
    weighed,
    flourBreakdown,
    starchBreakdown,
    psyllium: {
      total: psylliumTotal,
      fromMix: psylliumFromMix,
      added: psylliumAdded,
      percent: Math.round(psylliumShare * 1000) / 10,
    },
    hydration: Math.round(hydration * 1000) / 10,
    water: {
      total: waterTotal,
      tangzhong: amountOf(waterStreams, 'tangzhong'),
      psylliumGel: amountOf(waterStreams, 'psylliumGel'),
      remainder: amountOf(waterStreams, 'remainder'),
      gelRatio,
    },
    tangzhong: tangzhongActive
      ? { flour: tangzhongFlour, flourTotal: tangzhongFlourTotal, water: amountOf(waterStreams, 'tangzhong') }
      : null,
    additions,
    relaxedCaps,
    flags: {
      potatoAtCap: potatoAtCap && !relaxedCaps.some((entry) => entry.key === 'potato'),
      milletCapped: milletShare >= FLOUR_CAPS.millet - 0.005,
      brownRiceRest: brownRiceShare > 0.4,
    },
    dryYeast: Math.round((additions.freshYeast / DRY_YEAST_DIVISOR) * 10) / 10,
    notes: notes.slice(0, 4),
  };
}

const FLOUR_INGREDIENT_KEYS = {
  sorghum: 'ingredients.sorghumFlour',
  brownRice: 'ingredients.brownRiceFlour',
  millet: 'ingredients.milletFlour',
};

const STARCH_INGREDIENT_KEYS = {
  potato: 'ingredients.potatoStarch',
  tapioca: 'ingredients.tapiocaStarch',
  corn: 'ingredients.cornStarch',
};

export const FLOUR_MIX_INGREDIENT_KEYS = {
  unimix: 'ingredients.sorghumUnimix',
  sorghum: FLOUR_INGREDIENT_KEYS.sorghum,
  brownRice: FLOUR_INGREDIENT_KEYS.brownRice,
  millet: FLOUR_INGREDIENT_KEYS.millet,
  potato: STARCH_INGREDIENT_KEYS.potato,
  tapioca: STARCH_INGREDIENT_KEYS.tapioca,
  corn: STARCH_INGREDIENT_KEYS.corn,
  psylliumHusk: 'ingredients.psylliumHusk',
  water: 'ingredients.water',
  oil: 'ingredients.oil',
  salt: 'ingredients.salt',
  honey: 'ingredients.honey',
  freshYeast: 'ingredients.freshYeast',
  vinegar: 'ingredients.ciderVinegar',
};

function relatedNote(notes, key) {
  return notes.some((note) => note.key === key);
}
