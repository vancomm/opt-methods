import { Iterable } from './iterable.js';
import { Point } from './point.js';
import { Matrix } from './matrix.js';
import { range } from '../utils/index.js';

export class Vector extends Iterable<number> {
  static Generate(count: number, callback: (index: number) => number) {
    return new Vector(...range(count).map((_, i) => callback(i)));
  }

  get count(): number {
    return [...this].length;
  }

  get sum(): number {
    return this.reduce((sum, add) => sum + add, 0);
  }

  get length() {
    return Math.sqrt(this.reduce((sum, value) => sum + value ** 2, 0));
  }

  at(index: number) {
    return [...this][index];
  }

  map(callbackfn: (value: number, index: number, array: number[]) => number, thisArg?: any): Vector {
    const values = [...this].map(callbackfn, thisArg);
    return new Vector(...values);
  }

  reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: number[]) => any, initialValue?: any): any {
    return [...this].reduce(callbackfn, initialValue);
  }

  removeAt(index: number): Vector {
    return new Vector(...[...this].filter((_, i) => i !== index));
  }

  add(vector: Vector): Vector {
    if (this.count !== vector.count) throw new Error('Invalid argument!');
    return this.map((value, i) => value + vector.at(i));
  }

  subtract(vector: Vector): Vector {
    if (this.count !== vector.count) throw new Error('Invalid argument!');
    return this.map((value, i) => value - vector.at(i));
  }

  multiplyByScalar(factor: number): Vector {
    const values = [...this].map((value) => factor * value);
    return new Vector(...values);
  }

  normalize(): Vector {
    return this.multiplyByScalar(1 / this.length);
  }

  dotProduct(vector: Vector): number {
    if (this.count !== vector.count) throw new Error('Invalid argument!');
    return this
      .map((value, i) => value * vector.at(i))
      .reduce((sum, add) => sum + add, 0);
  }

  toPoint(): Point {
    return new Point(...this);
  }

  toRow(): Matrix {
    return new Matrix(this);
  }

  toColumn(): Matrix {
    const vectors = [...this].map((value) => new Vector(value));
    return new Matrix(...vectors);
  }

}
