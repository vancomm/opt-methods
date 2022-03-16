function norm(vector) {
    const [x1, x2] = vector;
    return Math.sqrt(Math.pow(x1, 2) + Math.pow(x2, 2));
}
const subtract = (minuend, subtrahend) => {
    const [x1, y1] = minuend;
    const [x2, y2] = subtrahend;
    return [x1 - x2, y1 - y2];
};
const multiply = (multiplier, vector) => {
    const [x, y] = vector;
    return [multiplier * x, multiplier * y];
};
export function descent(f, gradf, x0, params) {
    const { eps1, eps2, M } = params;
    let k = 0;
    function iter(xk) {
        if (norm(gradf(xk)) < eps1) {
            console.log(`Precision eps1 = ${eps1} achieved, exiting`);
            return xk;
        }
        if (k >= M) {
            console.log(`Number of iterations exceeded M = ${M}, exiting`);
            return xk;
        }
        let { gamma } = params;
        let xk_next = subtract(xk, multiply(gamma, gradf(xk)));
        while (f(xk_next) - f(xk) >= 0) {
            gamma /= 2;
            xk_next = subtract(xk, multiply(gamma, gradf(xk)));
        }
        if (norm(subtract(xk_next, xk)) <= eps2 && Math.abs(f(xk_next) - f(xk)) <= eps2) {
            console.log(`Precision eps2 = ${eps2} achieved, exiting`);
            return xk_next;
        }
        k += 1;
        return iter(xk_next);
    }
    return iter(x0);
}
