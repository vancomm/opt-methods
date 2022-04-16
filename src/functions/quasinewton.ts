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

		const f_gamma = (gamma: number) => f(xk.addVector(dk.multiplyByScalar(gamma)));

		const gamma_k = minimize(0, f_gamma);

		const xk_next = xk.addVector(dk.multiplyByScalar(gamma_k));

		if (gradf(xk_next).norm < eps) return xk_next;

		const delta_xk = dk.multiplyByScalar(gamma_k);
		const delta_yk = gradf(xk_next).subtract(gradf(xk));

		const Hk_next = calcHkNext(H0, delta_xk, delta_yk);

		return iter(xk_next, Hk_next)
	}

	const H0 = new Matrix([
		new Vector([1, 0]),
		new Vector([0, 1])
	]);

	return iter(x0, H0);
}