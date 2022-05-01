/* eslint-disable no-useless-constructor */
import { Iterable } from './iterable.js';
import { Vector } from './vector.js';

export class Point extends Iterable<number> {
  constructor(x: number, y: number) {
    super(x, y);
  }

  addVector(vector: Vector): Point {
    if (vector.count !== 2) throw new Error('Invalid argument!');
    const [x, y] = this;
    const [dx, dy] = vector;
    return new Point(x + dx, y + dy);
  }

  subtractPoint(point: Point): Vector {
    const [x1, y1] = this;
    const [x2, y2] = point;
    return new Vector(x1 - x2, y1 - y2);
  }

  subtractVector(vector: Vector): Point {
    if (vector.count !== 2) throw new Error('Invalid argument!');
    const [x, y] = this;
    const [dx, dy] = vector;
    return new Point(x - dx, y - dy);
  }

  toString(): string {
    return `(${[...this].join(', ')})`;
  }
}
