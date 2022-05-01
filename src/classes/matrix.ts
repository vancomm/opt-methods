import { Vector } from './vector.js';
import { Iterable } from './iterable.js';
import { SquareMatrix } from './square-matrix.js';

export class Matrix extends Iterable<Vector> {
  static Transpose(matrix: Matrix): Matrix {
    const tmp = [...matrix]
      .map((vector, rowNum) => [...vector]
        .map((_, colNum) => matrix.at(rowNum, colNum)));
    const vectors = tmp[0]
      .map((_, colNum) => tmp.map((row) => row[colNum]))
      .map((row) => new Vector(...row));
    return new Matrix(...vectors);
  }

  static MultiplyByScalar(matrix: Matrix, factor: number): Matrix {
    return matrix.map((value) => value * factor);
  }

  static MultiplyByVector(matrix: Matrix, vector: Vector): Vector {
    if (matrix.cols.length !== vector.count) throw new Error('Invalid argument!');
    return new Vector(...[...matrix]
      .map((row, i) => row.multiplyByScalar([...vector][i]).sum));
  }

  static MultiplyByMatrix(first: Matrix, second: Matrix) {
    const rows = first.rows;
    const cols = second.cols;
    const vectors = rows.map((row) =>
      new Vector(...cols.map((col) => row.dotProduct(col)))
    );
    return new Matrix(...vectors);
  }

  static RemoveRow(matrix: Matrix, rowNumber: number): Matrix {
    if (rowNumber > matrix.rows.length) throw new Error('Invalid argument!');
    return new Matrix(...matrix.rows.filter((_, i) => i !== rowNumber));
  }

  static RemoveColumn(matrix: Matrix, colNumber: number): Matrix {
    if (colNumber > matrix.cols.length) throw new Error('Invalid argument!');
    return new Matrix(...matrix.cols.filter((vector, j) => j !== colNumber)).transpose();
  }

  static ToString(matrix: Matrix, separator = '\n') {
    return `[${[...matrix].map((vector) => vector.toString()).join(separator)}]`;
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

  map(callbackfn: (value: number, rowNum: number, colNum: number) => number, thisArg?: any): Matrix {
    const values = [...this]
      .map((row, rowNum) => new Vector(...row
        .map((value, colNum) => callbackfn(value, rowNum, colNum), thisArg)));
    return new Matrix(...values);
  }

  add(...addends: Matrix[]): Matrix {
    const [first, rest] = addends;
    if (this.rows.length !== first.rows.length || this.cols.length !== first.cols.length) {
      throw new Error('Invalid argument!');
    }
    const onePlusOne = this.map((value, i, j) => value + first.at(i, j));
    if (rest) return this.add(rest);
    return onePlusOne;
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

  multiplyByMatrix(matrix: Matrix): Matrix {
    return Matrix.MultiplyByMatrix(this, matrix);
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
