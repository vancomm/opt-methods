import { range } from '../utils/index.js';
import { Vector } from './vector.js';
import { Iterable } from './iterable.js';

export class Matrix extends Iterable<Vector> {
  static Identity(dim: number): Matrix {
    return new Matrix(
      ...range(dim).map(() => new Vector(
        ...range(dim).map(() => 0))))
      .mapDeep((_, i, j) => i === j ? 1 : 0);
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
      new Vector(...cols.map((col) => row.dotProduct(col)))
    );
    return new Matrix(...vectors);
  }

  removeRow(rowNumber: number): Matrix {
    if (rowNumber > this.height) throw new Error('Invalid argument!');
    return new Matrix(...this.rows.filter((_, i) => i !== rowNumber));
  }

  removeColumn(colNumber: number): Matrix {
    if (colNumber > this.width) throw new Error('Invalid argument!');
    return new Matrix(...this.cols.filter((vector, j) => j !== colNumber)).transpose();
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
    return this.rows.length;
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
        [c, d]
      ] = this;
      return a * d - b * c;
    }
    const addends = range(this.dim).map((k) => {
      const one = (-1) ** (k + 2);
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
    return (-1) ** (i + j + 2) * this.minor(i, j);
  }

  minors(): Matrix {
    if (!this.isSquare) throw new Error('This only exists for square matrices!');
    const minorMatrix = new Matrix(...[...this]
      .map((vector, rowNum) => new Vector(...[...vector]
        .map((_, colNum) => this.minor(rowNum, colNum)))));
    return minorMatrix;
  }

  algComps(): Matrix {
    if (!this.isSquare) throw new Error('This only exists for square matrices!');
    return new Matrix(...[...this]
      .map((vector, rowNum) => new Vector(...[...vector]
        .map((_, colNum) => this.algComp(rowNum, colNum)))));
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
