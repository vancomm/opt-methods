import { Point, Vector } from "../classes/index.js";
import { range } from "../utils/index.js";

function getEi(i: number, n: number) {
	const values = range(n).map((_el, index) => (index == i - 1) ? 1 : 0);
	return new Vector(values);
}

export function pattern(
	f: (x: Point) => number,
	x0: Point,
	a: number,
	eps: number,
	lambda = 1,
	n = 2,
) {

	const x: Point[] = [];
	x[0] = x0;

	const z: Point[] = [];
	z[1] = x0;

	const e: Vector[] = [];
	for (let i = 1; i < n + 1; i++) {
		e[i] = getEi(i, n);
	}

	let h: number[] = [];
	for (let i = 1; i < n + 1; i++) {
		h[i] = 1e-2;
	}

	let k = 0;
	let i = 1;

	do {
		// console.log(`h: ${h.toString()}`);
		// console.log(`x: ${x.map((p) => `(${p.toString()})`).join(', ')}`);
		// console.log(`z: ${z.map((p) => `(${p.toString()})`).join(', ')}`);
		// for (let b = 0; b < 9e8; b++) { }
		if (f(z[i].addVector(e[i].multiplyByScalar(h[i]))) < f(z[i])) {
			z[i + 1] = z[i].addVector(e[i].multiplyByScalar(h[i]));
		} else if (f(z[i].subtractVector(e[i].multiplyByScalar(h[i]))) < f(z[i])) {
			z[i + 1] = z[i].subtractVector(e[i].multiplyByScalar(h[i]));
		} else {
			z[i + 1] = z[i];
		}

		if (i < n) {
			i += 1;
			continue;
		}

		if (f(z[n + 1]) < f(x[k])) {
			x[k + 1] = z[n + 1];
			z[1] = x[k + 1].addVector(x[k + 1].subtractPoint(x[k]).multiplyByScalar(lambda));
			k += 1;
			i = 1;
			continue;
		}

		if (h.reduce((max, curr) => Math.abs(curr) > max ? Math.abs(curr) : max, 0) < eps) {
			console.log(x.map(([x1, x2]) => `(${x1},${x2})`).join('\n'));
			return x[k];
		}
		h = h.map(v => v / a);
		x[k + 1] = x[k];
		k += 1;
		i = 1;
	} while (true);
}

function f(x: Point): number {
	const [x1, x2] = x;
	return x1 ** 4 - x1 * x2 + x2 ** 4 + 3 * x1 - 2 * x2 + 1;
}

const x0 = new Point(3, 2);

const x_min = pattern(f, x0, 4, 1e-7);

console.log(x_min);
// let n = 2;
// let a = 1;
// let h = [0, ...range(n).map(() => 1)];
// delete h[0];
// console.log(h);
// h = h.map(v => v / a);
// console.log(h);
