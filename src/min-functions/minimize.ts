import { minArg } from '../utils/simple-min-max.js';

export default function minimize(f: (x: number) => number, x0: number, eps = 1e-4): number {
  const dx = eps * 10;

  function get_x_bar(x1: number, x2: number, x3: number) {
    const a_1 = (f(x2) - f(x1)) / (x2 - x1);
    const a_2 = (1 / (x3 - x2))
      * (((f(x3) - f(x1)) / (x3 - x1)) - ((f(x2) - f(x1)) / (x2 - x1)));

    return (x1 + x2) / 2 - a_1 / (2 * a_2);
  }

  let [x1, x2, x3] = (f(x0) > f(x0 + dx))
    ? [x0, x0 + dx, x0 + 2 * dx]
    : [x0, x0 + dx, x0 - dx];

  let x_m, x_bar, x: number;

  do {
    x_m = minArg(f, x1, x2, x3);

    x_bar = get_x_bar(x1, x2, x3);

    x = minArg(f, x_m, x_bar);

    [x1, x2, x3] = [x - dx, x, x + dx];
  } while (Math.abs(f(x_m) - f(x_bar)) <= eps && Math.abs(x_m - x_bar) <= eps);

  return x;
}
