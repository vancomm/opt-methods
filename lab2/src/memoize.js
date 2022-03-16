export default class Memoized {
  constructor(fn) {
    this.cache = {};
    this.fn = fn;
  }

  call(x) {
    if (!this.cache[x]) this.cache[x] = this.fn(x);
    return this.cache[x];
  }
}
