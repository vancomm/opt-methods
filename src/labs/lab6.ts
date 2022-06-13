import { Point } from '../classes/index.js';
import { penalty } from '../min-functions/index.js';
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

	const x0 = new Point(-1, -1);

	const f_memo = memoize(f, (arg) => arg.toString());

	const pen = 1;
	const penCoef = 10;

	const epsilon = 1e-1;

	const nmParams = {
		edgeSize: 3,
		epsilon: 1e-2
	}

	const maxIterations = 1e4;

	const [x_min, iterCount, stopReason] = penalty(x0, f_memo, g, m, p, epsilon, nmParams, pen, penCoef, maxIterations);

	const messageParams = {
		name: "penalty method",
		x_min,
		f_min: f(x_min),
		fCalls: f_memo.cache.size,
		iterCount,
		target: new Point(4.12325, 8.90273),
		errFunc: (res: Point, tgt: Point) => tgt.subtractPoint(res).length,
		precision: 4,
		stopReason
	}

	console.log(makeMessage(messageParams));
}

export function run() {
	runPenalty();
}
