import { descent, Params, Vector } from './descent.js';

function f(point: Vector): number {
  const [x1, x2] = point;
  return 3 * (x1 ** 2) + x1 * x2 + 2 * (x2 ** 2) - x1 - 4 * x2;
}

function gradf(point: Vector): Vector {
  const [x, y] = point;
  return [(6 * x + y - 1), (x + 4 * y - 4)]
}

const x0: Vector = [2, 2];

const params: Params = {
  eps1: 0.0001,
  eps2: 0.0001,
  M: 1000,
  gamma: 0.1,
};

export default function run() {
  const x = descent(f, gradf, x0, params);
  console.log(x);
  console.log(f(x));
}
