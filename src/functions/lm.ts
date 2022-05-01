/* eslint-disable no-use-before-define */
import { Point, Vector, Matrix } from '../classes/index.js';

export type Params = {
  eps1: number,
  M: number,
  mu0: number;
}

export function lm(
  f: (point: Point) => number,
  gradf: (point: Point) => Vector,
  hesse: (point: Point) => Matrix,
  x0: Point,
  params: Params,
): Point {
  const { eps1, M, mu0 } = params;

  function iter1(xk: Point, muk: number, k: number): Point {
    if (gradf(xk).length < eps1 || k >= M) return xk;
    return iter2(xk, muk, k);
  }

  function iter2(xk: Point, muk: number, k: number): Point {
    const Hk = hesse(xk);
    const I = Matrix.Identity(Hk.dim);
    const dk = Hk
      .add(I.multiplyByScalar(muk))
      .inverse()
      .multiplyByVector(gradf(xk));
    const xk_next = xk.subtractVector(dk);
    if (f(xk) > f(xk_next)) return iter1(xk_next, muk / 2, k + 1);
    return iter2(xk, muk * 2, k);
  }

  return iter1(x0, mu0, 0);
}
