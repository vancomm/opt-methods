/* eslint-disable no-useless-constructor */
import { Iterable } from './iterable.js';
import { Vector } from './vector.js';

export class Point extends Iterable<number> {
  static SubtractPoint(minuend: Point, subtrahend: Point): Vector {
    const [x1, y1] = minuend;
    const [x2, y2] = subtrahend;
    return new Vector([x1 - x2, y1 - y2]);
  }

  static SubtractVector(point: Point, vector: Vector): Point {
    if (vector.length !== 2) throw new Error('Invalid argument!');
    const [x, y] = point;
    const [dx, dy] = vector;
    return new Point(x - dx, y - dy);
  }

  static ToString(point: Point): string {
    return [...point].join(', ');
  }

  constructor(x: number, y: number) {
    super([x, y]);
  }

  subtractPoint(point: Point): Vector {
    return Point.SubtractPoint(this, point);
  }

  subtractVector(vector: Vector): Point {
    return Point.SubtractVector(this, vector);
  }

  toString(): string {
    return Point.ToString(this);
  }
}
