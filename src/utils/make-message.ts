import { Point } from "../classes/index.js";
import { toPrecision } from "./to-precision.js";
import { green, red, yellow } from "./color.js";

export function makeMessage(
	name: string,
	x_m: Point,
	f: (point: Point) => number,
	callsF: number,
	target?: Point,
	precision?: number,
): string {
	const [x, y] = x_m.map((v) => toPrecision(v, precision));
	let colorFunc = (text: any) => text;
	if (target) {
		const [X, Y] = target.map((v) => toPrecision(v, precision));
		colorFunc = (x === X) && (y === Y) ? green : red;
	}
	const point = colorFunc(`(${x}, ${y})`);
	const text = [
		`${yellow(name)}`,
		`x_m:\t\t${point}`,
		`f(x_m):\t\t${toPrecision(f(x_m), precision)}`,
		`f calls:\t${callsF}`,
	].join('\n');
	return text;
}