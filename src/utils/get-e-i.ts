import Vector from '../classes/vector.js';
import range from './range.js';

export default function getEi(i: number, n: number) {
  const values = range(n).map((_, index) => (index == i - 1) ? 1 : 0);
  return new Vector(...values);
}