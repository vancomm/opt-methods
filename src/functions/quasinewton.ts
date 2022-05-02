import { Point, Vector, Matrix } from "../classes/index.js";
import { minimize } from "./minimize.js";

export function quasinewton(
	f: (x: Point) => number,
	gradf: (point: Point) => Vector,
	x0: Point,
	eps: number,
	calcHkNext: (Hk: Matrix, dxk: Vector, dyk: Vector) => Matrix) {

	function iter(xk: Point, Hk: Matrix): Point {
		const dk = Hk.multiplyByScalar(-1).multiplyByVector(gradf(xk));

		const gamma_k = minimize(
			(gamma: number) => f(xk.addVector(dk.multiplyByScalar(gamma))),
			0);

		const xk_next = xk.addVector(dk.multiplyByScalar(gamma_k));

		if (gradf(xk_next).length < eps) return xk_next;

		const delta_xk = dk.multiplyByScalar(gamma_k);
		const delta_yk = gradf(xk_next).subtract(gradf(xk));

		const Hk_next = calcHkNext(H0, delta_xk, delta_yk);

		return iter(xk_next, Hk_next)
	}

	const H0 = Matrix.Identity(2);

	return iter(x0, H0);
}