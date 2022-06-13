import { Point } from "../classes/index.js";
import { FuncMath } from "../utils/index.js";
import { nm } from "./nelder-mead.js";

const { sigma } = FuncMath;

const nonNegative = (func: (arg: any) => number) => (arg: any) => {
	const value = func(arg);
	return value > 0 ? value : 0;
}

export function penalty(
	x0: Point, f: (x: Point) => number,
	g: ((x: Point) => number)[],
	m: number, p: number,
	eps: number,
	nmParams = {
		edgeSize: 10,
		epsilon: 1e-6,
	},
	r0 = 1e-2, C = 4, M = 1e4,
): [Point, number, string] {
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

	const { edgeSize, epsilon } = nmParams;

	let k = 0;
	let xk = x0;
	let rk = r0;

	do {
		k++;

		const [xk_star] = nm((x: Point) => f(x) + P(x, rk), xk, edgeSize, epsilon);

		const pen = P(xk_star, rk);

		if (pen <= eps) return [xk_star, k, 'precision achieved'];

		rk *= C;
		xk = xk_star;
	} while (k < M);

	return [xk, k, 'too many iterations'];
}