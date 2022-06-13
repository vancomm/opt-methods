import zip from '../utils/zip.js';
import * as FuncMath from '../utils/func-math.js';

export type MyVector = {
  values: number[]
}

export const makeVector = (...values: number[]): MyVector => { return { values } };


export const count = (vector: MyVector) => vector.values.length;

export const length = (vector: MyVector) => FuncMath.sum(...vector.values.map((v) => v ** 2));


export const toString = (vector: MyVector) => `(${vector.values.join(',')})`;


export const add = (vector1: MyVector) => (vector2: MyVector) => makeVector(...zip(vector1.values)(vector2.values)(FuncMath.add));

export const sum = (array: MyVector[]) => array.reduce((sum, next) => add(sum)(next));

export const subtract = (vector1: MyVector) => (vector2: MyVector) => makeVector(...zip(vector1.values)(vector2.values)(FuncMath.subtract));

