export class Memoized {
    constructor(fn) {
        this.cache = {};
        this.fn = fn;
    }
    call(...args) {
        const hash = JSON.stringify(args);
        if (!this.cache[hash])
            this.cache[hash] = this.fn(...args);
        return this.cache[hash];
    }
}
