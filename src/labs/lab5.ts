import Point from '../classes/point.js';
import randomSearch from '../min-functions/random-search.js';
import nm from '../min-functions/nelder-mead.js';
import memoize from '../utils/memoize.js';
import makeMessage from '../utils/make-message.js';

const f = (p: Point): number => {
  const [x, y] = p;
  return (x ** 4 - x * y + y ** 2 + 3 * x - 2 * y + 1);
};

const x0 = new Point(2, 3);

const target = new Point(-0.846126, 0.576937);

function runRandomSearch() {
  const f_memo = memoize(f, (arg) => arg.toString());
  const initialStep = 1;
  const stepDecayFactor = 1 - 1e-3;
  const epsilon = 1e-5;
  const maxIterations = 1e4;

  const [x_min, stopReason, iterCount] = randomSearch(f_memo, x0, initialStep, stepDecayFactor, epsilon, maxIterations);

  const f_min = f(x_min);

  const message = {
    name: 'random search',
    x_min,
    f_min,
    fCalls: f_memo.cache.size,
    iterCount,
    target,
    errFunc: (res: Point, tgt: Point) => tgt.subtractPoint(res).length,
    stopReason,
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
    name: 'nedler-mead',
    x_min,
    f_min,
    fCalls: f_memo.cache.size,
    iterCount,
    target,
    errFunc: (res: Point, tgt: Point) => tgt.subtractPoint(res).length,
    stopReason,
  };

  console.log(makeMessage(message));
}

export function run() {
  runRandomSearch();
  runNM();
}
