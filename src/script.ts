import { Matrix } from "./classes/matrix.js";
import { Vector } from "./classes/vector.js";

const v1 = new Vector(2, 3);
const v2 = new Vector(6, 5);

console.log(v1.dotProduct(v2).toString());
console.log(v2.dotProduct(v1).toString());

