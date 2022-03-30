import { range } from '../utils/range.js';
import { Matrix } from './matrix.js';
import { Vector } from './vector.js';

export class SquareMatrix extends Matrix {
  static Identity(dim: number): SquareMatrix {
    return new SquareMatrix(
      range(dim).map(() => new Vector(
        range(dim).map(() => 0))))
      .map((_, i, j) => i === j ? 1 : 0);
  }

  static Map(
    matrix: Matrix,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callbackfn: (value: number, rowNum: number, colNum: number) => number, thisArg?: any
  ): SquareMatrix {
    return new SquareMatrix([...super.Map(matrix, callbackfn, thisArg)]);
  }

  static Add(...addends: SquareMatrix[]): SquareMatrix {
    const [first, second] = addends;
    if (first.dim !== second.dim) throw new Error('Invalid argument!');
    return new SquareMatrix([...super.Add(...addends)]);
  }

  static Transpose(matrix: SquareMatrix): SquareMatrix {
    const transposed = super.Transpose(matrix);
    return new SquareMatrix([...transposed]);
  }

  static Determinant(matrix: SquareMatrix): number {
    // used to calculate minors for 2x2 matrices
    if (matrix.dim === 1) {
      const [[only]] = matrix;
      return only;
    }
    if (matrix.dim === 2) {
      const [
        [a, b],
        [c, d]] = matrix;
      return a * d - b * c;
    }
    const addends = range(matrix.dim).map((k) => {
      const one = (-1) ** (k + 2);
      const a1k = matrix.at(0, k);
      const Mk = matrix.minor(0, k);
      return one * a1k * Mk;
    });
    return addends.reduce((sum, addend) => sum + addend, 0);
  }

  static MultiplyByScalar(matrix: SquareMatrix, factor: number): SquareMatrix {
    return new SquareMatrix([...super.MultiplyByScalar(matrix, factor)]);
  }

  static MinorMatrix(matrix: SquareMatrix): SquareMatrix {
    const minorMatrix = new SquareMatrix([...matrix]
      .map((vector, rowNum) => new Vector([...vector]
        .map((_, colNum) => matrix.minor(rowNum, colNum)))));
    return minorMatrix;
  }

  static AlgComps(matrix: SquareMatrix): SquareMatrix {
    return new SquareMatrix([...matrix]
      .map((vector, rowNum) => new Vector([...vector]
        .map((_, colNum) => matrix.algComp(rowNum, colNum)))));
  }

  static Inverse(matrix: SquareMatrix): SquareMatrix {
    const det = matrix.det;
    if (det === 0) throw new Error('Inverse matrix does not exist!');
    const inverse = matrix
      .algComps()
      .transpose()
      .multiplyByScalar(1 / det);
    return inverse;
  }

  static ToString(matrix: SquareMatrix, separator?: string): string {
    return super.ToString(matrix, separator);
  }

  constructor(vectors: Vector[]) {
    super(vectors);
    if (this.rows.length !== this.cols.length) throw new Error('Invalid argument!');
  }

  removeRowAndColumn(rowNum: number, colNum: number) {
    return new SquareMatrix([...this.removeRow(rowNum).removeColumn(colNum)]);
  }

  get identity(): SquareMatrix {
    return SquareMatrix.Identity(this.dim);
  }

  get dim(): number {
    return [...this].length;
  }

  get det(): number {
    return SquareMatrix.Determinant(this);
  }

  map(
    callbackfn: (value: number, rowNum: number, colNum: number) => number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    thisArg?: any
  ): SquareMatrix {
    return SquareMatrix.Map(this, callbackfn, thisArg);
  }

  add(...addend: SquareMatrix[]): SquareMatrix {
    return SquareMatrix.Add(this, ...addend);
  }

  transpose(): SquareMatrix {
    return SquareMatrix.Transpose(this);
  }

  multiplyByScalar(factor: number): SquareMatrix {
    return SquareMatrix.MultiplyByScalar(this, factor);
  }

  multiplyByVector(vector: Vector): Vector {
    return SquareMatrix.MultiplyByVector(this, vector);
  }

  minor(i: number, j: number): number {
    return this.removeRowAndColumn(i, j).det;
  }

  algComp(i: number, j: number): number {
    return (-1) ** (i + j + 2) * this.minor(i, j);
  }

  minors(): SquareMatrix {
    return SquareMatrix.MinorMatrix(this);
  }

  algComps(): SquareMatrix {
    return SquareMatrix.AlgComps(this);
  }

  inverse(): SquareMatrix {
    return SquareMatrix.Inverse(this);
  }
}
