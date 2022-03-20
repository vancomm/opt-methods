import { brute, bisect, parabola } from './functions/index.js';
import { memoize } from './utils/index.js';

type Func = (x: number) => number
type MinFunc = (f: Func, eps: number, interval: [number, number]) => number

const a = 1;
const b = 4;
const eps = 0.0005;
const f = (x: number) => x - 2 * Math.log(x);
const x_m = 2;

function runFunc(minFunc: MinFunc) {
  const f_memo = memoize(f);
  const { name } = minFunc;
  const x_mi = minFunc(f_memo, eps, [a, b]);
  const f_mi = f(x_mi);
  const calls = f_memo.cache.size;
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
