export type Params = {
  eps1: number,
  eps2: number,
  M: number,
  gamma: number;
}

export type Vector = [
  x1: number,
  x2: number,
]

type ScalarFunction = (point: Vector) => number;
type VectorFunction = (point: Vector) => Vector;

function norm(vector: Vector): number {
  const [x1, x2] = vector;
  return Math.sqrt(x1 ** 2 + x2 ** 2);
}

const subtract = (minuend: Vector, subtrahend: Vector): Vector => {
  const [x1, y1] = minuend;
  const [x2, y2] = subtrahend;
  return [x1 - x2, y1 - y2];
};

const multiply = (multiplier: number, vector: Vector): Vector => {
  const [x, y] = vector;
  return [multiplier * x, multiplier * y];
};

export function descent(f: ScalarFunction, gradf: VectorFunction, x0: Vector, params: Params): Vector {
  const { eps1, eps2, M } = params;

  let k = 0;
  function iter(xk: Vector): Vector {
    if (norm(gradf(xk)) < eps1) {
      console.log(`Precision eps1 = ${eps1} achieved, exiting`);
      return xk;
    }

    if (k >= M) {
      console.log(`Number of iterations exceeded M = ${M}, exiting`);
      return xk;
    }

    let { gamma } = params;

    let xk_next = subtract(xk, multiply(gamma, gradf(xk)));

    while (f(xk_next) - f(xk) >= 0) {
      gamma /= 2;
      xk_next = subtract(xk, multiply(gamma, gradf(xk)));
    }

    if (norm(subtract(xk_next, xk)) <= eps2 && Math.abs(f(xk_next) - f(xk)) <= eps2) {
      console.log(`Precision eps2 = ${eps2} achieved, exiting`);
      return xk_next;
    }
    k += 1;
    return iter(xk_next);
  }
  return iter(x0);
}
