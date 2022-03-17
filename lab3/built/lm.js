import { Matrix } from "./classes.js";
export function lm(f, gradf, hesse, x0, params) {
    const { eps1, M, mu } = params;
    function start(xk, k) {
        function iter3(xk, mu, k) {
            if (gradf(xk).norm < eps1) {
                console.log(`Precision eps1 = ${eps1} achieved, exiting`);
                return xk;
            }
            if (k >= M) {
                console.log(`Number of iterations exceeded M = ${M}, exiting`);
                return xk;
            }
            return iter7(xk, mu, k);
        }
        function iter7(xk, mu, k) {
            const d = Matrix.multiply(hesse(xk)
                .add(Matrix.identity
                .multiply(mu))
                .inverse, gradf(xk));
            const xk_next = xk.subtract(d);
            if (f(xk_next) < f(xk))
                return iter3(xk_next, mu / 2, k + 1);
            return iter7(xk, 2 * mu, k);
        }
        return iter3(xk, mu, k);
    }
    return start(x0, 0);
}
