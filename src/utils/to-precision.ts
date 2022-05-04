export function toPrecision(number: number, digits?: number) {
  if (digits && (digits < 0 || digits > 100)) throw new Error('toPrecision digits argument must be between 0 and 100');
  return digits ? Number(number.toFixed(digits)) : number;
}
