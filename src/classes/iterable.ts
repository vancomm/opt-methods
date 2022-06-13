export default class Iterable<T> {
  private _values: T[];

  constructor(...values: T[]) {
    this._values = values;
  }

  map(callbackfn: (value: T, index: number, array: T[]) => T, thisArg?: any): Iterable<T> {
    const values = [...this].map(callbackfn, thisArg);
    return new Iterable<T>(...values);
  }

  toString(): string {
    return `(${[...this].join(', ')})`;
  }

  *[Symbol.iterator]() {
    for (const i of this._values) {
      yield i;
    }
  }
}
