import { descent, steepest, lm } from '../functions/index.js';
import { Point, Vector, Matrix } from '../classes/index.js';
import { memoize, toPrecision } from '../utils/index.js';

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
  function f(point: Point): number {
    const [x, y] = point;
    return 100 * (x - y ** 2) ** 2 + (x ** 2 - y) ** 2;
  }

  function gradf(point: Point): Vector {
    const dfdx = (x: number, y: number)
      : number => (4 * x * (x ** 2 - y) + 200 * x - 200 * (y ** 2));
    const dfdy = (x: number, y: number)
      : number => -2 * (x ** 2) - 400 * y * (x - y ** 2) + 2 * y;
    const [x, y] = point;
    return new Vector(dfdx(x, y), dfdy(x, y));
  }

  function hesse(point: Point): Matrix {
    const dfdfdxdy = (x: number, y: number): number => -4 * x - 400 * y;
    const dfdfdxdx = (x: number, y: number): number => 12 * (x ** 2) - 4 * y + 200;
    const dfdfdydy = (x: number, y: number): number => -400 * x + 1200 * (y ** 2) + 200;
    const [x, y] = point;
    const matrix = new Matrix(
      new Vector(dfdfdxdx(x, y), dfdfdxdy(x, y)),
      new Vector(dfdfdxdy(x, y), dfdfdydy(x, y)),
    );
    return matrix;
  }

  const f_memo = memoize(f, (arg) => arg.toString());

  const gf_memo = memoize(gradf);

  const hesse_memo = memoize(hesse, (arg) => arg.toString());

  const x0 = new Point(2, 7);

  const eps1 = 1e-4;
  const mu0 = 1e7;
  const M = 1e3;

  const x_m = lm(f_memo, gf_memo, hesse_memo, x0, eps1, mu0, M);

  return makeMessage('leveberg-marquardt', x_m, f, f_memo.cache.size, gf_memo.cache.size, hesse_memo.cache.size);
}

export function run() {
  const results = [runDescent, runSteepest, runLM].map((run) => run());
  console.log(results.join('\n\n'));
}
