import * as fs from 'fs';
import * as readline from 'readline';

async function day2(): Promise<void> {
  const inputFile = fs.createReadStream('./day2/input.txt');
  const inputLines = readline.createInterface({
    input: inputFile,
    crlfDelay: Infinity,
  });

  type ElfChoice = 'A' | 'B' | 'C';
  type MyChoice = 'X' | 'Y' | 'Z';
  type Outcome = [ElfChoice, MyChoice];

  // for the first variant
  const wins = ['A Y', 'B Z', 'C X'];
  const ties = ['A X', 'B Y', 'C Z'];

  // for the second variant
  const rocks = ['A Y', 'B X', 'C Z'];
  const papers = ['A Z', 'B Y', 'C X'];

  let score1 = 0;
  let score2 = 0;
  for await (const inputLine of inputLines) {
    const outcome = inputLine.split(' ') as Outcome;

    if (outcome[1] === 'X') {
      score1 += 1; // I used rock // I lost
    } else if (outcome[1] === 'Y') {
      score1 += 2; // I used paper
      score2 += 3; // I tied
    } else {
      score1 += 3; // I used scissors
      score2 += 6; // I won
    }

    if (wins.includes(inputLine)) score1 += 6;
    else if (ties.includes(inputLine)) score1 += 3;

    if (rocks.includes(inputLine)) score2 += 1;
    else if (papers.includes(inputLine)) score2 += 2;
    else score2 += 3;
  }

  console.log(`For the first variant, my score is ${score1}`);
  console.log(`For the second variant, my score is ${score2}`);
}

day2();
