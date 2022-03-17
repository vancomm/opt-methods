export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static subtract(minuend, subtrahend) {
        const { x: x1, y: y1 } = minuend;
        const { x: x2, y: y2 } = subtrahend;
        return new Vector(x1 - x2, y1 - y2);
    }
    subtract(subtrahend) {
        const { x, y } = subtrahend;
        return new Point(this.x - x, this.y - y);
    }
    ;
}
export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.norm = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    subtract(subtrahend) {
        const { x, y } = subtrahend;
        return new Vector(this.x - x, this.y - y);
    }
    ;
    multiply(factor) {
        return new Vector(factor * this.x, factor * this.y);
    }
    ;
}
export class Matrix {
    constructor(matrix) {
        this.values = matrix;
        this.determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    static multiply(matrix, vector) {
        const [[a, b], [c, d]] = matrix.values;
        const { x, y } = vector;
        return new Vector(a * x + b * y, c * x + d * y);
    }
    add(addend) {
        return new Matrix(this.values.map((row, i) => row.map((item, j) => item + addend.values[i][j])));
    }
    multiply(factor) {
        return new Matrix(this.values.map((row) => row.map((item) => factor * item)));
    }
    get minor() {
        const [[a, b], [c, d]] = this.values;
        return new Matrix([
            [d, c],
            [b, a]
        ]);
    }
    get alg_additions() {
        const [[a, b], [c, d]] = this.values;
        return new Matrix([
            [a, -b],
            [-c, d]
        ]);
    }
    get transpose() {
        const [[a, b], [c, d]] = this.values;
        return new Matrix([
            [a, c],
            [b, d]
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
    [0, 1]
]);
