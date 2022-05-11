import { Point, Vector, Matrix } from "./classes/index.js";
import { FuncMath, range } from './utils/index.js';

const { sigma } = FuncMath;

const g1 = (p: Point): number => { // g_1(x) <= 0
	const [x] = p;
	return -x;
}

const g2 = (p: Point): number => { // g_2(x) <= 0
	const [, y] = p;
	return -y;
}

const g3 = (p: Point): number => { // g_3(x) <= 0
	const [x, y] = p;
	return -(10 * x - x ** 2 + 10 * y - y ** 2 - 34);
}

const g = [g1, g2, g3];

const m = 0;
const p = g.length;

function checkInside(x: Point) {
	const gEq = g.slice(0, m);
	const gLeq = g.slice(m, p);

	const first = gEq.every((g) => g(x) === 0);
	const second = gLeq.every((g) => g(x) <= 0);
	return first && second;
}

const x = new Point(5, 5);

console.log(checkInside(x));

// function P(x: Point, rk: number, m: number, p: number) {
// 	const gEq = g.slice(0, m);

// 	const gLeq = g.slice(m, p);

// 	const gx = (j: number) => gEq[j](x);
// 	const gxSquared = (j: number) => gx(j) ** 2;

// 	const gxPlus = (j: number) => Math.max(0, gLeq[j](x));
// 	const gxPlusSquared = (j: number) => gxPlus(j) ** 2;

// 	return rk / 2 * (sigma(gxSquared)(0)(m - 1) + sigma(gxPlusSquared)(m)(p - 1));
// }

// const x = new Point(-1, -1);
// const rk = 1e-2;

// console.log(P(x, rk, m, p));
