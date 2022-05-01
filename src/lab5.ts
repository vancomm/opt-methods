import { randomDescent, hj } from './functions/index.js';
import { Matrix, Point, Vector } from './classes/index.js';
import { memoize, toPrecision } from './utils/index.js';

function makeMessage(
	name: string,
	x_m: Point,
	f: (point: Point) => number,
	callsF: number,
	precision = 4,
): string {
	const [x, y] = x_m;
	const message = [
		`${name}`,
		`x_m:\t\t(${toPrecision(x, precision)}, ${toPrecision(y, precision)})`,
		`f(x_m):\t\t${toPrecision(f(x_m), precision)}`,
		`f calls:\t${callsF}`,
	].join('\n');
	return message;
}

function f(x: Point): number {
	const [x1, x2] = x;
	return (x1 - 2) ** 2 + (x2 - 10) ** 2;
}

const x0 = new Point(10, 10);

// function runCoordinate() {
// 	const f_memo = memoize(f, (arg) => arg.toString());
// 	const x_min = coordinate(f_memo, x0, 1, 0.9, 1e-4);
// 	console.log(makeMessage("coordinate descent", x_min, f_memo, f_memo.cache.size));
// }

function runRandomDescent() {
	const f_memo = memoize(f, (arg) => arg.toString());
	const x_min = randomDescent(f_memo, x0, 10, 0.9, 1e-5, 1e7);
	console.log(makeMessage("random descent", x_min, f_memo, f_memo.cache.size));
}

function runHJ() {
	const f_memo = memoize(f, (arg) => arg.toString());
	const x_min = hj(f_memo, x0, 0.9, 1, 1e-4, 1e4);
	console.log(makeMessage("hooke-jeeves", x_min, f_memo, f_memo.cache.size));
}

export function run() {
	// runCoordinate();
	runRandomDescent();
	runHJ();
}
