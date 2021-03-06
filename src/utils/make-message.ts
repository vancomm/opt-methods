import Point from '../classes/point.js';
import { gray, yellow } from './color.js';
import cut from './cut.js';

export default function makeMessage(params: {
  name: string,
  x_min: Point,
  f_min: number,
  fCalls?: number,
  iterCount?: number,
  target?: Point,
  errFunc?: (res: Point, tgt: Point) => number,
  stopReason?: string,
  custom?: {
    [key: string]: string,
  }
}): string {
  const { name, x_min, f_min, fCalls, iterCount, target, errFunc, stopReason, custom } = params;

  const lines = [
    `${yellow(name)}`,
    `x_m:\t\t${x_min.toString()}`,
    `f(x_m):\t\t${f_min}`,
  ];

  if (target && errFunc) {
    const err = errFunc(x_min, target);
    lines.push(`error:\t\t${cut(err)}`);
  }

  if (iterCount) lines.push(`iter count:\t${iterCount}`);

  if (fCalls) lines.push(`f calls:\t${fCalls}`);

  if (stopReason) lines.push(gray(`stop reason:\t${stopReason}`, false));

  if (custom) {
    Object.entries(custom).forEach(([key, value]) => {
      lines.push(`${key}:\t${value}`);
    });
  }

  const text = lines.join('\n');
  return text;
}
