import { Point, Vector } from "../classes/index.js";
import { range, random } from "../utils/index.js";

function getRandomOrt() {
	const randomVector = new Vector(range(2).map(() => random(-1, 1)));
	return randomVector.normalize();
}

export function randomDescent(
	f: (x: Point) => number,
	x0: Point,
	a0: number,
	lambda: number,
	eps: number,
	M: number, // max total iterations
	n = 2, // max tests per point
) {

	let k = 0;
	let i = 1;

	const x = [x0];

	let a = a0;

	do {
		const h = getRandomOrt();

		const yk = x[k].addVector(h.multiplyByScalar(a));

		if (f(yk) < f(x[k])) {
			x[k + 1] = yk;
			k++;
			i = 1;
			continue;
		}

		if (i < n) {
			i++;
			continue;
		}

		if (a < eps) {
			return x[k];
		}

		a *= lambda;
		i = 1;

	} while (k < M);
	return x[k];
}
