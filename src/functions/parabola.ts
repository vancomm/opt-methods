import { minArg } from '../utils/index.js';

export function parabola(f: (x: number) => number, eps: number, interval: [number, number?]) {
  const [x0] = interval;
  const eps1 = eps;
  const eps2 = eps;
  const dx = 0.001;

  function get_x_bar(x1: number, x2: number, x3: number) {
    const a_1 = (f(x2) - f(x1)) / (x2 - x1);
    const a_2 = (1 / (x3 - x2))
      * (((f(x3) - f(x1)) / (x3 - x1)) - ((f(x2) - f(x1)) / (x2 - x1)));

    return (x1 + x2) / 2 - a_1 / (2 * a_2);
  }

  function iter(x1: number, x2: number, x3: number): number {
    const x_m = minArg(f, x1, x2, x3);
    const x_bar = get_x_bar(x1, x2, x3);

    const x = minArg(f, x_m, x_bar);

    if (Math.abs(f(x_m) - f(x_bar)) <= eps1 && Math.abs(x_m - x_bar) <= eps2) {
      return x;
    }
    return iter(x - dx, x, x + dx);
  }

  const x1 = x0;
  const x2 = x1 + dx;

  if (f(x1) > f(x2)) return iter(x1, x2, x1 + 2 * dx);
  return iter(x1 - dx, x1, x2);
}
