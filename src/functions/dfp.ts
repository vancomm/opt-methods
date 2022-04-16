import { Point, Vector, Matrix, SquareMatrix } from '../classes/index.js';
import { quasinewton } from './quasinewton.js';

export function dfp(
	f: (x: Point) => number,
	gradf: (point: Point) => Vector,
	x0: Point,
	eps: number): Point {

	function calcHkNext(Hk: Matrix, dxk: Vector, dyk: Vector): Matrix {
		const dxk_row = Matrix.Row(dxk);
		const dxk_col = Matrix.Column(dxk);

		const dyk_row = Matrix.Row(dyk);
		const dyk_col = Matrix.Column(dyk);

		const num1 = Matrix.MultiplyByMatrix(dxk_col, dxk_row);
		const den1 = Matrix.MultiplyByMatrix(dxk_col, dyk_row).at(0, 0);
		const frac1 = num1.multiplyByScalar(1 / den1);

		const num2 = Hk
			.multiplyByMatrix(dyk_col)
			.multiplyByMatrix(dyk_row)
			.multiplyByMatrix(Hk);
		const den2 = dyk_row
			.multiplyByMatrix(Hk)
			.multiplyByMatrix(dyk_col)
			.at(0, 0);
		const frac2 = num2.multiplyByScalar(1 / den2);

		return Hk.add(frac1).add(frac2.multiplyByScalar(-1));
	}

	return quasinewton(f, gradf, x0, eps, calcHkNext);
}