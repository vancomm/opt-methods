import { Vector } from "./vector.js";

export class Point {
  static subtract(minuend: Point, subtrahend: Point): Vector {
    const { x: x1, y: y1 } = minuend;
    const { x: x2, y: y2 } = subtrahend;
    return new Vector(x1 - x2, y1 - y2);
  }

  readonly x;
  readonly y;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  subtract(subtrahend: Vector): Point {
    const { x, y } = subtrahend;
    return new Point(this.x - x, this.y - y);
  };
}
