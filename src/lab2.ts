import { midpoint, secant } from './functions/index.js';
import { memoize } from './utils/index.js';

type Func = (x: number) => number
type MinFunc = (f: Func, eps: number, interval: [number, number]) => number

const [a, b] = [2, 6];
const eps = 0.002;

const f = (x: number) => -5 * x ** 2 * Math.E ** (-x / 2);
const df = (x: number) => 2.5 * (x - 4) * x ** Math.E ** (-x / 2);

const runFunc = (minFunc: MinFunc) => {
  const df_memo = memoize(df);
  const { name } = minFunc;
  const x_m = minFunc(df_memo, eps, [a, b]);
  const df_calls = df_memo.cache.size;
  return [
    name,
    `x*:\t\t${x_m}`,
    `f_m:\t\t${f(x_m)}`,
    `f'(x) calls:\t${df_calls}`,
  ].join('\n');
};

const results = [midpoint, secant].map(runFunc).join('\n\n');

console.log(results);

