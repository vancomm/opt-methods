import { Point } from "./classes/index.js";
import parabola from "./parabola.js";
export function steepest(f, gradf, x0, params) {
    const { eps1, eps2, gamma, M } = params;
    let previous_k = false;
    function iter(xk, k) {
        if (gradf(xk).norm < eps1 || k >= M)
            return xk;
        function phi(gamma) {
            return f(xk.subtract(gradf(xk).multiply(gamma)));
        }
        const gamma_star = parabola(phi, eps1, gamma);
        const xk_next = xk.subtract(gradf(xk).multiply(gamma_star));
        if (Point.subtract(xk_next, xk).norm <= eps2 && Math.abs(f(xk_next) - f(xk)) <= eps2) {
            if (previous_k)
                return xk_next;
            previous_k = true;
            return iter(xk_next, k + 1);
        }
        previous_k = false;
        return iter(xk_next, k + 1);
    }
    return iter(x0, 0);
}
