import { Point, Matrix } from "../classes/index.js";
import { sum, maxArg, minArg, replace, getCenter } from "../utils/index.js";

function generateSimplexVetrices(x0: Point, n: number, a: number): Point[] {
	const r = a * (Math.sqrt(n + 1) - 1 + n) / (n * Math.SQRT2);
	const s = a * (Math.sqrt(n + 1) - 1) / (n * Math.SQRT2);

	const points = Matrix.Identity(n)
		.mapDeep((i) => i = (i === 1) ? r : s)
		.rows.map((v) => x0.addVector(v));

	return [x0, ...points];
}

export function nm(
	f: (x: Point) => number,
	x0: Point,
	a: number,
	eps: number,
	alpha = 1,
	gamma = 2,
	beta = 0.5,
	delta = 0.5,
): Point {
	const n = x0.count;

	let x_arr = generateSimplexVetrices(x0, n, a);

	let x_h: Point;
	let x_l: Point;
	let x_bar: Point;
	let x_star: Point;
	let x_starstar: Point;

	let y_arr: number[];

	let y_h: number;
	let y_l: number;
	let y_bar: number;
	let y_star: number;
	let y_starstar: number;

	let stop1: boolean;
	let stop2: boolean;
	let stop3: boolean;

	do {
		y_arr = x_arr.map(f);

		x_h = maxArg(f, ...x_arr);
		y_h = f(x_h);

		x_l = minArg(f, ...x_arr);
		y_l = f(x_l);

		x_bar = getCenter(...x_arr.filter((p) => p != x_h));
		y_bar = f(x_bar);

		x_star = x_bar.addVector(x_bar.subtractPoint(x_h).multiplyByScalar(alpha));
		y_star = f(x_star);

		if (y_star < y_l) {
			x_starstar = x_bar.addVector(x_star.subtractPoint(x_bar).multiplyByScalar(gamma));
			y_starstar = f(x_starstar);

			if (y_starstar < y_l) {
				x_arr = replace(x_arr, x_starstar, (x) => x == x_h);
			} else {
				x_arr = replace(x_arr, x_star, (x) => x == x_h);
			}

		} else if (y_arr.every((y) => (y === y_h) || y_star > y)) {
			if (!(y_star > y_h)) {
				x_arr = replace(x_arr, x_star, (x) => x == x_h);
			}

			x_starstar = x_bar.addVector(x_h.subtractPoint(x_bar).multiplyByScalar(beta));
			y_starstar = f(x_starstar);

			if (y_starstar > y_h) {
				x_arr = x_arr.map((x) => x.addVector(x.subtractPoint(x_l).multiplyByScalar(delta)));
			} else {
				x_arr = replace(x_arr, x_starstar, (x) => x == x_h);
			}

		} else {
			x_arr = replace(x_arr, x_star, (x) => x == x_h);
		}

		const testSumY = Math.sqrt((1 / n * sum(y_arr.map((y) => (y - y_bar) ** 2))));

		const testSumX = Math.sqrt(sum(x_arr.map((x) => x.subtractPoint(x_bar)).map((v) => v.dotProduct(v))));

		stop1 = testSumY <= eps;
		stop2 = y_h - y_l <= eps;
		stop3 = testSumY <= eps * testSumX;

	} while (!(stop1 || stop2 || stop3));

	return x_bar;
}