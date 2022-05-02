import { Point, Vector } from "../classes/index.js";

export function getCenter(...x_arr: Point[]): Point {
	return x_arr
		.map((p) => new Vector(...p))
		.map((v) => v.multiplyByScalar(1 / x_arr.length))
		.reduce((sum, curr) => sum.add(curr)).toPoint();
}