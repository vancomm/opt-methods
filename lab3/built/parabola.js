function get_x_min(f, ...x_arr) {
    const f_map = x_arr.reduce((acc, x) => {
        acc[x] = f(x);
        return acc;
    }, {});
    const [[x_min]] = Object.entries(f_map).sort(([, v1], [, v2]) => v1 - v2);
    return Number(x_min);
}
export default function parabola(f, eps, x0) {
    const eps1 = eps;
    const eps2 = eps;
    const dx = 0.001;
    function get_x_bar(x1, x2, x3) {
        const a_1 = (f(x2) - f(x1)) / (x2 - x1);
        const a_2 = (1 / (x3 - x2))
            * (((f(x3) - f(x1)) / (x3 - x1)) - ((f(x2) - f(x1)) / (x2 - x1)));
        return (x1 + x2) / 2 - a_1 / (2 * a_2);
    }
    function iter(x1, x2, x3) {
        const x_m = get_x_min(f, x1, x2, x3);
        const x_bar = get_x_bar(x1, x2, x3);
        const x = get_x_min(f, x_m, x_bar);
        if (Math.abs(f(x_m) - f(x_bar)) <= eps1 && Math.abs(x_m - x_bar) <= eps2) {
            return x;
        }
        return iter(x - dx, x, x + dx);
    }
    const x1 = x0;
    const x2 = x1 + dx;
    if (f(x1) > f(x2))
        return iter(x1, x2, x1 + 2 * dx);
    return iter(x1 - dx, x1, x2);
}
