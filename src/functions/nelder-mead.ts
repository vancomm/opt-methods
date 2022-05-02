import { Point, Matrix } from "../classes/index.js";
import { getCenter, max, min, replace, /* success, message, error,*/ } from "../utils/index.js";

// function printPoints(...points: Point[]) {
// 	message(points.map((p) => p.toString()).join('\n'));
// }

// function testResult(test: boolean) {
// 	const printFunc = (test) ? success : error;
// 	printFunc(test);
// }

function generateSimplexVetrices(x0: Point, n: number, a: number): Point[] {
	const r = a * (Math.sqrt(n + 1) - 1 + n) / (n * Math.SQRT2);
	const s = a * (Math.sqrt(n + 1) - 1) / (n * Math.SQRT2);

	const points = Matrix.Identity(n)
		.mapDeep((i) => i = (i === 1) ? r : s)
		.rows
		.map((v) => x0.addVector(v));

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
) {
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

	let test1: boolean;
	let test2: boolean;
	let test3: boolean;

	do {
		// message('Simplex points:');
		// printPoints(...x_arr);

		y_arr = x_arr.map(f);

		x_h = max(f, ...x_arr);
		y_h = f(x_h);

		x_l = min(f, ...x_arr);
		y_l = f(x_l);

		x_bar = getCenter(...x_arr.filter((p) => p != x_h));
		y_bar = f(x_bar);

		// message('x_bar:');
		// printPoints(x_bar);
		// message(y_bar);


		x_star = x_bar.addVector(x_bar.subtractPoint(x_h).multiplyByScalar(alpha));
		y_star = f(x_star);

		// message('x*:');
		// printPoints(x_star);
		// message(y_star);


		if (y_star < y_l) {
			x_starstar = x_bar.addVector(x_star.subtractPoint(x_bar).multiplyByScalar(gamma));
			y_starstar = f(x_starstar);

			// message('x**:');
			// printPoints(x_starstar);
			// message(y_starstar);

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

			// message('x**:');
			// printPoints(x_starstar);
			// message(y_starstar);

			if (y_starstar > y_h) {
				x_arr = x_arr.map((x) => x.addVector(x.subtractPoint(x_l).multiplyByScalar(delta)));
			} else {
				x_arr = replace(x_arr, x_starstar, (x) => x == x_h);
			}

		} else {
			x_arr = replace(x_arr, x_star, (x) => x == x_h);
		}

		const testSumY = Math.sqrt((1 / n * y_arr.map((y) => (y - y_bar) ** 2).reduce((sum, add) => sum + add, 0)));

		const testSumX = Math.sqrt(x_arr.map((x) => x.subtractPoint(x_bar)).map((v) => v.dotProduct(v)).reduce((sum, add) => sum + add, 0));

		test1 = testSumY <= eps;
		test2 = y_h - y_l <= eps;
		test3 = testSumY <= eps * testSumX;

		// testResult(test1);
		// testResult(test2);
		// testResult(test3);

	} while (!test1 && !test2 && !test3);

	return x_bar;

	// const x_m =  min(f, x_bar, x_star, x_h, ...x_arr);

	// switch (x_m) {
	// 	case x_bar:
	// 		success('x_bar');
	// 		break;
	// 	case x_star:
	// 		success('x*');
	// 		break;
	// 	case x_h:
	// 		success('x_h');
	// 	default:
	// 		success('simplex vertex');
	// 		break;
	// }

	// return x_m;
}