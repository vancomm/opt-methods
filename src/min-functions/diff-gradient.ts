import { Point } from "../classes/index.js";
import { grad } from "../utils/index.js";

export function diffGradient(
	f: (x: Point) => number,
	x0: Point,
	a0: number,
	lambda: number,
	eps: number,
	M = 1e4,
): [Point, string, number] {
	let k = 0;
	let xk = x0;
	let a = a0;
	do {
		const step = grad(f, xk).multiplyByScalar(a);
		const xk_next = xk.addVector(step);

		if (f(xk_next) < f(xk)) {
			xk = xk_next;
			k++;
			continue;
		}

		if (xk_next.subtractPoint(xk).length < eps) {
			return [xk, 'precision achieved', k];
		}

		if (a < eps) {
			return [xk, 'step too small', k];
		}

		a *= lambda;
		k++;
	} while (k < M);

	return [xk, 'too many iterations', k];
}