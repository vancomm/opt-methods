import { Point } from "../classes/index.js";
import { toPrecision } from "./to-precision.js";
import { gray, green, red, yellow } from "./color.js";

export function makeMessage(
	name: string,
	x_min: Point,
	f_min: number,
	callsF: number,
	target?: Point,
	precision?: number,
	stopReason?: string,
): string {
	const [x, y] = x_min.map((v) => toPrecision(v, precision));
	let colorFunc = (text: any) => text;
	if (target) {
		const [X, Y] = target.map((v) => toPrecision(v, precision));
		colorFunc = (x === X) && (y === Y) ? green : red;
	}
	const point = colorFunc(`(${x}, ${y})`);
	const lines = [
		`${yellow(name)}`,
		`x_m:\t\t${point}`,
		`f(x_m):\t\t${toPrecision(f_min, precision)}`,
		`f calls:\t${callsF}`,
	];
	if (stopReason) lines.push(gray(`stop reason:\t${stopReason}`, false));
	const text = lines.join('\n');
	return text;
}