export default function cut(num: number) {
  const str = num.toString();
  const dividerIndex = str.indexOf('.');
  if (dividerIndex < 0) return num;
  const match = /[1-9]/.exec(str.slice(dividerIndex));
  if (!match) return num;
  const nonZeroIndex = match.index;
  const result = Number(str.slice(0, dividerIndex + nonZeroIndex + 1));
  return result;
}