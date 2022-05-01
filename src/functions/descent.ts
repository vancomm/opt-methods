import { Point, Vector } from '../classes/index.js';

export type Params = {
  eps1: number,
  eps2: number,
  M: number,
  gamma: number,
}

export function descent(
  f: (point: Point) => number,
  gradf: (point: Point) => Vector,
  x0: Point,
  params: Params,
): Point {
  const {
    eps1, eps2, gamma, M,
  } = params;

  function iter(xk: Point, k: number): Point {
    if (gradf(xk).length < eps1 || k >= M) return xk;

    function get_x_next(g: number): Point {
      const xk_next = xk.subtractVector(gradf(xk).multiplyByScalar(g));
      if (f(xk_next) - f(xk) >= 0) return get_x_next(g / 2);
      return xk_next;
    }

    const xk_next = get_x_next(gamma);

    if (xk_next.subtractPoint(xk).length <= eps2 && Math.abs(f(xk_next) - f(xk)) <= eps2) {
      return xk_next;
    }
    return iter(xk_next, k + 1);
  }
  return iter(x0, 0);
}
