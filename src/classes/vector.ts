import { Iterable } from './iterable.js';

export class Vector extends Iterable<number> {
  static Subtract(minuend: Vector, subtrahend: Vector): Vector {
    if (minuend.length !== subtrahend.length) throw new Error('Invalid argument!');
    const values = [...minuend].map((value, i) => value - [...subtrahend][i]);
    return new Vector(values);
  }

  static Multiply(vector: Vector, factor: number): Vector {
    const values = [...vector].map((value) => factor * value);
    return new Vector(values);
  }

  static RemoveAt(vector: Vector, index: number): Vector {
    return new Vector([...vector].filter((_, i) => i !== index));
  }
  
  static ToString(vector: Vector) {
    return [...vector].join(', ');
  }
  
  get length(): number {
    return [...this].length;
  }

  get sum(): number {
    return [...this].reduce((sum, add) => sum + add, 0);
  }

  get norm() {
    return Math.sqrt([...this].map((value) => value ** 2).reduce((sum, value) => sum + value, 0));
  }

  subtract(vector: Vector): Vector {
    return Vector.Subtract(this, vector);
  }

  multiply(factor: number) {
    return Vector.Multiply(this, factor);
  }

  removeAt(index: number) {
    return Vector.RemoveAt(this, index);
  }

  toString() {
    return Vector.ToString(this);
  }
}
