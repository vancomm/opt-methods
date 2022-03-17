import { Point, ScalarFunction, Vector, VectorFunction } from "./classes.js";
import parabola from "./parabola.js";

export type Params = {
  eps1: number,
  eps2: number,
  M: number,
  gamma: number,
}

export function steepest(
  f: ScalarFunction,
  gradf: VectorFunction,
  x0: Point,
  params: Params
) {
  const { eps1, eps2, gamma, M } = params;
  let previous_k = false;
  function iter(xk: Point, k: number): Point {
    if (gradf(xk).norm < eps1) {
      console.log(`Precision eps1 = ${eps1} achieved, exiting`);
      return xk;
    }

    if (k >= M) {
      console.log(`Number of iterations exceeded M = ${M}, exiting`);
      return xk;
    }

    function phi(gamma: number): number {
      return f(xk.subtract(gradf(xk).multiply(gamma)));
    }

    const gamma_star = parabola(phi, eps1, gamma);

    const xk_next = xk.subtract(gradf(xk).multiply(gamma_star));

    if (Point.subtract(xk_next, xk).norm <= eps2 && Math.abs(f(xk_next) - f(xk)) <= eps2) {
      if (previous_k) return xk_next;
      previous_k = true;
      return iter(xk_next, k + 1);
    }
    previous_k = false;
    return iter(xk_next, k + 1);
  }
  return iter(x0, 0);
}