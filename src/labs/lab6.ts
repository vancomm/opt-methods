import { Point } from '../classes/index.js';
import { penalty, barrier } from '../min-functions/index.js';
import { memoize, makeMessage } from '../utils/index.js';

function runPenalty() {
	const f = (p: Point): number => {
		const [x, y] = p;
		return 4 * x - y ** 2 - 12;
	}

	const g = [
		// g(x) <= 0
		([x, y]: Point) => -x,

		// g(x) <= 0
		([x, y]: Point) => -y,

		// g(x) <= 0
		([x, y]: Point) => -(10 * x - x ** 2 + 10 * y - y ** 2 - 34),
	];

	const m = 0;
	const p = g.length;

	const target = new Point(4.12325, 8.90273);
	const precision = 4;

	const x0 = new Point(-1, -1);

	const f_memo = memoize(f, (arg) => arg.toString());

	const epsilon = 1e-6;

	const nmParams = {
		edgeSize: 10,
		epsilon: 1e-6
	}

	const pen = 1e-2;
	const penCoef = 2;
	const maxIterations = 1e4;

	const [x_min, stopReason, iterCount] = penalty(x0, f_memo, g, m, p, epsilon, nmParams, pen, penCoef, maxIterations);

	const f_min = f(x_min);

	const message = {
		name: "penalty method",
		x_min,
		f_min,
		fCalls: f_memo.cache.size,
		iterCount,
		target,
		precision,
		stopReason
	}

	console.log(makeMessage(message));
}

function runBarrier() {
	const f = (p: Point) => {
		const [x, y] = p;
		return 4 / x + 9 / y + x + y;
	};

	const g = [
		// g(x) <= 0
		([x, y]: Point) => x + y - 6,

		// g(x) <= 0
		([x, y]: Point) => -x,

		// g(x) <= 0
		([x, y]: Point) => -y,
	];

	const m = 0;

	const p = g.length;

	const target = new Point(2, 3);
	const precision = 4;

	const x0 = new Point(5, 1);

	const f_memo = memoize(f, (arg) => arg.toString());

	const epsilon = 1e-6;

	const rsParams = {
		initialStep: 1,
		stepDecayFactor: 1e-1,
		epsilon: 1e-4,
		maxIterations: 1e4,
	};

	const pen = 1;
	const penCoef = 10;
	const maxIterations = 1e4;

	const [x_min, stopReason, iterCount] = barrier(x0, f_memo, g, m, p, epsilon, rsParams, pen, penCoef, maxIterations);

	const f_min = f(x_min);

	console.log(iterCount);

	const message = {
		name: "barrier method",
		x_min,
		f_min,
		fCalls: f_memo.cache.size,
		iterCount,
		target,
		precision,
		stopReason
	}

	console.log(makeMessage(message));
}

export function run() {
	runPenalty();
	runBarrier();
}
