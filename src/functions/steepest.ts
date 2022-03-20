import { Point, Vector } from '../classes/index.js';
import { parabola } from '../functions/index.js';

export type Params = {
  eps1: number,
  eps2: number,
  M: number,
  gamma: number,
}

export function steepest(
  f: (point: Point) => number,
  gradf: (point: Point) => Vector,
  x0: Point,
  params: Params,
): Point {
  const {
    eps1, eps2, gamma, M,
  } = params;

  let previous_k = false;

  function iter(xk: Point, k: number): Point {
    if (gradf(xk).norm < eps1 || k >= M) return xk;

    function phi(g: number): number {
      return f(xk.subtractVector(gradf(xk).multiply(g)));
    }

    const gamma_star = parabola(phi, eps1, [gamma]);

    const xk_next = xk.subtractVector(gradf(xk).multiply(gamma_star));

    if (xk_next.subtractPoint(xk).norm <= eps2 && Math.abs(f(xk_next) - f(xk)) <= eps2) {
      if (previous_k) return xk_next;
      previous_k = true;
      return iter(xk_next, k + 1);
    }
    previous_k = false;
    return iter(xk_next, k + 1);
  }

  return iter(x0, 0);
}
