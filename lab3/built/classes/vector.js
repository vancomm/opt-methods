export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.norm = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    subtract(subtrahend) {
        const { x, y } = subtrahend;
        return new Vector(this.x - x, this.y - y);
    }
    ;
    multiply(factor) {
        return new Vector(factor * this.x, factor * this.y);
    }
    ;
}
