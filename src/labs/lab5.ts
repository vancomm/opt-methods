import { Point } from '../classes/index.js';
import { randomSearch, nm } from '../functions/index.js';
import { memoize, makeMessage, gray } from '../utils/index.js';

const f = (p: Point): number => {
	const [x, y] = p;
	return (x ** 4 - x * y + y ** 2 + 3 * x - 2 * y + 1);
}

const x0 = new Point(15, -30);

const target = new Point(-0.846126, 0.576937);
const precision = 4;

function runRandomDescent() {
	const f_memo = memoize(f, (arg) => arg.toString());
	const initialStep = 3;
	const stepDecayFactor = 1 - 1e-3;
	const epsilon = 1e-5;
	const maxIterations = 1e4;

	const [x_min, reason] = randomSearch(f_memo, x0, initialStep, stepDecayFactor, epsilon, maxIterations);

	console.log(makeMessage("random search", x_min, f_memo, f_memo.cache.size, target, precision));
	console.log(gray(`stop reason:\t${reason}`, false));
}

function runNM() {
	const f_memo = memoize(f, (arg) => arg.toString());
	const edgeSize = 10;
	const epsilon = 1e-6;

	const [x_min, reason] = nm(f_memo, x0, edgeSize, epsilon);

	console.log(makeMessage("nedler-mead", x_min, f_memo, f_memo.cache.size, target, precision));
	console.log(gray(`stop reason:\t${reason}`, false));
}

export function run() {
	runRandomDescent();
	runNM();
}
