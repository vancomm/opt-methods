import { Matrix, MatrixFunction, Point, ScalarFunction, Vector, VectorFunction } from "./classes.js";

export type Params = {
  eps1: number,
  M: number,
  mu: number;
}

export function lm(
  f: ScalarFunction,
  gradf: VectorFunction,
  hesse: MatrixFunction,
  x0: Point,
  params: Params
): Point {
  const { eps1, M, mu } = params;

  function start(xk: Point, k: number): Point {
    function iter3(xk: Point, mu: number, k: number): Point {
      if (gradf(xk).norm < eps1) {
        console.log(`Precision eps1 = ${eps1} achieved, exiting`);
        return xk;
      }
      if (k >= M) {
        console.log(`Number of iterations exceeded M = ${M}, exiting`);
        return xk;
      }
      return iter7(xk, mu, k);
    }
    function iter7(xk: Point, mu: number, k: number): Point {
      const d = Matrix.multiply(
        hesse(xk)
          .add(Matrix.identity
            .multiply(mu))
          .inverse,
        gradf(xk)
      );
      const xk_next = xk.subtract(d);
      if (f(xk_next) < f(xk)) return iter3(xk_next, mu / 2, k + 1);
      return iter7(xk, 2 * mu, k);
    }
    return iter3(xk, mu, k);
  }
  return start(x0, 0);
}