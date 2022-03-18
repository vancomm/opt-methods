export function get_x_min(f: (x: number) => number, ...x_arr: number[]) {
  const f_map: { [key: string]: number } = x_arr.reduce((acc: { [key: string]: number }, x) => {
    acc[String(x)] = f(x);
    return acc;
  }, {});

  const [[x_min]] = Object.entries(f_map).sort(([, v1], [, v2]) => v1 - v2);

  return Number(x_min);
}
