import chalk from 'chalk';

function color(message: any, colorHex: string, bold = true) {
  const colored = chalk.hex(colorHex);
  return bold ? colored.bold(message) : colored(message);
}

export function pink(message: any, bold?: boolean) {
  const pinkHex = '#F0B6D5';
  return color(message, pinkHex, bold);
}

export function red(message: any, bold?: boolean) {
  const redHex = '#FF6961';
  return color(message, redHex, bold);
}

export function yellow(message: any, bold?: boolean) {
  const yellowHex = '#ffe588';
  return color(message, yellowHex, bold);
}

export function green(message: any, bold?: boolean) {
  const greenHex = '#b5e990';
  return color(message, greenHex, bold);
}

export function gray(message: any, bold?: boolean) {
  const grayHex = '#6d757a';
  return color(message, grayHex, bold);
}
