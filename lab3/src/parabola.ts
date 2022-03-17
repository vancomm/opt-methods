function get_x_min(f: (x: number) => number, ...x_arr: number[]) {
  const f_map = x_arr.reduce((acc: { [key: string]: number }, x) => {
    acc[x] = f(x);
    return acc;
  }, {});

  const [[x_min]] = Object.entries(f_map).sort(([, v1], [, v2]) => v1 - v2);

  return Number(x_min);
}

export default function parabola(f: (x: number) => number, eps: number, x0: number) {
  const eps1 = eps;
  const eps2 = eps;
  const dx = 0.001;

  function get_x_bar(x_1: number, x_2: number, x_3: number) {
    const a_1 = (f(x_2) - f(x_1)) / (x_2 - x_1);
    const a_2 = (1 / (x_3 - x_2))
      * (((f(x_3) - f(x_1)) / (x_3 - x_1)) - ((f(x_2) - f(x_1)) / (x_2 - x_1)));

    return (x_1 + x_2) / 2 - a_1 / (2 * a_2);
  }

  function iter(x_1: number, x_2: number, x_3: number): number {
    const x_m = get_x_min(f, x_1, x_2, x_3);
    const x_bar = get_x_bar(x_1, x_2, x_3);

    const x = get_x_min(f, x_m, x_bar);

    if (Math.abs(f(x_m) - f(x_bar)) <= eps1 && Math.abs(x_m - x_bar) <= eps2) {
      return x;
    }
    return iter(x - dx, x, x + dx);
  }

  const _x_1 = x0;
  const _x_2 = _x_1 + dx;

  if (f(_x_1) > f(_x_2)) return iter(_x_1, _x_2, _x_1 + 2 * dx);
  return iter(_x_1 - dx, _x_1, _x_2);
}