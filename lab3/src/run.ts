import { Matrix, Point, Vector } from './classes.js';
import { descent, Params as ParamsDescent } from './descent.js';
import { lm, Params as ParamsLM } from './lm.js';

function runDescent() {
  function f(point: Point): number {
    const { x, y } = point;
    return 3 * (x ** 2) + x * y + 2 * (y ** 2) - x - 4 * y;
  }

  function gradf(point: Point): Vector {
    const { x, y } = point;
    return new Vector((6 * x + y - 1), (x + 4 * y - 4));
  }

  const x0: Point = new Point(2, 2);

  const params: ParamsDescent = {
    eps1: 0.0001,
    eps2: 0.0001,
    M: 1000,
    gamma: 0.1,
  };

  const x_m = descent(f, gradf, x0, params);
  console.log(x_m);
  console.log(f(x_m));
}

function runLM() {
  function f(point: Point): number {
    const { x, y } = point;
    return 100 * (x - y ** 2) ** 2 + (x ** 2 - y) ** 2;
    // return x ** 4 - x * y + y ** 4 + 3 * x - 2 * y + 1;
  }

  function gradf(point: Point): Vector {
    const dfdx = (x: number, y: number): number =>
      (4 * x * (x ** 2 - y) + 200 * x - 200 * (y ** 2));
    // 4 * x ** 3 - y + 3;
    const dfdy = (x: number, y: number): number =>
      -2 * (x ** 2) - 400 * y * (x - y ** 2) + 2 * y;
    // -x + 4 * y ** 3 - 2;
    const { x, y } = point;
    return new Vector(dfdx(x, y), dfdy(x, y));
  }

  function hesse(point: Point): Matrix {
    const dfdfdxdy = (x: number, y: number): number =>
      -4 * x - 400 * y;
    // -1;
    const dfdfdxdx = (x: number, y: number): number =>
      12 * (x ** 2) - 4 * y + 200;
    // 12 * x ** 2;
    const dfdfdydy = (x: number, y: number): number =>
      -400 * x + 1200 * (y ** 2) + 200;
    // 12 * y ** 2;
    const { x, y } = point;
    return new Matrix([
      [dfdfdxdx(x, y), dfdfdxdy(x, y)],
      [dfdfdxdy(x, y), dfdfdydy(x, y)],
    ]);
  }

  const x0 = new Point(100, 100);

  const params: ParamsLM = {
    eps1: 0.0001,
    M: 1000,
    mu: 0.001,
  }

  const x_m = lm(f, gradf, hesse, x0, params);
  console.log(x_m);
  console.log(f(x_m));
}

export default function run() {
  runDescent();
  runLM();
}
