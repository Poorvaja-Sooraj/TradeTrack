export function isEmpty(value) {
  return value === undefined || value === null || value === "";
}

export function isPositiveNumber(value) {
  return typeof value === "number" && value > 0;
}
