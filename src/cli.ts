import { program } from 'commander';
import { exports as labs } from './labs.js'

export function cli() {
	program
		.argument('<index>', '1-based index of the lab')
		.action((num) => {
			try {
				const index = Number(num) - 1;

				if (index >= labs.length) {
					console.log('No such lab!');
					return;
				}

				const lab = labs[index];
				lab();
			} catch (error) {
				console.log('Error!');
			}
		});
	program.parse();
}
