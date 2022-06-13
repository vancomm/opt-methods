import Vector from '../classes/vector.js';
import Point from '../classes/point.js';
import Matrix from '../classes/matrix.js';
import quasinewton from './quasinewton.js';

export default function dfp(
  f: (x: Point) => number,
  gradf: (point: Point) => Vector,
  x0: Point,
  eps: number): Point {

  function calcHkNext(Hk: Matrix, dxk: Vector, dyk: Vector): Matrix {
    const dxk_row = dxk.toRow();
    const dxk_col = dxk.toColumn();

    const dyk_row = dyk.toRow();
    const dyk_col = dyk.toColumn();

    const num1 = dxk_col.multiplyByMatrix(dxk_row);
    const den1 = dxk_row.multiplyByMatrix(dyk_col).toNumber();
    const frac1 = num1.multiplyByScalar(1 / den1);

    const num2 = Hk
      .multiplyByMatrix(dyk_col)
      .multiplyByMatrix(dyk_row)
      .multiplyByMatrix(Hk);
    const den2 = dyk_row
      .multiplyByMatrix(Hk)
      .multiplyByMatrix(dyk_col)
      .toNumber();
    const frac2 = num2.multiplyByScalar(1 / den2);

    return Hk.add(frac1).add(frac2.multiplyByScalar(-1));
  }

  return quasinewton(f, gradf, x0, eps, calcHkNext);
}