import { Matrix, Point, Vector } from './classes.js';
import { descent } from './descent.js';
import { lm } from './lm.js';
function runDescent() {
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
    const x_m = descent(f, gradf, x0, params);
    console.log(x_m);
    console.log(f(x_m));
}
function runLM() {
    function f(point) {
        const { x, y } = point;
        return 100 * Math.pow((x - Math.pow(y, 2)), 2) + Math.pow((Math.pow(x, 2) - y), 2);
        // return x ** 4 - x * y + y ** 4 + 3 * x - 2 * y + 1;
    }
    function gradf(point) {
        const dfdx = (x, y) => (4 * x * (Math.pow(x, 2) - y) + 200 * x - 200 * (Math.pow(y, 2)));
        // 4 * x ** 3 - y + 3;
        const dfdy = (x, y) => -2 * (Math.pow(x, 2)) - 400 * y * (x - Math.pow(y, 2)) + 2 * y;
        // -x + 4 * y ** 3 - 2;
        const { x, y } = point;
        return new Vector(dfdx(x, y), dfdy(x, y));
    }
    function hesse(point) {
        const dfdfdxdy = (x, y) => -4 * x - 400 * y;
        // -1;
        const dfdfdxdx = (x, y) => 12 * (Math.pow(x, 2)) - 4 * y + 200;
        // 12 * x ** 2;
        const dfdfdydy = (x, y) => -400 * x + 1200 * (Math.pow(y, 2)) + 200;
        // 12 * y ** 2;
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
    const x_m = lm(f, gradf, hesse, x0, params);
    console.log(x_m);
    console.log(f(x_m));
}
export default function run() {
    runDescent();
    runLM();
}
