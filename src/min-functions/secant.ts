export default function secant(
  df: (x: number) => number,
  eps: number,
  interval: [number, number],
): number {
  const [a, b] = interval;
  if (df(a) * df(b) < 0) {
    const x_k = a - (df(a) / (df(a) - df(b))) * (a - b);
    if (Math.abs(df(x_k)) <= eps) return x_k;
    if (df(x_k) > 0) return secant(df, eps, [a, x_k]);
    return secant(df, eps, [x_k, b]);
  }
  if (df(a) > 0 && df(b) > 0) return a;
  if (df(a) < 0 && df(b) < 0) return b;
  return df(a) === 0
    ? a
    : b;
}
