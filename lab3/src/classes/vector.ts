export class Vector {
  readonly x;
  readonly y;
  readonly norm;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.norm = Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  subtract(subtrahend: Vector): Vector {
    const { x, y } = subtrahend;
    return new Vector(this.x - x, this.y - y);
  };

  multiply(factor: number): Vector {
    return new Vector(factor * this.x, factor * this.y);
  };
}
