import { Vector } from "./classes.js";
export function descent(f, gradf, x0, params) {
    const { eps1, eps2, gamma, M } = params;
    function iter(xk, k) {
        if (gradf(xk).norm < eps1) {
            console.log(`Precision eps1 = ${eps1} achieved, exiting`);
            return xk;
        }
        if (k >= M) {
            console.log(`Number of iterations exceeded M = ${M}, exiting`);
            return xk;
        }
        function get_x_next(gamma) {
            const xk_next = xk.subtract(gradf(xk).multiply(gamma));
            if (f(xk_next) - f(xk) >= 0)
                return get_x_next(gamma / 2);
            return xk_next;
        }
        ;
        const xk_next = get_x_next(gamma);
        if (Vector.subtract(xk_next, xk).norm <= eps2 && Math.abs(f(xk_next) - f(xk)) <= eps2) {
            console.log(`Precision eps2 = ${eps2} achieved, exiting`);
            return xk_next;
        }
        return iter(xk_next, k + 1);
    }
    return iter(x0, 0);
}
