import { Point, Vector } from "../classes/index.js";
import { range, random } from "../utils/index.js";

function getRandomOrt() {
	const randomVector = new Vector(...range(2).map(() => random(-1, 1)));
	return randomVector.normalize();
}

export function randomSearchWithCheck(
	f: (x: Point) => number, x0: Point,
	check: (x: Point) => boolean,
	a0: number, lambda: number, eps: number,
	M: number, 		// max total iterations
	n = 10, 			// max tests per point
): [Point, string, number] {
	let k = 0;
	let i = 1;

	const x = [x0];
	let a = a0;

	do {
		const h = getRandomOrt();
		const step = h.multiplyByScalar(a);

		const yk = x[k].addVector(step);

		if (f(yk) < f(x[k]) && (check(yk))) {
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
			return [x[k], `step too small\n\t\t(${a} < ${eps})`, k];
		}

		a *= lambda;
		i = 1;

	} while (k < M);
	return [x[k], `too many iterations\n\t\t(${k})`, k];
}
