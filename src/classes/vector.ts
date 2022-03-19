import { Iterable } from './iterable.js';

export class Vector extends Iterable<number> {
  get length(): number {
    return [...this].length;
  }

  get sum(): number {
    return [...this].reduce((sum, add) => sum + add, 0);
  }

  get norm() {
    return Math.sqrt([...this].map((value) => value ** 2).reduce((sum, value) => sum + value, 0));
  }

  stringify() {
    return [...this].toString();
  }

  subtract(subtrahend: Vector): Vector {
    if (this.length !== subtrahend.length) throw new Error('Invalid argument!');
    const values = [...this].map((value, i) => value - [...subtrahend][i]);
    return new Vector(values);
  }

  multiply(factor: number) {
    const values = [...this].map((value) => factor * value);
    return new Vector(values);
  }

  removeAt(index: number) {
    return new Vector([...this].filter((_, i) => i !== index));
  }
}
