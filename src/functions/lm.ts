/* eslint-disable no-use-before-define */
import { Point, Vector, Matrix } from '../classes/index.js';

export type Params = {
  eps1: number,
  M: number,
  mu: number;
}

export function lm(
  f: (point: Point) => number,
  gradf: (point: Point) => Vector,
  hesse: (point: Point) => Matrix,
  x0: Point,
  params: Params,
): Point {
  const { eps1, M, mu: muInit } = params;

  function iter1(xk: Point, mu: number, k: number): Point {
    if (gradf(xk).norm < eps1 || k >= M) return xk;
    return iter2(xk, mu, k);
  }

  function iter2(xk: Point, mu: number, k: number): Point {
    const d = Matrix.multiply(
      hesse(xk)
        .add(Matrix.identity
          .multiply(mu))
        .inverse,
      gradf(xk),
    );
    const xk_next = xk.subtract(d);
    if (f(xk_next) < f(xk)) return iter1(xk_next, mu / 2, k + 1);
    return iter2(xk, 2 * mu, k);
  }

  function start(xk: Point, mu: number, k: number): Point {
    return iter1(xk, mu, k);
  }

  return start(x0, muInit, 0);
}
