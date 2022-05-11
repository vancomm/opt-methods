import { Point, Vector } from "../classes/index.js";
import { getEi } from "../utils/index.js";

export function coordinate(
	f: (x: Point) => number,
	x0: Point,
	a0: number,
	lambda: number,
	eps: number,
	n = 2,
) {
	let k = 0;

	const x = [x0];

	const a = [a0];

	let i;
	let pk: Vector;

	do {
		i = k % n + 1;
		pk = getEi(i, n);

		if (f(x[k]) > f(x[k].addVector(pk.multiplyByScalar(a[k])))) {
			x[k + 1] = x[k].addVector(pk.multiplyByScalar(a[k]));
			a[k + 1] = a[k];
			k += 1;
			continue;
		}

		if (f(x[k]) > f(x[k].subtractVector(pk.multiplyByScalar(a[k])))) {
			x[k + 1] = x[k].subtractVector(pk.multiplyByScalar(a[k]));
			a[k + 1] = a[k];
			k += 1;
			continue;
		}

		if (i === n && k >= n && x[k].subtractPoint(x[k - n]).length < eps) {
			return x[k];
		}

		x[k + 1] = x[k];
		a[k + 1] = (i === n) ? lambda * a[k] : a[k];
		k += 1;

	} while (true);
}
