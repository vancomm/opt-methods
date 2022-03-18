import { Vector } from './vector.js';

export class Matrix {
  static identity = new Matrix([
    [1, 0],
    [0, 1],
  ]);

  static multiply(matrix: Matrix, vector: Vector): Vector {
    const [
      [a, b],
      [c, d]] = matrix.values;
    const { x, y } = vector;
    return new Vector(
      a * x + b * y,
      c * x + d * y,
    );
  }

  readonly values;

  readonly determinant;

  constructor(values: number[][]) {
    this.values = values;
    this.determinant = values[0][0] * values[1][1] - values[0][1] * values[1][0];
  }

  add(addend: Matrix): Matrix {
    return new Matrix(this.values
      .map((row, i) => row
        .map((item, j) => item + addend.values[i][j])));
  }

  multiply(factor: number): Matrix {
    return new Matrix(this.values
      .map((row) => row
        .map((item) => factor * item)));
  }

  get minor(): Matrix {
    const [
      [a, b],
      [c, d],
    ] = this.values;
    return new Matrix([
      [d, c],
      [b, a],
    ]);
  }

  get alg_additions(): Matrix {
    const [
      [a, b],
      [c, d],
    ] = this.values;
    return new Matrix([
      [a, -b],
      [-c, d],
    ]);
  }

  get transpose(): Matrix {
    const [
      [a, b],
      [c, d],
    ] = this.values;
    return new Matrix([
      [a, c],
      [b, d],
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
