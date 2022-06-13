import { program } from 'commander';
import * as imports from './labs/index.js';

export default function cli() {
  const labs = Object.values(imports);

  program
    .argument('<index>', '1-based index of the lab')
    .action(async (num) => {
      try {
        const index = parseFloat(num) - 1;
        if (!Number.isInteger(index)) throw new Error('Bad index!');
        if (index >= labs.length) throw new Error(`Lab ${index + 1} not implemented!`);
        const lab = labs[index];
        lab();
      } catch (error: any) {
        console.log(error.message);
      }
    });

  program.parse();
}
