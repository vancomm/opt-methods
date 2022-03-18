import { Point } from '../classes/index.js';
export function descent(f, gradf, x0, params) {
    const { eps1, eps2, gamma, M, } = params;
    function iter(xk, k) {
        if (gradf(xk).norm < eps1 || k >= M)
            return xk;
        function get_x_next(g) {
            const xk_next = xk.subtract(gradf(xk).multiply(g));
            if (f(xk_next) - f(xk) >= 0)
                return get_x_next(g / 2);
            return xk_next;
        }
        const xk_next = get_x_next(gamma);
        if (Point.subtract(xk_next, xk).norm <= eps2 && Math.abs(f(xk_next) - f(xk)) <= eps2) {
            return xk_next;
        }
        return iter(xk_next, k + 1);
    }
    return iter(x0, 0);
}
