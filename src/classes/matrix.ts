import Vector from './vector.js';
import Iterable from './iterable.js';
import range from '../utils/range.js';

export default class Matrix extends Iterable<Vector> {
  static Generate(width: number, height: number, callback: (row: number, col: number) => number): Matrix {
    return new Matrix(
      ...range(height).map((_, j) => new Vector(
        ...range(width).map((__, i) => callback(i, j)))));
  }

  static Identity(dim: number): Matrix {
    return Matrix.Generate(dim, dim, (i, j) => Number(i === j));
  }

  get rows(): Vector[] {
    return [...this];
  }

  get cols(): Vector[] {
    return [...this.transpose()];
  }

  get height(): number {
    return this.rows.length;
  }

  get width(): number {
    return this.cols.length;
  }

  get isSquare(): boolean {
    return this.rows.length == this.cols.length;
  }

  at(row: number, col: number): number {
    return [...[...this][row]][col];
  }

  map(callbackfn: (value: Vector, index: number, array: Vector[]) => Vector, thisArg?: any): Matrix {
    const values = [...this].map(callbackfn, thisArg);
    return new Matrix(...values);
  }

  mapDeep(callbackfn: (value: number, rowNum: number, colNum: number) => number, thisArg?: any): Matrix {
    const values = [...this]
      .map((row, rowNum) => new Vector(...row
        .map((value, colNum) => callbackfn(value, rowNum, colNum), thisArg)));
    return new Matrix(...values);
  }

  add(...addends: Matrix[]): Matrix {
    const [first, rest] = addends;
    if (this.height !== first.height || this.width !== first.width) {
      throw new Error('Invalid argument!');
    }
    const onePlusOne = this.mapDeep((value, i, j) => value + first.at(i, j));
    if (rest) return this.add(rest);
    return onePlusOne;
  }

  transpose(): Matrix {
    const tmp = [...this]
      .map((vector, rowNum) => [...vector]
        .map((_, colNum) => this.at(rowNum, colNum)));
    const vectors = tmp[0]
      .map((_, colNum) => tmp.map((row) => row[colNum]))
      .map((row) => new Vector(...row));
    return new Matrix(...vectors);
  }

  multiplyByScalar(factor: number): Matrix {
    return this.mapDeep((value) => value * factor);
  }

  multiplyByVector(vector: Vector): Vector {
    if (this.width !== vector.count) throw new Error('Invalid argument!');
    return new Vector(...[...this]
      .map((row, i) => row.multiplyByScalar([...vector][i]).sum));
  }

  multiplyByMatrix(matrix: Matrix): Matrix {
    const rows = this.rows;
    const cols = matrix.cols;
    const vectors = rows.map((row) =>
      new Vector(...cols.map((col) => row.dotProduct(col))),
    );
    return new Matrix(...vectors);
  }

  removeRow(rowNumber: number): Matrix {
    if (rowNumber > this.height) throw new Error('Invalid argument!');
    return new Matrix(...this.rows.filter((_, i) => i !== rowNumber));
  }

  removeColumn(colNumber: number): Matrix {
    if (colNumber > this.width) throw new Error('Invalid argument!');
    return new Matrix(...this.cols.filter((_, j) => j !== colNumber)).transpose();
  }

  toNumber(): number {
    if (this.height !== 1 || this.width !== 1) throw new Error();
    const [[only]] = this;
    return only;
  }

  toString(separator = '\n'): string {
    return `[${[...this].map((vector) => vector.toString()).join(separator)}]`;
  }

  // square matrix only 

  get dim(): number {
    if (!this.isSquare) throw new Error('This only exists for square matrices!');
    return this.width;
  }

  get det(): number {
    if (!this.isSquare) throw new Error('This only exists for square matrices!');
    // used to calculate minors for 2x2 matrices
    if (this.dim === 1) {
      return this.toNumber();
    }
    if (this.dim === 2) {
      const [
        [a, b],
        [c, d],
      ] = this;
      return a * d - b * c;
    }
    const addends = range(this.dim).map((k) => {
      const one = (-1) ** (k);
      const a1k = this.at(0, k);
      const Mk = this.minor(0, k);
      return one * a1k * Mk;
    });
    return addends.reduce((sum, addend) => sum + addend, 0);
  }

  minor(i: number, j: number): number {
    if (!this.isSquare) throw new Error('This only exists for square matrices!');
    return this.removeRow(i).removeColumn(j).det;
  }

  algComp(i: number, j: number): number {
    if (!this.isSquare) throw new Error('This only exists for square matrices!');
    return (-1) ** (i + j) * this.minor(i, j);
  }

  minors(): Matrix {
    if (!this.isSquare) throw new Error('This only exists for square matrices!');
    return this.mapDeep((_, i, j) => this.minor(i, j));
  }

  algComps(): Matrix {
    if (!this.isSquare) throw new Error('This only exists for square matrices!');
    return this.mapDeep((_, i, j) => this.algComp(i, j));
  }

  inverse(): Matrix {
    if (!this.isSquare) throw new Error('This only exists for square matrices!');
    const det = this.det;
    if (det === 0) throw new Error('Inverse matrix does not exist!');
    const inverse = this
      .algComps()
      .transpose()
      .multiplyByScalar(1 / det);
    return inverse;
  }

}
