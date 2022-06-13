import range from '../utils/range.js';
import { minArg } from '../utils/simple-min-max.js';

export default function brute(f: (x: number) => number, eps: number, interval: [number, number]) {
  const [a, b] = interval;

  const n = Math.ceil((b - a) / eps);
  const step = (b - a) / n;

  const x_arr = range(n + 1).map((i) => a + i * step);

  return minArg(f, ...x_arr);
}
