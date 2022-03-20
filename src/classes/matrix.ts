import { Vector } from './vector.js';
import { Iterable } from './iterable.js';

export class Matrix extends Iterable<Vector> {
  static Map(
    matrix: Matrix,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callbackfn: (value: number, rowNum: number, colNum: number) => number, thisArg?: any
  ): Matrix {
    const values = [...matrix]
      .map((row, rowNum) => new Vector([...row]
        .map((value, colNum) => callbackfn(value, rowNum, colNum), thisArg)));
    return new Matrix(values);
  }

  static Add(...addends: Matrix[]): Matrix {
    const [first, second, rest] = addends;
    if (first.rows.length !== second.rows.length || first.cols.length !== second.cols.length) {
      throw new Error('Invalid argument!');
    }
    const onePlusOne = first.map((value, i, j) => value + second.at(i, j));
    if (rest) return this.Add(rest);
    return onePlusOne;
  }

  static Transpose(matrix: Matrix): Matrix {
    const tmp = [...matrix]
      .map((vector, rowNum) => [...vector]
        .map((_, colNum) => matrix.at(rowNum, colNum)));
    const vectors = tmp[0]
      .map((_, colNum) => tmp.map((row) => row[colNum]))
      .map((row) => new Vector(row));
    return new Matrix(vectors);
  }

  static MultiplyByScalar(matrix: Matrix, factor: number): Matrix {
    return matrix.map((value) => value * factor);
  }

  static MultiplyByVector(matrix: Matrix, vector: Vector): Vector {
    if (matrix.cols.length !== vector.length) throw new Error('Invalid argument!');
    return new Vector([...matrix]
      .map((row, i) => row.multiply([...vector][i]).sum));
  }

  static RemoveRow(matrix: Matrix, rowNumber: number): Matrix {
    if (rowNumber > matrix.rows.length) throw new Error('Invalid argument!');
    return new Matrix(matrix.rows.filter((_, i) => i !== rowNumber));
  }

  static RemoveColumn(matrix: Matrix, colNumber: number): Matrix {
    if (colNumber > matrix.cols.length) throw new Error('Invalid argument!');
    return new Matrix(matrix.cols.filter((vector, j) => j !== colNumber)).transpose();
  }

  static ToString(matrix: Matrix, separator = '\n') {
    return [...matrix].map((vector) => vector.toString()).join(separator);
  }

  get rows(): Vector[] {
    return [...this];
  }

  get cols(): Vector[] {
    return [...Matrix.Transpose(this)];
  }

  at(row: number, col: number): number {
    return [...[...this][row]][col];
  }

  map(
    callbackfn: (value: number, rowNum: number, colNum: number) => number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    thisArg?: any
  ): Matrix {
    return Matrix.Map(this, callbackfn, thisArg);
  }

  add(...addend: Matrix[]): Matrix {
    return Matrix.Add(this, ...addend);
  }

  transpose(): Matrix {
    return Matrix.Transpose(this);
  }

  multiplyByScalar(factor: number): Matrix {
    return Matrix.MultiplyByScalar(this, factor);
  }

  multiplyByVector(vector: Vector): Vector {
    return Matrix.MultiplyByVector(this, vector);
  }

  removeRow(rowNumber: number): Matrix {
    return Matrix.RemoveRow(this, rowNumber);
  }

  removeColumn(colNumber: number): Matrix {
    return Matrix.RemoveColumn(this, colNumber);
  }

  toString(separator = '\n'): string {
    return Matrix.ToString(this, separator);
  }
}
