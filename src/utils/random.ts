function random(max?: number): number;
function random(min?: number, max?: number): number;
function random(first = 1, second?: number): number {
  const [min, max] = second ? [first, second] : [0, first];
  return min + (max - min) * Math.random();
}

export default random;
