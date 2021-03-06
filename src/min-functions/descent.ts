import Vector from '../classes/vector.js';
import Point from '../classes/point.js';

export default function descent(
  f: (point: Point) => number,
  gradf: (point: Point) => Vector,
  x0: Point,
  eps1: number, eps2: number, gamma: number, M: number,
): Point {
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
