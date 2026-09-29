// Shared arithmetic for the recipe calculators. The rounding rules are the
// recipes' own: small amounts are weighed to a tenth of a gram, large ones to
// the gram, and spoon measures to the nearest quarter spoon.

// The count, batch or multiplier from the stepper, or null when there is
// nothing to calculate. Only whole numbers count ("2.7" pizzas is 2).
export function parseCount(value) {
  const count = parseInt(value, 10) || 0;
  return count > 0 ? count : null;
}

export function roundWhole(raw) {
  return Math.round(raw);
}

export function roundTenth(raw) {
  return Math.round(raw * 10) / 10;
}

// Below 20 g a scale reads tenths; above it a gram either way does not matter.
export function roundGrams(raw) {
  return raw < 20 ? roundTenth(raw) : roundWhole(raw);
}

// Spoons are measured to the quarter; less than a quarter is still a pinch worth adding.
export function roundSpoons(raw) {
  return Math.max(0.25, Math.round(raw * 4) / 4);
}

// Scales every amount of a base recipe by `ratio`, keeping the base's key order.
// `roundingFor` picks the rounding per key; anything unlisted is weighed in grams.
export function scaleAmounts(base, ratio, roundingFor = {}) {
  const result = {};
  Object.keys(base).forEach((key) => {
    const round = roundingFor[key] || roundGrams;
    result[key] = round(base[key] * ratio);
  });
  return result;
}

// Sum of an object's values in key order (the order matters for float drift).
export function sumOf(amounts) {
  return Object.keys(amounts).reduce((sum, key) => sum + amounts[key], 0);
}
