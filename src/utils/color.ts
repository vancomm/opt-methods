import chalk from "chalk";

function color(message: any, color: string, bold = true) {
	const colored = chalk.hex(color);
	return bold ? colored.bold(message) : colored(message);
}

export function green(message: any, bold?: boolean) {
	const green = '#b5e990';
	return color(message, green, bold);
}

export function yellow(message: any, bold?: boolean) {
	const yellow = '#ffe588';
	return color(message, yellow, bold);
}

export function red(message: any, bold?: boolean) {
	// const pink = '#F0B6D5';
	const red = '#FF6961';
	return color(message, red, bold);
}

export function gray(message: any, bold?: boolean) {
	const gray = '#6d757a';
	return color(message, gray, bold);
}