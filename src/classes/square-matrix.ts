import { Matrix } from './matrix.js';
import { Vector } from './vector.js';

export class SquareMatrix extends Matrix {
  static Identity(dim: number): SquareMatrix {
    const identityMatrix = [...Array(dim).keys()]
      .map(() => new Vector([...Array(dim).keys()]
        .map(() => 0)))
      .map((vector, rowNumber) => new Vector([...vector]
        .map((_, colNumber) => ((rowNumber === colNumber)
          ? 1
          : 0))));
    return new SquareMatrix(identityMatrix);
  }

  static Transpose(matrix: SquareMatrix): SquareMatrix {
    const transposed = super.Transpose(matrix);
    return new SquareMatrix([...transposed]);
  }

  /* FIXME:
      по какой-то причине детерминант
      вычисляется для матриц размерности 1;
      должно быть достаточно рассмотреть
      dim === 2 и dim > 2
  */
  static Determinant(matrix: SquareMatrix): number {
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
    const addends = [...Array(matrix.dim).keys()]
      .map((k) => {
        const one = (-1) ** (k + 2);
        const a1k = matrix.at(0, k);
        const Mk = matrix.minor(0, k);
        return one * a1k * Mk;
      });
    return addends.reduce((sum, addend) => sum + addend, 0);
  }

  static Add(...addends: SquareMatrix[]): SquareMatrix {
    const [first, second] = addends;
    if (first.dim !== second.dim) throw new Error('Invalid argument!');
    const sum = super.Add(...addends);
    return new SquareMatrix([...sum]);
  }

  static MultiplyByScalar(matrix: SquareMatrix, factor: number): SquareMatrix {
    return new SquareMatrix([...super.MultiplyByScalar(matrix, factor)]);
  }

  static MultiplyByVector(matrix: SquareMatrix, vector: Vector): Vector {
    return super.MultiplyByVector(matrix, vector)
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
        .map((item, colNum) => matrix.algComp(rowNum, colNum)))));
  }

  static Inverse(matrix: SquareMatrix): SquareMatrix {
    if (matrix.det === 0) throw new Error('Inverse matrix does not exist!');
    const inverse = matrix
      .algComps()
      .transpose()
      .multiplyByScalar(1 / matrix.det);
    return inverse;
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

  transpose(): SquareMatrix {
    return SquareMatrix.Transpose(this);
  }

  add(...addend: SquareMatrix[]): SquareMatrix {
    return SquareMatrix.Add(this, ...addend);
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
