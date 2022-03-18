export function midpoint(df: (x: number) => number, eps: number, interval: [number, number])
  : number {
  const [a, b] = interval;
  const x_m = (a + b) / 2;
  if (Math.abs(df(x_m)) <= eps) return x_m;
  if (df(x_m) > 0) return midpoint(df, eps, [a, x_m]);
  return midpoint(df, eps, [x_m, b]);
}
