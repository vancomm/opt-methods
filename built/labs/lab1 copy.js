import { brute, bisect, parabola } from '../functions/index.js';
import { Memoized } from '../utils/index.js';
export function run() {
    const a = 1;
    const b = 4;
    const eps = 0.0005;
    const f = (x) => x - 2 * Math.log(x);
    const x_m = 2;
    function runFunc(minFunc) {
        const f_memo = new Memoized(f);
        const f_call = f_memo.call.bind(f_memo);
        const { name } = minFunc;
        const x_mi = minFunc(f_call, eps, [a, b]);
        const f_mi = f(x_mi);
        const calls = Object.keys(f_memo.cache).length;
        return [
            name,
            `x_mi\t\t${x_mi}`,
            `f_mi\t\t${f_mi}`,
            `precision\t${eps}`,
            `success\t\t${eps > Math.abs(x_mi - x_m)}`,
            `calls\t\t${calls}`,
        ].join('\n');
    }
    const results = [brute, bisect, parabola].map(runFunc).join('\n\n');
    // const result = runFunc(brute);
    // const result = runFunc(bisect);
    // const result = runFunc(parabola);
    console.log(results);
    // console.log(result);
}
run();
// console.log(get_x_min((x) => -x, 0, 1, 2));
// const f = (x: number) => x;
// const f_memo = new Memoized(f);
// const f_call = f_memo.call.bind(f_memo);
// const a1 = f_call(1);
// const a2 = f_call(1);
// const b = f_call(2);
// console.log(f(1), a1, a2, b, f_memo.cache);
