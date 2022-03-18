import { midpoint, secant } from '../functions/index.js';
import { Memoized } from '../utils/index.js';
const [a, b] = [2, 6];
const eps = 0.002;
const f = (x) => -5 * Math.pow(x, 2) * Math.pow(Math.E, (-x / 2));
const df = (x) => 2.5 * (x - 4) * Math.pow(x, Math.pow(Math.E, (-x / 2)));
export function run() {
    const runFunc = (minFunc) => {
        const df_memo = new Memoized(df);
        const { name } = minFunc;
        const x_m = minFunc(df_memo.call.bind(df_memo), eps, [a, b]);
        const df_calls = Object.keys(df_memo.cache).length;
        return [
            name,
            `x*:\t\t${x_m}`,
            `f_m:\t\t${f(x_m)}`,
            `f'(x) calls:\t${df_calls}`,
        ].join('\n');
    };
    const results = [midpoint, secant].map(runFunc).join('\n\n');
    console.log(results);
}
