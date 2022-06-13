import { Point } from '../classes/index.js';
import { diffGradient, randomSearch, nm } from '../min-functions/index.js';
import { memoize, makeMessage } from '../utils/index.js';

const f = (p: Point): number => {
  const [x, y] = p;
  return (x ** 4 - x * y + y ** 2 + 3 * x - 2 * y + 1);
}

const x0 = new Point(2, 3);

const target = new Point(-0.846126, 0.576937);
const precision = 4;

function runDiffGradient() {
  const f_memo = memoize(f, (arg) => arg.toString());
  const initialStep = 3;
  const stepDecayFactor = 1 - 1e-3;
  const epsilon = 1e-7;
  const maxIterations = 1e4;

  const [x_min, stopReason, iterCount] = diffGradient(f_memo, x0, initialStep, stepDecayFactor, epsilon, maxIterations);

  const f_min = f(x_min);

  const message = {
    name: "diff gradient",
    x_min,
    f_min,
    fCalls: f_memo.cache.size,
    iterCount,
    target,
    precision,
    stopReason
  };

  console.log(makeMessage(message));
}

function runRandomSearch() {
  const f_memo = memoize(f, (arg) => arg.toString());
  const initialStep = 1;
  const stepDecayFactor = 1 - 1e-3;
  const epsilon = 1e-5;
  const maxIterations = 1e4;

  const [x_min, stopReason, iterCount] = randomSearch(f_memo, x0, initialStep, stepDecayFactor, epsilon, maxIterations);

  const f_min = f(x_min);

  const message = {
    name: "random search",
    x_min,
    f_min,
    fCalls: f_memo.cache.size,
    iterCount,
    target,
    errFunc: (res: Point, tgt: Point) => tgt.subtractPoint(res).length,
    stopReason
  };

  console.log(makeMessage(message));
}

function runNM() {
  const f_memo = memoize(f, (arg) => arg.toString());
  const edgeSize = 10;
  const epsilon = 1e-6;

  const [x_min, stopReason, iterCount] = nm(f_memo, x0, edgeSize, epsilon);

  const f_min = f(x_min);

  const message = {
    name: "nedler-mead",
    x_min,
    f_min,
    fCalls: f_memo.cache.size,
    iterCount,
    target,
    errFunc: (res: Point, tgt: Point) => tgt.subtractPoint(res).length,
    stopReason
  };

  console.log(makeMessage(message));
}

export function run() {
  // runDiffGradient();
  runRandomSearch();
  runNM();
}
