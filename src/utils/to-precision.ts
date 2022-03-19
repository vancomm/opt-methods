export function toPrecision(number: number, precision: number) {
  const string = number.toFixed(precision);
  return Number(string);
}
