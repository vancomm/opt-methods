import { Iterable } from './iterable.js';

export class Vector extends Iterable<number> {
  static Map(vector: Vector, callbackfn: (value: number, index: number, array: number[]) => number, thisArg?: any) {
    const values = [...vector].map(callbackfn);
    return new Vector(values);
  }

  static Reduce(vector: Vector, callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: number[]) => number, initialValue?: any) {
    return [...vector].reduce(callbackfn, initialValue);
  }

  static Normalize(vector: Vector) {
    return vector.multiplyByScalar(1 / vector.length);
  }

  static Add(augend: Vector, addend: Vector): Vector {
    if (augend.count !== addend.count) throw new Error('Invalid argument!');
    return augend.map((value, i) => value + addend.at(i));
  }

  static Subtract(minuend: Vector, subtrahend: Vector): Vector {
    if (minuend.count !== subtrahend.count) throw new Error('Invalid argument!');
    return minuend.map((value, i) => value - subtrahend.at(i));
  }

  static DotProduct(vector1: Vector, vector2: Vector) {
    if (vector1.count !== vector2.count) throw new Error('Invalid argument!');
    return vector1
      .map((value, i) => value * vector2.at(i))
      .reduce((sum, add) => sum + add, 0);
  }

  static MultiplyByScalar(vector: Vector, factor: number): Vector {
    const values = [...vector].map((value) => factor * value);
    return new Vector(values);
  }

  static RemoveAt(vector: Vector, index: number): Vector {
    return new Vector([...vector].filter((_, i) => i !== index));
  }

  static ToString(vector: Vector) {
    return [...vector].join(', ');
  }

  get count(): number {
    return [...this].length;
  }

  get sum(): number {
    return [...this].reduce((sum, add) => sum + add, 0);
  }

  get length() {
    return Math.sqrt([...this].reduce((sum, value) => sum + value ** 2, 0));
  }

  at(index: number) {
    return [...this][index];
  }

  map(callbackfn: (value: number, index: number, array: number[]) => number, thisArg?: any) {
    return Vector.Map(this, callbackfn, thisArg);
  }

  reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: number[]) => number, initialValue?: any) {
    return Vector.Reduce(this, callbackfn, initialValue);
  }

  normalize() {
    return Vector.Normalize(this);
  }

  add(vector: Vector): Vector {
    return Vector.Add(this, vector);
  }

  subtract(vector: Vector): Vector {
    return Vector.Subtract(this, vector);
  }

  multiplyByScalar(factor: number) {
    return Vector.MultiplyByScalar(this, factor);
  }

  removeAt(index: number) {
    return Vector.RemoveAt(this, index);
  }

  dotProduct(vector: Vector) {
    return Vector.DotProduct(this, vector);
  }

  toString() {
    return Vector.ToString(this);
  }
}
