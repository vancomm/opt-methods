import Point from '../classes/point.js';
import Vector from '../classes/vector.js';

export default function getCentroid(...x_arr: Point[]): Point {
  return x_arr
    .map((p) => new Vector(...p))
    .map((v) => v.multiplyByScalar(1 / x_arr.length))
    .reduce((sum, curr) => sum.add(curr)).toPoint();
}