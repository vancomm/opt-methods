import { Iterable } from './iterable.js';
import { Vector } from './vector.js';

export class Point extends Iterable<number> {
  get count() {
    return [...this].length;
  }

  at(index: number): number {
    return [...this][index];
  }

  map(callbackfn: (value: number, index: number, array: number[]) => number, thisArg?: any): Point {
    const values = [...this].map(callbackfn, thisArg);
    return new Point(...values);
  }

  addPoint(point: Point): Vector {
    if (point.count !== this.count) throw new Error('Invalid argument!');
    return new Vector(...this.map((value, i) => value + point.at(i)));
  }

  subtractPoint(point: Point): Vector {
    if (point.count !== this.count) throw new Error('Invalid argument!');
    return new Vector(...this.map((value, i) => value - point.at(i)));
  }

  addVector(vector: Vector): Point {
    if (vector.count !== this.count) throw new Error('Invalid argument!');
    return this.map((value, i) => value + vector.at(i));
  }

  subtractVector(vector: Vector): Point {
    if (vector.count !== this.count) throw new Error('Invalid argument!');
    return this.map((value, i) => value - vector.at(i));
  }

}
