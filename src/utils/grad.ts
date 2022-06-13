import Point from "../classes/point";
import Vector from "../classes/vector";
import Matrix from "../classes/matrix";

export default function grad(f: (x: Point) => number, x: Point, dx = 1e-4) {
  const n = x.count;
  const values = Matrix.Generate(n, n, (i, j) => i == j ? dx : 0).rows
    .map((v) => x.addVector(v))
    .map((xPlusDx) => (f(x) - f(xPlusDx)) / dx)
  return new Vector(...values);
}