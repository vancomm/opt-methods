import { Point, Vector } from '../classes/index.js';
import { minimize } from './minimize.js';

function calcBk(k: number, gradf: (point: Point) => Vector, xk: Point, xk_prev?: Point) {
	if (k % 2 === 0) {
		return 0;
	}
	const num = gradf(xk).dotProduct(gradf(xk).subtract(gradf(xk_prev!)));
	const den = gradf(xk_prev!).length ** 2;
	return num / den;
}

function calcDk(gradxk: Vector, bk: number, dk_prev: Vector) {
	const right = gradxk.multiplyByScalar(-1);
	const left = dk_prev.multiplyByScalar(bk);
	return right.add(left);
}

export function pr(
	f: (x: Point) => number,
	gradf: (point: Point) => Vector,
	x0: Point,
	eps1: number, eps2: number, M: number): Point {

	let k = 0;
	let xk_prev = undefined;
	let xk = x0;
	let xk_next = undefined;

	let dk_prev = undefined;
	let dk = gradf(xk).multiplyByScalar(-1)

	let bk = 0;

	let tk_star;

	do {
		if (k >= M || gradf(xk).length < eps1) return xk;

		if (xk_prev) bk = calcBk(k, gradf, xk, xk_prev);

		if (dk_prev) dk = calcDk(gradf(xk), bk, dk_prev)

		tk_star = minimize(
			(tk: number) => f(xk.addVector(dk.multiplyByScalar(tk))),
			0
		);

		xk_next = xk.addVector(dk.multiplyByScalar(tk_star));

		if (xk_next.subtractPoint(xk).length <= eps2 && Math.abs(f(xk_next) - f(xk)) <= eps2) return xk;

		xk_prev = xk;
		xk = xk_next;
		dk_prev = dk;
		k++;

	} while (true);
}
