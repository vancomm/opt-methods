import { Vector } from "./vector.js";
export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static subtract(minuend, subtrahend) {
        const { x: x1, y: y1 } = minuend;
        const { x: x2, y: y2 } = subtrahend;
        return new Vector(x1 - x2, y1 - y2);
    }
    subtract(subtrahend) {
        const { x, y } = subtrahend;
        return new Point(this.x - x, this.y - y);
    }
    ;
}
