import Point from '../classes/point.js';
import Vector from '../classes/vector.js';
import parabola from './parabola.js';

export default function steepest(
  f: (point: Point) => number,
  gradf: (point: Point) => Vector,
  x0: Point,
  eps1: number, eps2: number, gamma: number, M: number
): Point {
  let previous_k = false;

  function iter(xk: Point, k: number): Point {
    if (gradf(xk).length < eps1 || k >= M) return xk;

    function phi(g: number): number {
      return f(xk.subtractVector(gradf(xk).multiplyByScalar(g)));
    }

    const gamma_star = parabola(phi, eps1, [gamma]);

    const xk_next = xk.subtractVector(gradf(xk).multiplyByScalar(gamma_star));

    if (xk_next.subtractPoint(xk).length <= eps2 && Math.abs(f(xk_next) - f(xk)) <= eps2) {
      if (previous_k) return xk_next;
      previous_k = true;
      return iter(xk_next, k + 1);
    }
    previous_k = false;
    return iter(xk_next, k + 1);
  }

  return iter(x0, 0);
}
