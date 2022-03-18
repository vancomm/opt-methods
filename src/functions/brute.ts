import { get_x_min } from '../utils/index.js';

export function brute(f: (x: number) => number, eps: number, interval: [number, number]) {
  const [a, b] = interval;

  const n = Math.ceil((b - a) / eps);
  const step = (b - a) / n;

  const x_arr = [...Array(n + 1).keys()].map((i) => a + i * step);

  return get_x_min(f, ...x_arr);
}
