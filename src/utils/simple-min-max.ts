export function minArg<T>(f: (x: T) => number, ...x_arr: T[]) {
  const fs = x_arr.map((x) => { return { arg: x, value: f(x) } });
  const sorted = fs.sort((a, b) => a.value - b.value);
  return sorted[0].arg;
}

export function maxArg<T>(f: (x: T) => number, ...x_arr: T[]) {
  const fs = x_arr.map((x) => { return { arg: x, value: f(x) } });
  const sorted = fs.sort((a, b) => b.value - a.value);
  return sorted[0].arg;
}
