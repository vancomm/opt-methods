import { Point, Vector, SquareMatrix } from '../classes/index.js';
import { Memoized, toPrecision } from '../utils/index.js';
import {
  descent, DescentParams,
  steepest, SteepestParams,
  lm, LMParams,
} from '../functions/index.js';

function getMessage(name: string, x_m: Point, f: (point: Point) => number) {
  const precision = 4;
  const [x, y] = x_m;
  const message = [
    `${name}`,
    `x_m:\t(${toPrecision(x, precision)}, ${toPrecision(y, precision)})`,
    `f(x_m):\t${toPrecision(f(x_m), 4)}`,
  ].join('\n');
  return message;
}

function runDescent() {
  function f(point: Point): number {
    const [x, y] = point;
    return 3 * (x ** 2) + x * y + 2 * (y ** 2) - x - 4 * y;
  }

  function gradf(point: Point): Vector {
    const [x, y] = point;
    return new Vector([(6 * x + y - 1), (x + 4 * y - 4)]);
  }

  const f_memo = new Memoized(f);
  const f_call = f_memo.call.bind(f_memo);

  const gf_memo = new Memoized(gradf);
  const gf_call = gf_memo.call.bind(gf_memo);

  const x0: Point = new Point(2, 2);

  const params: DescentParams = {
    eps1: 0.0001,
    eps2: 0.0001,
    M: 1000,
    gamma: 0.1,
  };

  return getMessage('descent', descent(f_call, gf_call, x0, params), f);
}

function runSteepest() {
  function f(point: Point): number {
    const [x, y] = point;
    return 3 * (x ** 2) + x * y + 2 * (y ** 2) - x - 4 * y;
  }

  function gradf(point: Point): Vector {
    const [x, y] = point;
    return new Vector([(6 * x + y - 1), (x + 4 * y - 4)]);
  }

  const x0: Point = new Point(2, 2);

  const params: SteepestParams = {
    eps1: 0.0001,
    eps2: 0.0001,
    M: 1000,
    gamma: 0.1,
  };

  return getMessage('steepest', steepest(f, gradf, x0, params), f);
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
    return new Vector([dfdx(x, y), dfdy(x, y)]);
  }

  function hesse(point: Point): SquareMatrix {
    const dfdfdxdy = (x: number, y: number): number => -4 * x - 400 * y;
    const dfdfdxdx = (x: number, y: number): number => 12 * (x ** 2) - 4 * y + 200;
    const dfdfdydy = (x: number, y: number): number => -400 * x + 1200 * (y ** 2) + 200;
    const [x, y] = point;
    const matrix = new SquareMatrix([
      new Vector([dfdfdxdx(x, y), dfdfdxdy(x, y)]),
      new Vector([dfdfdxdy(x, y), dfdfdydy(x, y)]),
    ]);
    return matrix;
  }

  const x0 = new Point(100, 100);

  const params: LMParams = {
    eps1: 0.0001,
    M: 1000,
    mu: 0.001,
  };

  return getMessage('leveberg-marquardt', lm(f, gradf, hesse, x0, params), f);
}

export function run() {
  const results = [runDescent, runSteepest, runLM].map((runFunc) => runFunc());
  console.log(results.join('\n\n'));
}
