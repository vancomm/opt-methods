import Point from '../classes/point.js';
import Vector from '../classes/vector.js';
import Matrix from '../classes/matrix.js';
import descent from '../min-functions/descent.js';
import steepest from '../min-functions/steepest.js';
import lm from '../min-functions/levenberg-marquardt.js';
import memoize from '../utils/memoize.js';
import makeMessage from '../utils/make-message.js';

function runDescent() {
  function f(point: Point): number {
    const [x, y] = point;
    return 3 * (x ** 2) + x * y + 2 * (y ** 2) - x - 4 * y;
  }

  function gradf(point: Point): Vector {
    const [x, y] = point;
    return new Vector((6 * x + y - 1), (x + 4 * y - 4));
  }

  const f_memo = memoize(f);

  const gf_memo = memoize(gradf);

  const x0: Point = new Point(2, 2);

  const eps1 = 0.0001;
  const eps2 = 0.0001;
  const gamma = 0.1;
  const M = 1000;

  const x_min = descent(f_memo, gf_memo, x0, eps1, eps2, gamma, M);
  const messageParams = {
    name: 'descent',
    x_min,
    f_min: f(x_min),
    fCalls: f_memo.cache.size,
    custom: {
      'grad calls': gf_memo.cache.size.toString(),
    },
  };
  return makeMessage(messageParams);
}

function runSteepest() {
  function f(point: Point): number {
    const [x, y] = point;
    return 3 * (x ** 2) + x * y + 2 * (y ** 2) - x - 4 * y;
  }

  function gradf(point: Point): Vector {
    const [x, y] = point;
    return new Vector((6 * x + y - 1), (x + 4 * y - 4));
  }

  const f_memo = memoize(f);

  const gf_memo = memoize(gradf);

  const x0: Point = new Point(2, 2);

  const eps1 = 0.0001;
  const eps2 = 0.0001;
  const gamma = 0.1;
  const M = 1000;

  const x_min = steepest(f_memo, gf_memo, x0, eps1, eps2, gamma, M);
  const messageParams = {
    name: 'steepest',
    x_min,
    f_min: f(x_min),
    fCalls: f_memo.cache.size,
    custom: {
      'grad calls': gf_memo.cache.size.toString(),
    },
  };
  return makeMessage(messageParams);
}

function runLM() {
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

  function hesse(point: Point): Matrix {
    const d2fdxdy = (x: number, y: number): number => -1;
    const d2fdx2 = (x: number, y: number): number => 12 * x ** 2;
    const d2fdy2 = (x: number, y: number): number => 12 * y ** 2;
    const [x, y] = point;
    const matrix = new Matrix(
      new Vector(d2fdx2(x, y), d2fdxdy(x, y)),
      new Vector(d2fdxdy(x, y), d2fdy2(x, y)),
    );
    return matrix;
  }

  const f_memo = memoize(f, (arg) => arg.toString());

  const gf_memo = memoize(gradf);

  const hesse_memo = memoize(hesse, (arg) => arg.toString());

  const x0 = new Point(2, 7);

  const eps1 = 1e-4;
  const mu0 = 1e1;
  const M = 1e3;

  const x_min = lm(f_memo, gf_memo, hesse_memo, x0, eps1, mu0, M);
  const messageParams = {
    name: 'leveberg-marquardt',
    x_min,
    f_min: f(x_min),
    fCalls: f_memo.cache.size,
    custom: {
      'grad calls': gf_memo.cache.size.toString(),
      'hesse calls': hesse_memo.cache.size.toString(),
    },
  };
  return makeMessage(messageParams);
}

export function run() {
  const results = [runDescent, runSteepest, runLM].map((r) => r());
  console.log(results.join('\n\n'));
}
