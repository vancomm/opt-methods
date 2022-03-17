export type ScalarFunction = (point: Point) => number;
export type VectorFunction = (point: Point) => Vector;
export type MatrixFunction = (point: Point) => Matrix;

export class Point {
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

export class Vector {
  static subtract(minuend: Point, subtrahend: Point): Vector {
    const { x: x1, y: y1 } = minuend;
    const { x: x2, y: y2 } = subtrahend;
    return new Vector(x1 - x2, y1 - y2);
  }

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

export class Matrix {
  static identity = new Matrix([
    [1, 0],
    [0, 1]
  ]);

  static multiply(matrix: Matrix, vector: Vector): Vector {
    const [
      [a, b],
      [c, d]] = matrix.values;
    const { x, y } = vector;
    return new Vector(
      a * x + b * y,
      c * x + d * y);
  }

  readonly values;
  readonly determinant;

  constructor(matrix: number[][]) {
    this.values = matrix;
    this.determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }

  add(addend: Matrix): Matrix {
    return new Matrix(this.values.map((row, i) => row.map((item, j) => item + addend.values[i][j])));
  }

  multiply(factor: number): Matrix {
    return new Matrix(this.values.map((row) => row.map((item) => factor * item)));
  }

  get minor(): Matrix {
    const [
      [a, b],
      [c, d]] = this.values;
    return new Matrix([
      [d, c],
      [b, a]
    ]);
  }

  get alg_additions(): Matrix {
    const [
      [a, b],
      [c, d]] = this.values;
    return new Matrix([
      [a, -b],
      [-c, d]
    ]);
  }

  get transpose(): Matrix {
    const [
      [a, b],
      [c, d]] = this.values;
    return new Matrix([
      [a, c],
      [b, d]
    ]);
  }

  get inverse(): Matrix {
    return new Matrix(this.values)
      .minor
      .alg_additions
      .transpose
      .multiply(1 / this.determinant);
  }
}
