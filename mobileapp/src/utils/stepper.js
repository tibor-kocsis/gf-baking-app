// The stepper keeps its value as typed text; these move it by one step.

export function stepUp(value, step) {
  return String((parseInt(value, 10) || 0) + step);
}

// Never steps below `min`, but leaves a smaller typed value alone.
export function stepDown(value, step, min) {
  const current = parseInt(value, 10) || 0;
  return current > min ? String(current - step) : value;
}

// Adds `key` to a list of picks, or takes it out if it is already there.
export function toggleInList(list, key) {
  return list.indexOf(key) === -1 ? list.concat(key) : list.filter((item) => item !== key);
}
