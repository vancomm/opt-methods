import { Matrix } from "./classes/index.js";
export function lm(f, gradf, hesse, x0, params) {
    const { eps1, M, mu } = params;
    function start(xk, k) {
        function iter1(xk, mu, k) {
            if (gradf(xk).norm < eps1 || k >= M)
                return xk;
            return iter2(xk, mu, k);
        }
        function iter2(xk, mu, k) {
            const d = Matrix.multiply(hesse(xk)
                .add(Matrix.identity
                .multiply(mu))
                .inverse, gradf(xk));
            const xk_next = xk.subtract(d);
            if (f(xk_next) < f(xk))
                return iter1(xk_next, mu / 2, k + 1);
            return iter2(xk, 2 * mu, k);
        }
        return iter1(xk, mu, k);
    }
    return start(x0, 0);
}
