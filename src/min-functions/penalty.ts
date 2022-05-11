import { Point } from "../classes/index.js";
import { FuncMath } from "../utils/index.js";
import { diffGradient } from "./diff-gradient.js";
import { nm } from "./nelder-mead.js";

const { sigma } = FuncMath;

const nonNegative = (func: (arg: any) => number) => (arg: any) => {
	const value = func(arg);
	return value > 0 ? value : 0;
}

export function penalty(
	x0: Point, f: (x: Point) => number,
	g: ((x: Point) => number)[], // restraint functions
	m: number,	// index of first g(x) <= 0 type restraint function
	p: number, 	// number of restraint functions
	eps: number,
	nmParams = {
		edgeSize: 10,
		epsilon: 1e-6,
	},
	r0 = 1e-2, C = 4, M = 1e4,
): [Point, string] {

	// penalty function
	function P(x: Point, rk: number) {
		const gEq = g.slice(0, m);
		const gLeq = g.slice(m, p);

		const gx = (j: number) => gEq[j](x);
		const gxSquared = (j: number) => gx(j) ** 2;

		const gxPlus = (j: number) => nonNegative(gLeq[j])(x);
		const gxPlusSquared = (j: number) => gxPlus(j) ** 2;

		const sigma1 = sigma(gxSquared)(0)(m - 1);
		const sigma2 = sigma(gxPlusSquared)(m)(p - 1)

		return (rk / 2) * (sigma1 + sigma2);
	}

	// auxiliary function
	function F(x: Point, rk: number) {
		return f(x) + P(x, rk);
	}

	const { edgeSize, epsilon } = nmParams;

	let k = 0;
	let xk = x0;
	let rk = r0;

	do {
		const get_x_star = (x: Point) => F(x, rk);
		const [x_star, stopReason] = nm(get_x_star, xk, edgeSize, epsilon);

		const pen = P(x_star, rk);

		if (pen <= eps) return [x_star, 'precision achieved'];

		rk *= C;
		xk = x_star;
		k++;

	} while (k < M);

	return [xk, 'too many iterations'];
}