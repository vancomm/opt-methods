function get_x_min(f, ...x_arr) {
  const f_map = x_arr.reduce((acc, x) => {
    acc[x] = f(x);
    return acc;
  }, {});

  const [[x_min]] = Object.entries(f_map).sort(([, v1], [, v2]) => v1 - v2);

  return Number(x_min);
}

function brute(a, b, eps, f) {
  const n = Math.ceil((b - a) / eps);
  const step = (b - a) / n;

  const x_arr = [...Array(n + 1).keys()].map((i) => a + i * step);

  return get_x_min(f, ...x_arr);
}

function bisect(a, b, eps, f) {
  function iter(left, right, prec, func) {
    const l = right - left;

    const x_m = (right + left) / 2;
    const x_1 = left + l / 4;
    const x_2 = right - l / 4;

    if (l <= prec) return get_x_min(f, x_1, x_m, x_2);

    if (f(x_1) < f(x_m)) return iter(left, x_m, prec, func);

    if (f(x_2) < f(x_m)) return iter(x_m, right, prec, func);

    return iter(x_1, x_2, prec, func);
  }

  return iter(a, b, eps, f);
}

function parabola(a, b, eps, f) {
  const eps1 = eps;
  const eps2 = eps;
  const dx = 0.001;

  function get_x_bar(x_1, x_2, x_3) {
    const a_1 = (f(x_2) - f(x_1)) / (x_2 - x_1);
    const a_2 = (1 / (x_3 - x_2))
      * (((f(x_3) - f(x_1)) / (x_3 - x_1)) - ((f(x_2) - f(x_1)) / (x_2 - x_1)));

    return (x_1 + x_2) / 2 - a_1 / (2 * a_2);
  }

  function iter(x_1, x_2, x_3) {
    const x_m = get_x_min(f, x_1, x_2, x_3);
    const x_bar = get_x_bar(x_1, x_2, x_3);

    const x = get_x_min(f, x_m, x_bar);

    if (Math.abs(f(x_m) - f(x_bar)) <= eps1 && Math.abs(x_m - x_bar) <= eps2) {
      return x;
    }
    return iter(x - dx, x, x + dx);
  }

  const _x_1 = a;
  const _x_2 = _x_1 + dx;

  if (f(_x_1) > f(_x_2)) return iter(_x_1, _x_2, _x_1 + 2 * dx);
  return iter(_x_1 - dx, _x_1, _x_2);
}

export default [brute, bisect, parabola];
