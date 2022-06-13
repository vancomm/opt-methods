import Point from '../classes/point.js';
import Vector from '../classes/vector.js';
import pr from '../min-functions/polack-ribiere.js';
import dfp from '../min-functions/dfp.js';
import makeMessage from '../utils/make-message.js';
import memoize from '../utils/memoize.js';

function f(p: Point): number {
  const [x, y] = p;
  return x ** 4 - x * y + y ** 4 + 3 * x - 2 * y + 1;
}

function gradf(point: Point): Vector {
  const dfdx = (x: number, y: number): number => 4 * x ** 3 - y + 3;
  const dfdy = (x: number, y: number): number => -x + 4 * y ** 3 - 2;
  const [x, y] = point;
  return new Vector(dfdx(x, y), dfdy(x, y));
}

function runPR() {
  const f_memo = memoize(f, (arg) => arg.toString());
  const gf_memo = memoize(gradf);
  const x0 = new Point(1, 2);
  const [eps1, eps2] = [1e-5, 1e-5];
  const M = 1000;
  const x_min = pr(f_memo, gf_memo, x0, eps1, eps2, M);
  const messageParams = {
    name: 'polack-ribiere',
    x_min,
    f_min: f(x_min),
    fCalls: f_memo.cache.size,
    custom: {
      'grad calls': gf_memo.cache.size.toString(10),
    },
  };
  return makeMessage(messageParams);
}

function runDFP() {
  const f_memo = memoize(f, (arg) => arg.toString());
  const gf_memo = memoize(gradf);
  const x0 = new Point(2, 3);
  const eps = 1e-3;
  const x_min = dfp(f_memo, gf_memo, x0, eps);
  const messageParams = {
    name: 'davidson-fletcher-powell',
    x_min,
    f_min: f(x_min),
    fCalls: f_memo.cache.size,
    custom: {
      'grad calls': gf_memo.cache.size.toString(10),
    },
  };
  return makeMessage(messageParams);
}

export function run() {
  console.log(runPR());
  console.log();
  console.log(runDFP());
}