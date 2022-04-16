import { Point, Vector } from '../classes/index.js';
import { minimize } from './minimize.js';

export function pr(
	f: (x: Point) => number,
	gradf: (point: Point) => Vector,
	x0: Point,
	eps1: number, eps2: number, M: number): Point {
	function iter(xk: Point, d_prev: Vector, k: number, xk_prev?: Point): Point {
		if (k >= M || gradf(xk).norm < eps1) return xk;

		const bk = xk_prev
			? gradf(xk)
				.dotProduct(
					gradf(xk).subtract(gradf(xk_prev))) / (gradf(xk_prev).norm ** 2)
			: 0;

		const dk = gradf(xk)
			.multiplyByScalar(-1)
			.add(d_prev.multiplyByScalar(bk));

		const ft = (tk: number) => f(xk.addVector(dk.multiplyByScalar(tk)));

		const tk_star = minimize(0, ft);

		const xk_next = xk.addVector(dk.multiplyByScalar(tk_star));

		if (xk_next.subtractPoint(xk).norm <= eps2 && Math.abs(f(xk_next) - f(xk)) <= eps2) return xk;
		return iter(xk_next, dk, k + 1, xk);
	}

	const d0 = gradf(x0).multiplyByScalar(-1);

	return iter(x0, d0, 0);
}