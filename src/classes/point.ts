/* eslint-disable no-useless-constructor */
import { Iterable } from './iterable.js';
import { Vector } from './vector.js';

export class Point extends Iterable<number> {
  static subtract(minuend: Point, subtrahend: Point): Vector {
    const [x1, y1] = minuend;
    const [x2, y2] = subtrahend;
    return new Vector([x1 - x2, y1 - y2]);
  }

  constructor(x: number, y: number) {
    super([x, y]);
  }

  subtract(subtrahend: Vector): Point {
    const [x, y] = this;
    const [dx, dy] = subtrahend;
    return new Point(x - dx, y - dy);
  }
}
