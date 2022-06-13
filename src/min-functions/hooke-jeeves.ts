import Point from "../classes/point.js";
import getEi from "../utils/get-e-i.js";

export default function hj(
  f: (x: Point) => number,
  x0: Point,
  a: number,
  h0: number,
  eps: number,
  M: number,
  lambda = 1,
  n = 2,
) {
  const x: Point[] = [];
  x[0] = x0;

  const z: Point[] = [];
  z[1] = x0;

  let h: number[] = [];
  for (let i = 1; i <= n; i++) {
    h[i] = h0;
  }

  let k = 0;
  let i = 1;

  do {
    const zplus = z[i].addVector(getEi(i, n).multiplyByScalar(h[i]));
    const zminus = z[i].subtractVector(getEi(i, n).multiplyByScalar(h[i]));

    if (f(zplus) < f(z[i])) {
      z[i + 1] = zplus;
    } else if (f(zminus) < f(z[i])) {
      z[i + 1] = zminus;
    } else {
      z[i + 1] = z[i];
    }

    if (i < n) {
      i++;
      continue;
    }

    if (f(z[n + 1]) < f(x[k])) {
      x[k + 1] = z[n + 1];
      z[1] = x[k + 1].addVector(x[k + 1].subtractPoint(x[k]).multiplyByScalar(lambda));
      k++;
      i = 1;
      continue;
    }

    const hmax = h.reduce((max, curr) => {
      const len = Math.abs(curr);
      return len > max ? len : max;
    }, -1);

    if (hmax < eps) {
      return x[k];
    }

    h = h.map(v => v * a);
    x[k + 1] = x[k];
    k++;
    i = 1;
  } while (k < M);

  return x[k];
}
