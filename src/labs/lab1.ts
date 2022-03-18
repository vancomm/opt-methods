import { brute, bisect, parabola } from '../functions/index.js';
import { Memoized } from '../utils/index.js';

type Func = (x: number) => number
type MinFunc = (f: Func, eps: number, interval: [number, number]) => number

export function run() {
  const a = 1;
  const b = 4;
  const eps = 0.0005;
  const f = (x: number) => x - 2 * Math.log(x);
  const x_m = 2;

  function runFunc(minFunc: MinFunc) {
    const cache = {};
    const f_memo = new Memoized(f);
    const f_call = f_memo.call.bind(f_memo);
    const { name } = minFunc;
    const x_mi = minFunc(f_call, eps, [a, b]);
    const f_mi = f(x_mi);
    const calls = Object.keys(cache).length;
    return [
      name,
      `x_mi\t\t${x_mi}`,
      `f_mi\t\t${f_mi}`,
      `precision\t${eps}`,
      `success\t\t${eps > Math.abs(x_mi - x_m)}`,
      `calls\t\t${calls}`,
    ].join('\n');
  }

  const results = [brute, bisect, parabola].map(runFunc).join('\n\n');

  console.log(results);
}