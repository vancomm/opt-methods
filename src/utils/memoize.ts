export class Memoized {
  readonly cache: any;

  private fn: (...args: any[]) => any;

  constructor(fn: (...args: any[]) => any) {
    this.cache = {};
    this.fn = fn;
  }

  call(...args: any[]) {
    const hash = JSON.stringify(args);
    if (!this.cache[hash]) this.cache[hash] = this.fn(...args);
    return this.cache[hash];
  }
}
