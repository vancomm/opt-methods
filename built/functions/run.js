import { Point, Vector, Matrix } from '../classes/index.js';
import { Memoized } from '../utils/index.js';
import { descent, steepest, lm, } from '../functions';
function toPrecision(number, precision) {
    const string = number.toFixed(precision);
    return Number(string);
}
function getMessage(name, x_m, f) {
    const precision = 4;
    const { x, y } = x_m;
    const message = [
        `${name}`,
        `x_m:\t(${toPrecision(x, precision)}, ${toPrecision(y, precision)})`,
        `f(x_m):\t${toPrecision(f(x_m), 4)}`,
    ].join('\n');
    return message;
}
function runDescent() {
    function f(point) {
        const { x, y } = point;
        return 3 * (Math.pow(x, 2)) + x * y + 2 * (Math.pow(y, 2)) - x - 4 * y;
    }
    function gradf(point) {
        const { x, y } = point;
        return new Vector((6 * x + y - 1), (x + 4 * y - 4));
    }
    const f_memo = new Memoized(f);
    const f_call = f_memo.call.bind(f_memo);
    const gf_memo = new Memoized(gradf);
    const gf_call = gf_memo.call.bind(gf_memo);
    const x0 = new Point(2, 2);
    const params = {
        eps1: 0.0001,
        eps2: 0.0001,
        M: 1000,
        gamma: 0.1,
    };
    const message = getMessage('descent', descent(f_call, gf_call, x0, params), f);
    return `${f_memo.cache}\n${gf_memo.cache}`;
}
function runSteepest() {
    function f(point) {
        const { x, y } = point;
        return 3 * (Math.pow(x, 2)) + x * y + 2 * (Math.pow(y, 2)) - x - 4 * y;
    }
    function gradf(point) {
        const { x, y } = point;
        return new Vector((6 * x + y - 1), (x + 4 * y - 4));
    }
    const x0 = new Point(2, 2);
    const params = {
        eps1: 0.0001,
        eps2: 0.0001,
        M: 1000,
        gamma: 0.1,
    };
    return getMessage('steepest', steepest(f, gradf, x0, params), f);
}
function runLM() {
    function f(point) {
        const { x, y } = point;
        return 100 * Math.pow((x - Math.pow(y, 2)), 2) + Math.pow((Math.pow(x, 2) - y), 2);
    }
    function gradf(point) {
        const dfdx = (x, y) => (4 * x * (Math.pow(x, 2) - y) + 200 * x - 200 * (Math.pow(y, 2)));
        const dfdy = (x, y) => -2 * (Math.pow(x, 2)) - 400 * y * (x - Math.pow(y, 2)) + 2 * y;
        const { x, y } = point;
        return new Vector(dfdx(x, y), dfdy(x, y));
    }
    function hesse(point) {
        const dfdfdxdy = (x, y) => -4 * x - 400 * y;
        const dfdfdxdx = (x, y) => 12 * (Math.pow(x, 2)) - 4 * y + 200;
        const dfdfdydy = (x, y) => -400 * x + 1200 * (Math.pow(y, 2)) + 200;
        const { x, y } = point;
        return new Matrix([
            [dfdfdxdx(x, y), dfdfdxdy(x, y)],
            [dfdfdxdy(x, y), dfdfdydy(x, y)],
        ]);
    }
    const x0 = new Point(100, 100);
    const params = {
        eps1: 0.0001,
        M: 1000,
        mu: 0.001,
    };
    return getMessage('leveberg-marquardt', lm(f, gradf, hesse, x0, params), f);
}
export default [runDescent, runSteepest, runLM];
