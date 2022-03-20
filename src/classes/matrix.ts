import { Vector } from './vector.js';
import { Iterable } from './iterable.js';

export class Matrix extends Iterable<Vector> {
  static Transpose(matrix: Matrix): Matrix {
    const tmp = [...matrix]
      .map((vector, rowNum) => [...vector]
        .map((_, colNum) => matrix.at(rowNum, colNum)));
    const vectors = tmp[0]
      .map((_, colNum) => tmp.map((row) => row[colNum]))
      .map((row) => new Vector(row));
    return new Matrix(vectors);
  }

  static Add(...addend: Matrix[]): Matrix {
    const [first, second, rest] = addend;
    if (first.rows.length !== second.rows.length || first.cols.length !== second.cols.length) {
      throw new Error('Invalid argument!');
    }
    const onePlusOne = new Matrix([...first]
      .map((vector, rowNum) => new Vector([...vector]
        .map((value, colNum) => value + second.at(rowNum, colNum)))));
    if (rest) return this.Add(rest);
    return onePlusOne;
  }

  static MultiplyByScalar(matrix: Matrix, factor: number): Matrix {
    return new Matrix([...matrix]
      .map((vector) => new Vector([...vector]
        .map((item) => factor * item))));
  }

  static MultiplyByVector(matrix: Matrix, vector: Vector): Vector {
    if (matrix.cols.length !== vector.length) throw new Error('Invalid argument!');
    return new Vector([...matrix].map((row, i) => row.multiply([...vector][i]).sum));
  }

  static RemoveRow(matrix: Matrix, rowNumber: number): Matrix {
    if (rowNumber > matrix.rows.length) throw new Error('Invalid argument!');
    const cut = new Matrix(matrix.rows.filter((vector, i) => i !== rowNumber));
    return cut;
  }

  static RemoveColumn(matrix: Matrix, colNumber: number): Matrix {
    if (colNumber > matrix.cols.length) throw new Error('Invalid argument!');
    const cut = new Matrix(matrix.cols.filter((vector, j) => j !== colNumber)).transpose();
    return cut;
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

  stringify(separator = '\n'): string {
    const string = [...this].map((vector) => vector.stringify()).join(separator);
    return string;
  }
}
