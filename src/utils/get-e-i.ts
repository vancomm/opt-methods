import { Vector } from "../classes/index.js";
import { range } from "./range.js";

export function getEi(i: number, n: number) {
	const values = range(n).map((_, index) => (index == i - 1) ? 1 : 0);
	return new Vector(...values);
}