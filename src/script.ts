import { Matrix, Point, Vector } from "./classes/index.js";

const p = new Point(1, 2);

const v = new Vector(1, 2, 3, 4, 5);

const m = new Matrix(
	new Vector(1, 2),
	new Vector(3, 4),
	new Vector(5, 6),
)

console.log(p.toString());
console.log(v.toString());
console.log(m.toString());