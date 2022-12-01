import * as fs from 'fs';
import * as readline from 'readline';

async function day1(): Promise<void> {
  const inputFile = fs.createReadStream('./day1/input.txt');
  const inputLines = readline.createInterface({
    input: inputFile,
    crlfDelay: Infinity,
  });

  const elves: number[] = [];

  let sum = 0;
  for await (const inputLine of inputLines) {
    if (inputLine !== '') {
      sum += parseInt(inputLine);
    } else {
      elves.push(sum);
      sum = 0;
    }
  }

  elves.sort((a, b) => b - a);
  console.log(`The elf with most calories has ${elves[0]} of them`);
  console.log(
    `The top three elves have calories has ${
      elves[0] + elves[1] + elves[2]
    } calories together`,
  );
}

day1();
