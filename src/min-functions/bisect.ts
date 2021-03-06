import { minArg } from '../utils/simple-min-max.js';

export default function bisect(f: (x: number) => number, eps: number, interval: [number, number]): number {
  const [a, b] = interval;
  const l = b - a;

  const x_m = (b + a) / 2;
  const x_1 = a + l / 4;
  const x_2 = b - l / 4;

  if (l <= eps) return minArg(f, x_1, x_m, x_2);

  if (f(x_1) < f(x_m)) return bisect(f, eps, [a, x_m]);

  if (f(x_2) < f(x_m)) return bisect(f, eps, [x_m, b]);

  return bisect(f, eps, [x_1, x_2]);
}
