import Memoized from './src/memoize.js';
import minFuncs from './src/minFuncs.js';

const interval = [2, 6];
const eps = 0.002;

const f = (x) => -5 * x ** 2 * Math.E ** (-x / 2);
const df = (x) => 2.5 * (x - 4) * x ** Math.E ** (-x / 2);

const run = (minFunc) => {
  const df_memo = new Memoized(df);
  const { name } = minFunc;
  const x_m = minFunc(df_memo.call.bind(df_memo), eps, interval);
  const df_calls = Object.keys(df_memo.cache).length;
  return [
    name,
    `x*:\t\t${x_m}`,
    `f_m:\t\t${f(x_m)}`,
    `f'(x) calls:\t${df_calls}`,
  ].join('\n');
};

const results = minFuncs.map(run).join('\n\n');

console.log(results);
