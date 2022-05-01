import { pr, dfp } from './functions/index.js';
import { Point, Vector } from './classes/index.js';
import { memoize, toPrecision } from './utils/index.js';

function makeMessage(
	name: string,
	x_m: Point,
	f: (point: Point) => number,
	callsF: number,
	callsGradF: number,
): string {
	const precision = 4;
	const [x, y] = x_m;
	const message = [
		`${name}`,
		`x_m:\t\t(${toPrecision(x, precision)}, ${toPrecision(y, precision)})`,
		`f(x_m):\t\t${toPrecision(f(x_m), 4)}`,
		`f calls:\t${callsF}`,
		`grad calls:\t${callsGradF}`,
	].join('\n');
	return message;
}

function f(x: Point): number {
	const [x1, x2] = x;
	return 100 * (x1 - x2 ** 2) ** 2 + (x1 ** 2 - x2) ** 2;
}

function gradf(point: Point): Vector {
	const dfdx = (x: number, y: number)
		: number => (4 * x * (x ** 2 - y) + 200 * x - 200 * (y ** 2));
	const dfdy = (x: number, y: number)
		: number => -2 * (x ** 2) - 400 * y * (x - y ** 2) + 2 * y;
	const [x, y] = point;
	return new Vector(dfdx(x, y), dfdy(x, y));
}

function runPR() {
	const f_memo = memoize(f, (arg) => arg.toString());
	const gf_memo = memoize(gradf);
	const x0 = new Point(1, 2);
	const [eps1, eps2] = [1e-5, 1e-5];
	const M = 1000;
	const x_m = pr(f_memo, gf_memo, x0, eps1, eps2, M);
	return makeMessage('polack-ribiere', x_m, f, f_memo.cache.size, gf_memo.cache.size);
}

function runDFP() {
	const f_memo = memoize(f, (arg) => arg.toString());
	const gf_memo = memoize(gradf);
	const x0 = new Point(2, 3);
	const eps = 1e-3;
	const x_m = dfp(f_memo, gf_memo, x0, eps);
	return makeMessage('davidson-fletcher-powell', x_m, f, f_memo.cache.size, gf_memo.cache.size);
}

export function run() {
	console.log(runPR());
	console.log();
	console.log(runDFP());
}