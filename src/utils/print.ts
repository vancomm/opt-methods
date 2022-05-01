import chalk from "chalk";

function printColored(message: any, color: string) {
	const colored = chalk.hex(color).bold(message);
	console.log(colored);
}

export function success(message: any) {
	const green = '#C1E1C1';
	printColored(message, green);
}

export function message(message: any) {
	const yellow = '#F7F29B';
	printColored(message, yellow);
}

export function error(message: any) {
	// const pink = '#F0B6D5';
	const red = '#FF6961';
	printColored(message, red);
}