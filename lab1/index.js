import minFuncs from './src/min-funcs.js';

const a = 1;
const b = 4;
const eps = 0.0005;
const f = (x) => x - 2 * Math.log(x);
const x_m = 2;

const run = (minFunc) => {
  const cache = {};
  const f_memo = (x) => {
    if (!cache[x]) {
      cache[x] = f(x);
    }
    return cache[x];
  };
  const { name } = minFunc;
  const x_mi = minFunc(a, b, eps, f_memo);
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
};

const results = minFuncs.map(run).join('\n\n');

console.log(results);
