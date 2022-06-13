import Point from '../classes/point.js';
import { sigma } from '../utils/func-math.js';
import randomSearchWithCheck from './random-search-with-check.js';

export default function barrier(
  x0: Point, f: (x: Point) => number,
  g: ((x: Point) => number)[],
  m: number, p: number,
  eps: number,
  rsParams = {
    initialStep: 1,
    stepDecayFactor: 1 - 1e-3,
    epsilon: 1e-5,
    maxIterations: 1e4,
  },
  r0 = 1e-2, C = 4, M = 1e4,
): [Point, string, number] {

  function checkInside(x: Point) {
    const gEqs = g.slice(0, m);
    const gLeqs = g.slice(m, p);

    const first = gEqs.every((geq) => geq(x) === 0);
    const second = gLeqs.every((gleq) => gleq(x) <= 0);

    return first && second;
  }

  // penalty function
  function P(x: Point, rk: number) {
    const gx = (j: number) => g[j](x);
    const oneOverGx = (j: number) => 1 / gx(j);
    return rk * sigma(oneOverGx)(0)(m - 1);
  }

  // auxiliary function
  function F(x: Point, rk: number) {
    return f(x) - P(x, rk);
  }

  const { initialStep, stepDecayFactor, epsilon, maxIterations } = rsParams;

  let k = 0;
  let xk = x0;
  let rk = r0;

  do {
    k++;
    const [xk_star] = randomSearchWithCheck(
      (x: Point) => F(x, rk), xk,
      checkInside,
      initialStep, stepDecayFactor, epsilon, maxIterations);

    const pen = P(xk_star, rk);

    if (pen <= eps) return [xk_star, 'precision achieved', k];

    rk /= C;
    xk = xk_star;
  } while (k < M);

  return [xk, 'too many iterations', k];
}

// function runBarrier() {
// 	const f = (p: Point) => {
// 		const [x, y] = p;
// 		return 4 / x + 9 / y + x + y;
// 	};

// 	const g = [
// 		// g(x) <= 0
// 		([x, y]: Point) => x + y - 6,

// 		// g(x) <= 0
// 		([x, y]: Point) => -x,

// 		// g(x) <= 0
// 		([x, y]: Point) => -y,
// 	];

// 	const m = 0;

// 	const p = g.length;

// 	const target = new Point(2, 3);
// 	const precision = 4;

// 	const x0 = new Point(5, 1);

// 	const f_memo = memoize(f, (arg) => arg.toString());

// 	const epsilon = 1e-6;

// 	const rsParams = {
// 		initialStep: 1,
// 		stepDecayFactor: 1e-1,
// 		epsilon: 1e-4,
// 		maxIterations: 1e4,
// 	};

// 	const pen = 1;
// 	const penCoef = 10;
// 	const maxIterations = 1e4;

// 	const [x_min, stopReason, iterCount] = barrier(x0, f_memo, g, m, p, epsilon, rsParams, pen, penCoef, maxIterations);

// 	const f_min = f(x_min);

// 	const message = {
// 		name: "barrier method",
// 		x_min,
// 		f_min,
// 		fCalls: f_memo.cache.size,
// 		iterCount,
// 		target,
// 		precision,
// 		stopReason
// 	}

// 	console.log(makeMessage(message));
// }
