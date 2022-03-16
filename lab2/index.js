import minFuncs from './src/minFuncs.js';

const extType = 'max';
const interval = [2, 6];
const eps = 0.002;

const f = (x) => 5 * x ** 2 * Math.E ** (-x / 2);

const run = (minFunc) => {
  const cache = {};
  const f_memo = (x) => {
    if (!cache[x]) {
      cache[x] = f(x);
    }
    return cache[x];
  };
  const { name } = minFunc;
  const result = minFunc(f_memo, interval, eps, extType);
  const calls = Object.keys(cache).length;
  return [
    name,
    `result:\t\t${result}`,
    `calls\t\t${calls}`,
  ].join('\n');
};

const results = minFuncs.map(run).join('\n\n');

console.log(results);
