import { Vector } from './vector.js';
export class Matrix {
    constructor(values) {
        this.values = values;
        this.determinant = values[0][0] * values[1][1] - values[0][1] * values[1][0];
    }
    static multiply(matrix, vector) {
        const [[a, b], [c, d]] = matrix.values;
        const { x, y } = vector;
        return new Vector(a * x + b * y, c * x + d * y);
    }
    add(addend) {
        return new Matrix(this.values
            .map((row, i) => row
            .map((item, j) => item + addend.values[i][j])));
    }
    multiply(factor) {
        return new Matrix(this.values
            .map((row) => row
            .map((item) => factor * item)));
    }
    get minor() {
        const [[a, b], [c, d],] = this.values;
        return new Matrix([
            [d, c],
            [b, a],
        ]);
    }
    get alg_additions() {
        const [[a, b], [c, d],] = this.values;
        return new Matrix([
            [a, -b],
            [-c, d],
        ]);
    }
    get transpose() {
        const [[a, b], [c, d],] = this.values;
        return new Matrix([
            [a, c],
            [b, d],
        ]);
    }
    get inverse() {
        return new Matrix(this.values)
            .minor
            .alg_additions
            .transpose
            .multiply(1 / this.determinant);
    }
}
Matrix.identity = new Matrix([
    [1, 0],
    [0, 1],
]);
