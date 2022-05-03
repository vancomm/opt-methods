import chalk from "chalk";

function color(message: any, color: string) {
	const colored = chalk.hex(color).bold(message);
	return colored;
}

export function green(message: any) {
	const green = '#b5e990';
	return color(message, green);
}

export function yellow(message: any) {
	const yellow = '#ffe588';
	return color(message, yellow);
}

export function red(message: any) {
	// const pink = '#F0B6D5';
	const red = '#FF6961';
	return color(message, red);
}