export function get_x_min(f, ...x_arr) {
    const f_map = x_arr.reduce((acc, x) => {
        acc[String(x)] = f(x);
        return acc;
    }, {});
    const [[x_min]] = Object.entries(f_map).sort(([, v1], [, v2]) => v1 - v2);
    return Number(x_min);
}
