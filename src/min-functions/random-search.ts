import Point from '../classes/point.js';
import Vector from '../classes/vector.js';
import range from '../utils/range.js';
import random from '../utils/random.js';

function getRandomOrt() {
  const randomVector = new Vector(...range(2).map(() => random(-1, 1)));
  return randomVector.normalize();
}

export default function randomSearch(
  f: (x: Point) => number, x0: Point,
  a0: number, lambda: number, eps: number,
  M: number, 		// max total iterations
  n = 2, 				// max tests per point
): [Point, string, number] {
  let k = 0;
  let i = 1;

  const x = [x0];
  let a = a0;

  do {
    const h = getRandomOrt();

    const yk = x[k].addVector(h.multiplyByScalar(a));

    if (f(yk) < f(x[k])) {
      x[k + 1] = yk;
      k++;
      i = 1;
      continue;
    }

    if (i < n) {
      i++;
      continue;
    }

    if (a < eps) {
      return [x[k], `step too small\n\t\t(${a} < ${eps})`, k];
    }

    a *= lambda;
    i = 1;

  } while (k < M);
  return [x[k], `too many iterations\n\t\t(${k})`, k];
}
