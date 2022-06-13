import range from "./range.js";

export const add = (a: number) =>
  (b: number) =>
    a + b;

export const sum = (...addends: number[]) => {
  if (!addends.length) return 0;
  return addends.reduce((acc, curr) => add(acc)(curr))
};

export const sigma = (func: (x: number) => number) =>
  (from: number) =>
    (to: number) => {
      const values = range(from, to + 1)
        .map((x) => func(x));

      return sum(...values);
    };

export const subtract = (a: number) =>
  (b: number) =>
    a - b;