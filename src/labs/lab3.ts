import Point from '../classes/point.js';
import Vector from '../classes/vector.js';
import Matrix from '../classes/matrix.js';
import descent from '../min-functions/descent.js';
import steepest from '../min-functions/steepest.js';
import lm from '../min-functions/levenberg-marquardt.js';
import memoize from '../utils/memoize.js';
import toPrecision from '../utils/to-precision.js';

function makeMessage(
  name: string,
  x_m: Point,
  f: (point: Point) => number,
  callsF: number,
  callsGradF: number,
  callsHesse?: number
): string {
  const precision = 4;
  const [x, y] = x_m;
  const message = [
    `${name}`,
    `x_m:\t\t(${toPrecision(x, precision)}, ${toPrecision(y, precision)})`,
    `f(x_m):\t\t${toPrecision(f(x_m), 4)}`,
    `f calls:\t${callsF}`,
    `grad calls:\t${callsGradF}`,
  ].join('\n');
  if (callsHesse) return message.concat(`\nhesse calls:\t${callsHesse}`);
  return message;
}

function f(point: Point): number {
  const [x, y] = point;
  return 3 * (x ** 2) + x * y + 2 * (y ** 2) - x - 4 * y;
}

function gradf(point: Point): Vector {
  const [x, y] = point;
  return new Vector((6 * x + y - 1), (x + 4 * y - 4));
}

function runDescent() {
  const f_memo = memoize(f);

  const gf_memo = memoize(gradf);

  const x0: Point = new Point(2, 2);

  const eps1 = 0.0001;
  const eps2 = 0.0001;
  const gamma = 0.1;
  const M = 1000;

  const x_m = descent(f_memo, gf_memo, x0, eps1, eps2, gamma, M);

  return makeMessage('descent', x_m, f, f_memo.cache.size, gf_memo.cache.size);
}

function runSteepest() {
  const f_memo = memoize(f);

  const gf_memo = memoize(gradf);

  const x0: Point = new Point(2, 2);

  const eps1 = 0.0001;
  const eps2 = 0.0001;
  const gamma = 0.1;
  const M = 1000;

  const x_m = steepest(f_memo, gf_memo, x0, eps1, eps2, gamma, M);

  return makeMessage('steepest', x_m, f, f_memo.cache.size, gf_memo.cache.size);
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

  const x_m = lm(f_memo, gf_memo, hesse_memo, x0, eps1, mu0, M);

  return makeMessage('leveberg-marquardt', x_m, f, f_memo.cache.size, gf_memo.cache.size, hesse_memo.cache.size);
}

export function run() {
  const results = [runDescent, runSteepest, runLM].map((run) => run());
  console.log(results.join('\n\n'));
}
