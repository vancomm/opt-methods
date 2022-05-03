import { randomDescent, nm } from '../functions/index.js';
import { Point } from '../classes/index.js';
import { memoize, yellow, toPrecision, green, red } from '../utils/index.js';

function makeMessage(
	name: string,
	x_m: Point,
	f: (point: Point) => number,
	callsF: number,
	precision = 4,
): string {
	const [x, y] = x_m.map((v) => toPrecision(v, precision));
	const [X, Y] = target.map((v) => toPrecision(v, precision));
	const colorFunc = (x === X) && (y === Y) ? green : red;
	const point = colorFunc(`(${x}, ${y})`);
	const text = [
		`${yellow(name)}`,
		`x_m:\t\t${point}`,
		`f(x_m):\t\t${toPrecision(f(x_m), precision)}`,
		`f calls:\t${callsF}`,
	].join('\n');
	return text;
}

function f(x: Point): number {
	const [x1, x2] = x;
	return (x1 - 2) ** 2 + (x2 - 10) ** 2;
}

const x0 = new Point(10, 10);

const target = new Point(2, 10);

function runRandomDescent() {
	const f_memo = memoize(f, (arg) => arg.toString());
	const x_min = randomDescent(f_memo, x0, 10, 0.9, 1e-5, 1e6);
	console.log(makeMessage("random descent", x_min, f_memo, f_memo.cache.size));
}

function runNM() {
	const f_memo = memoize(f, (arg) => arg.toString());
	const x_min = nm(f_memo, x0, 1, 1e-8);
	console.log(makeMessage("nedler-mead", x_min, f_memo, f_memo.cache.size));
}

export function run() {
	runRandomDescent();
	runNM();
}
