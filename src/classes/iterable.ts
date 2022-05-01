export class Iterable<T> {
  private _values: T[];

  constructor(...values: T[]) {
    this._values = values;
  }

  *[Symbol.iterator]() {
    // eslint-disable-next-line no-restricted-syntax
    for (const i of this._values) {
      yield i;
    }
  }
}
