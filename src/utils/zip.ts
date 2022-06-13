const zip = <T>(arr1: T[]) =>
  (arr2: T[]) =>
    (cb: (a: T) => (b: T) => T) =>
      arr1.map((v, i) => cb(v)(arr2[i]));

export default zip;
