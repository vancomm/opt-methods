import Point from '../classes/point.js';
import Matrix from '../classes/matrix.js';
import { sum } from '../utils/func-math.js';
import { maxArg, minArg } from '../utils/simple-min-max.js';
import replace from '../utils/replace.js';
import getCentroid from '../utils/get-centroid.js';

function generateSimplexVetrices(x0: Point, a: number, n: number): Point[] {
  const r = a * (Math.sqrt(n + 1) - 1 + n) / (n * Math.SQRT2);
  const s = a * (Math.sqrt(n + 1) - 1) / (n * Math.SQRT2);
  const points = Matrix.Generate(n, n, (i, j) => (i === j) ? r : s)
    .rows.map((v) => x0.addVector(v));
  return [x0, ...points];
}

export default function nm(
  f: (x: Point) => number, x0: Point,
  a: number, eps: number,
  alpha = 1, gamma = 2,
  beta = 0.5, delta = 0.5,
): [Point, string, number] {
  const n = x0.count;

  let x_arr = generateSimplexVetrices(x0, a, n);
  let res: Point;
  // let x_h: Point, x_l: Point, x_bar: Point, x_star: Point, x_starstar: Point;

  // let y_arr: number[];
  // let y_h: number, y_l: number, y_bar: number, y_star: number, y_starstar: number;

  let stop1: boolean, stop2: boolean, stop3: boolean;

  let rmsY: number, rangeY: number, rmsX: number;

  let k = 0;

  do {
    const y_arr = x_arr.map(f);

    const x_h = maxArg(f, ...x_arr);
    const y_h = f(x_h);

    const x_l = minArg(f, ...x_arr);
    const y_l = f(x_l);

    const x_bar = getCentroid(...x_arr.filter((p) => p != x_h));
    const y_bar = f(x_bar);

    const x_star = x_bar.addVector(x_bar.subtractPoint(x_h).multiplyByScalar(alpha));
    const y_star = f(x_star);

    if (y_star < y_l) {
      const x_starstar = x_bar.addVector(x_star.subtractPoint(x_bar).multiplyByScalar(gamma));
      const y_starstar = f(x_starstar);

      if (y_starstar < y_l) {
        x_arr = replace(x_arr, x_starstar, (x) => x == x_h);
      } else {
        x_arr = replace(x_arr, x_star, (x) => x == x_h);
      }

    } else if (y_arr.every((y) => (y === y_h) || y_star > y)) {

      if (!(y_star > y_h)) {
        x_arr = replace(x_arr, x_star, (x) => x == x_h);
      }

      const x_starstar = x_bar.addVector(x_h.subtractPoint(x_bar).multiplyByScalar(beta));
      const y_starstar = f(x_starstar);

      if (y_starstar > y_h) {
        x_arr = x_arr.map((x) => x.addVector(x.subtractPoint(x_l).multiplyByScalar(delta)));
      } else {
        x_arr = replace(x_arr, x_starstar, (x) => x == x_h);
      }

    } else {
      x_arr = replace(x_arr, x_star, (x) => x == x_h);
    }

    rmsY = Math.sqrt((1 / n * sum(...y_arr.map((y) => (y - y_bar) ** 2))));
    rangeY = y_h - y_l;
    rmsX = Math.sqrt(sum(...x_arr.map((x) => x.subtractPoint(x_bar)).map((v) => v.dotProduct(v))));
    res = x_bar;

    stop1 = rmsY <= eps;
    stop2 = rangeY <= eps;
    stop3 = rmsY <= eps * rmsX;

    k++;
  } while (!(stop1 || stop2 || stop3));

  const message1 =
    `
		rms deviation of function values in simplex 
		vertices is smaller or equal to epsilon
		(${rmsY} <= ${eps})`;
  const message2 =
    `
		range of function values in simplex vertices
		is smaller or equal to epsilon
		(${rangeY} <= ${eps})`;
  const message3 =
    `
		rms deviation of function values in simplex 
		vertices is smaller or equal to rms deviation 
		of simplex vertices multiplied by epsilon
		(${rmsY} <= ${eps * rmsX})`;

  const reasons = [];
  if (stop1) reasons.push(message1);
  if (stop2) reasons.push(message2);
  if (stop3) reasons.push(message3);
  const reason = reasons.map((r, i) => (i === 0) ? r.substring(3) : r).join('\n');

  return [res, reason, k];
}
