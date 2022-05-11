import { Point } from "../classes/index.js";
import { FuncMath } from "../utils/index.js";
import { randomSearchWithCheck } from "./random-search-with-check.js";

const { sigma } = FuncMath;

export function barrier(
	x0: Point, f: (x: Point) => number,
	g: ((x: Point) => number)[],
	m: number, p: number,
	eps: number,
	rsParams = {
		initialStep: 1,
		stepDecayFactor: 1 - 1e-3,
		epsilon: 1e-5,
		maxIterations: 1e4,
	},
	r0 = 1e-2, C = 4, M = 1e4,
): [Point, string, number] {

	function checkInside(x: Point) {
		const gEq = g.slice(0, m);
		const gLeq = g.slice(m, p);

		const first = gEq.every((g) => g(x) === 0);
		const second = gLeq.every((g) => g(x) <= 0);

		return first && second;
	}

	// penalty function
	function P(x: Point, rk: number) {
		const gx = (j: number) => g[j](x);
		const oneOverGx = (j: number) => 1 / gx(j);
		return rk * sigma(oneOverGx)(0)(m - 1);
	}

	// auxiliary function
	function F(x: Point, rk: number) {
		return f(x) - P(x, rk);
	}

	const { initialStep, stepDecayFactor, epsilon, maxIterations } = rsParams;

	let k = 0;
	let xk = x0;
	let rk = r0;

	do {
		k++;
		const get_x_star = (x: Point) => F(x, rk);
		const [x_star] = randomSearchWithCheck(get_x_star, xk, checkInside, initialStep, stepDecayFactor, epsilon, maxIterations);

		const pen = P(x_star, rk);

		if (pen <= eps) return [x_star, 'precision achieved', k];

		rk /= C;
		xk = x_star;
	} while (k < M);

	return [xk, 'too many iterations', k];
}