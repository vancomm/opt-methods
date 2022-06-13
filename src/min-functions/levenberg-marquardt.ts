/* eslint-disable no-use-before-define */
import Point from "../classes/point.js";
import Vector from "../classes/vector.js";
import Matrix from "../classes/matrix.js";

export default function lm(
  f: (point: Point) => number,
  gradf: (point: Point) => Vector,
  hesse: (point: Point) => Matrix,
  x0: Point,
  eps: number,
  mu0: number,
  M: number,
): Point {
  function iter1(xk: Point, muk: number, k: number): Point {
    if (gradf(xk).length < eps || k >= M) return xk;
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
